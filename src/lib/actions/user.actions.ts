"use server";
// * whole code runs on server
import User, { IUserSchema } from "@/lib/models/user.model";
import connectToMongoDB from "../db/connectToMongoDB";
import { revalidatePath } from "next/cache";
import { FilterQuery, ObjectId, SortOrder, _FilterQuery } from "mongoose";
import { removeExtraSpaces } from "../utils";
type UserParams = Required<
  SelectKeys<IUserSchema, "username" | "name" | "image" | "bio"> & {
    path: string;
    userId: string | undefined;
  }
>;

export async function fetchUser(
  clerkId: string,
  mongoId: string = ""
): Promise<IUserSchema | null> {
  await connectToMongoDB();

  let mongoUser: IUserSchema | null = null;
  if (clerkId) {
    mongoUser = await User.findOne({ clerkId });
  } else if (mongoId) {
    mongoUser = await User.findById(mongoId);
  }
  return mongoUser;
}

export async function updateUserData({
  userId,
  username,
  name,
  image,
  bio,
  path,
}: UserParams): Promise<void> {
  try {
    if (!userId) return;

    await connectToMongoDB();

    const user = await User.findOne({ clerkId: userId });

    if (user) {
      // * Update The Current Data Through Its Clerk Id
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: userId },
        <IUserSchema>{
          username: username.toLowerCase(),
          name,
          bio,
          image,
          // onboarded: true,
        },
        { upsert: true }
      );
    } else {
      const createdUser = await User.create(<Required<IUserSchema>>{
        clerkId: userId,
        username: username.toLowerCase(),
        name,
        image,
        onboarded: true,
        bio,
      });
    }

    if (path === "/profile/edit") revalidatePath(path);
    revalidatePath("/");
  } catch (error: any) {
    throw new Error(
      `Failed To Update User in DB 'user.acitons.ts': ${error?.message}`
    );
  }
}

export async function fetchUsers(
  userId: string,
  pageSize: number = 10,
  pageNumber: number = 1,
  searchString: string = "",
  sortBy?: SortOrder
) {
  try {
    const pageSize = 3; // Number of documents per page

    // Calculate the number of documents to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    await connectToMongoDB();

    let q: FilterQuery<typeof User & IUserSchema> = {
      id: { $ne: userId },
    };

    if (removeExtraSpaces(searchString) !== "") {
      // * Converting Into Regular-expressions for matching the string
      const searchStringRegex = new RegExp(searchString ?? "", "i");
      q.$or = [
        { username: { $regex: searchStringRegex } },
        { name: { $regex: searchStringRegex } },
      ];
    }

    const usersQuery = User.find(q)
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ createdAt: sortBy });

    const users: IUserSchema[] = await usersQuery.exec();

    const totalUsersCount: number = await User.countDocuments(q);

    const isNext: boolean = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {}
  return;
}

export async function toggleFollow(
  targetId: string,
  followerId: string,
  path: string
): Promise<void> {
  try {
    const followerUser: IUserSchema = await User.findById(followerId);
    const targetUser: IUserSchema = await User.findById(targetId);

    if (!followerUser || !targetUser) {
      throw new Error("Both Users Must Exist For toggleFollow fn");
    }

    if (!followerUser["followings"]) {
      followerUser["followings"] = [];
    }
    if (!followerUser["followers"]) {
      followerUser["followers"] = [];
    }
    if (!targetUser["followings"]) {
      targetUser["followings"] = [];
    }
    if (!targetUser["followers"]) {
      targetUser["followers"] = [];
    }
    const isFollowing = targetUser.followers.includes(followerId);

    if (isFollowing) {
      // If already following, unfollow
      targetUser.followers = targetUser.followers.filter(
        (id: any) => id.toString() !== followerId
      );
      followerUser.followings = followerUser.followings.filter(
        (id: any) => id.toString() !== targetId
      );
    } else {
      // If not following, follow
      targetUser.followers.push(followerId);
      followerUser.followings.push(targetId);
    }

    await targetUser.save();
    await followerUser.save();
    revalidatePath(path);
  } catch (error) {
    console.error("Error toggling follow:", error);
    throw error;
  }
}
