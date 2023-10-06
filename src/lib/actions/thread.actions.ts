"use server";
// On Home
import { revalidatePath } from "next/cache";
import ThreadModel, { IThreadSchema } from "../models/thread.model";
import UserModel, { IUserSchema } from "../models/user.model";
import connectToMongoDB from "../db/connectToMongoDB";
import { ObjectId } from "mongoose";
import { isLikedByTheUser, safeAsyncOperation } from "../utils";
type ThreadParams = SelectKeys<
  IThreadSchema,
  "threadText" | "community" | "author"
> & { path: string };
export async function createThread({
  threadText,
  community,
  author,
  path,
}: ThreadParams) {
  await connectToMongoDB();
  console.log("Hamza Shaikh", threadText, community, author, path);
  const createdThread: IThreadSchema = await ThreadModel.create(<ThreadParams>{
    author,
    threadText,
    community,
  });

  // * Updating User's Threads By Pushing recently-created-thread's Id In User's threads-[array]

  await UserModel.findByIdAndUpdate(author, {
    $push: { threads: createdThread["_id"] },
  });

  // * Updating The Cache With Recently(Most Updated) Fetched Data
  revalidatePath(path);
}

export async function fetchThreads(
  pageNumber: number = 1,
  pageSize: number = 10
) {
  console.log(pageNumber, pageSize);
  const skipNumberOfThreads = (pageNumber - 1) * pageSize;
  await connectToMongoDB();

  const threadsQuery = ThreadModel.find({
    parentId: { $in: [null, undefined] },
  })
    .skip(skipNumberOfThreads)
    .limit(pageSize)
    .sort({ createdAt: "desc" })
    .populate({ path: "author", model: UserModel })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: UserModel,
        select: "_id name parentId image createdAt",
      },
    });

  const totalThreadsCount: number = await ThreadModel.countDocuments({
    parentId: { $in: [null, undefined] },
  });
  const threads = await threadsQuery.exec();

  const isNextPage = !(
    totalThreadsCount - 1 <
    skipNumberOfThreads + threads.length
  );

  return { threads, isNextPage, totalThreadsCount };
}

export async function fetchThreadById(id: ObjectId): Promise<IThreadSchema> {
  console.log("first");
  await connectToMongoDB();
  const thread = await ThreadModel.findById(id)
    .populate({
      path: "author",
      model: UserModel,
      select: "_id username name image createdAt",
    })
    .populate({
      path: "children",
      populate: [
        {
          path: "author",
          model: UserModel,
          select: "_id username name parentId image createdAt",
        },
        {
          path: "children",
          model: ThreadModel,
          populate: {
            path: "author",
            model: UserModel,
            select: "_id username name parentId image createdAt",
          },
        },
      ],
    });
  console.log(thread, "TTTT");
  return <Promise<IThreadSchema>>thread;
}

type PostThreadReplyProps = {
  threadId: string;
  replyText: string;
  userId: string;
  path: string;
};

export async function postThreadReply({
  threadId,
  replyText,
  userId,
  path,
}: PostThreadReplyProps) {
  try {
    // return { threadId, replyText, userId, path };
    await connectToMongoDB();

    // Finding parent-thread by Id from "thread-details-page"
    const parentThread = await ThreadModel.findById(threadId);

    if (!parentThread) {
      throw new Error("Thread not found");
    }

    // Creating an instance of the to-be-created newChildThreadReply
    const childReplyThread = new ThreadModel({
      author: userId,
      threadText: replyText,
      parentId: threadId,
    });

    // Now, saving into the database
    const savedNewChildThreadReply = await childReplyThread.save();

    // Pushing the newly created-Thread-Reply (child-thread) into "children" of the parent-thread (parent-thread)
    parentThread.children.push(savedNewChildThreadReply._id);

    // Now, saving the parentThread back to the database
    await parentThread.save();
  } catch (error: unknown) {
    console.error("An error occurred:", error?.message);
  }
  revalidatePath(path);
  return;
}


export async function fetchUserPosts(userId: string): Promise<IUserSchema[]> {
  try {
    await connectToMongoDB();
    const user = await UserModel.findById(userId).populate({
      path: "threads",
      model: ThreadModel,
      populate: [
        {
          path: "author",
          model: UserModel,
          select: "_id username name parentId image createdAt",
        },
        {
          path: "children",
          model: ThreadModel,

          populate: {
            path: "author",
            model: UserModel,
            select: "_id username name parentId image createdAt",
          },
        },
      ],
    });
    return user;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getActivity(
  userId: string
): Promise<ReplaceProperty<IThreadSchema, "author", IUserSchema>[]> {
  // * Fetching All threads of the Given-User (Current-User) through its "userId"
  const userThreads: IThreadSchema[] = await ThreadModel.find({
    author: userId,
  });

  // * Collecting and make a seperate Array of All the "child-threads" of "each-thread"
  const childThreadIds = userThreads.flatMap(
    (userThread) => userThread["children"]
  );
  // const childThreadIds = userThreads.reduce((acc, userThread) => {
  //   return [...acc, ...userThread["children"]];
  // }, []);

  // const childThreadIds = userThreads.reduce((acc, userThread) => {
  //   return acc.concat(userThread["children"]);
  // }, []
  // );

  // * Fetching All threads and Excluding the "reply-threads" For A given-user (current-User)
  const replies = await ThreadModel.find({
    _id: { $in: childThreadIds },
    author: { $ne: userId },
    // author: { $ne: userId },   // should be on
  }).populate("author", "_id name username image createdAt ", UserModel);

  return replies;
}
export const updateLikes = async (
  userId: ObjectId,
  threadId: ObjectId,
  path: string
): Promise<boolean | null> => {
  return safeAsyncOperation(async () => {
    // * both targeted thread-id and user-id are required to proceed further
    if (!threadId || !userId) {
      throw new Error(
        "Both 'threadId' and 'userId' are required for updating likes "
      );
    }
    // * Fetching Thread By Its Given Id
    const thread = await ThreadModel.findById(threadId);

    // * Likes field must be exist to move further
    if (thread["likes"]) {
      // ? Find The User If It has Liked Or Not, Find The current-User In The "likes-Array"
      const userLikeFound = isLikedByTheUser(thread["likes"], userId);

      // * if found then pop, or push the userId to the Likes-Array
      userLikeFound
        ? thread["likes"].pop(userId)
        : thread["likes"].push(userId);
    } else {
      // ? If 'likes' field not found or undefined, Assign The Array Of The Single User-Id (string) To That Field (likes)
      thread["likes"] = [userId];
    }
    await thread.save();

    // * Revalidae data by fetching the most updated data from DB in Nextjs -> (Great-Feature)
    revalidatePath(path);
    return true;
  });
};

// .populate({
//   path: "children",
//   populate: [
//     {
//       path: "author",
//       model: UserModel,
//       select: "_id username name parentId image",
//     },
//     {
//       path: "children",
//       model: ThreadModel,
//       populate: {
//         path: "author",
//         model: UserModel,
//         select: "_id username name parentId image",
//       },
//     },
//   ],
// });
