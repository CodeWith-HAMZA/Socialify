"use server";

import { revalidatePath } from "next/cache";
import ThreadModel, { IThreadSchema } from "../models/thread.model";
import UserModel from "../models/user.model";
import connectToMongoDB from "../db/connectToMongoDB";
import { ObjectId } from "mongoose";
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
        select: "_id name parentId image",
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
      select: "_id username name image",
    })
    .populate({
      path: "children",
      populate: [
        {
          path: "author",
          model: UserModel,
          select: "_id username name parentId image",
        },
        {
          path: "children",
          model: ThreadModel,
          populate: {
            path: "author",
            model: UserModel,
            select: "_id username name parentId image",
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

export async function updateLikes(
  currentUser: object,
  threadId: string
): Promise<void> {
  return;
}
