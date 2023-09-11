"use server";

import { revalidatePath } from "next/cache";
import ThreadModel, { IThreadSchema } from "../models/thread.model";
import UserModel from "../models/user.model";
import connectToMongoDB from "../db/connectToMongoDB";
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

// export async function fetchPosts(pageNumber = 1, pageSize = 20) {
//   connectToDB();

//   // Calculate the number of posts to skip based on the page number and page size.
//   const skipAmount = (pageNumber - 1) * pageSize;

//   // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
//   const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
//     .sort({ createdAt: "desc" })
//     .skip(skipAmount)
//     .limit(pageSize)
//     .populate({
//       path: "author",
//       model: User,
//     })
//     .populate({
//       path: "community",
//       model: Community,
//     })
//     .populate({
//       path: "children", // Populate the children field
//       populate: {
//         path: "author", // Populate the author field within children
//         model: User,
//         select: "_id name parentId image", // Select only _id and username fields of the author
//       },
//     });

//   // Count the total number of top-level posts (threads) i.e., threads that are not comments.
//   const totalPostsCount = await Thread.countDocuments({
//     parentId: { $in: [null, undefined] },
//   }); // Get the total count of posts

//   const posts = await postsQuery.exec();

//   const isNext = totalPostsCount > skipAmount + posts.length;

//   return { posts, isNext };
// }
