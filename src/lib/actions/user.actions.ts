"use server";
// * whole code runs on server
import User, { IUserSchema } from "@/lib/models/user.model";
import connectToMongoDB from "../db/connectToMongoDB";
import { revalidatePath } from "next/cache";
type UserParams = Required<
  SelectKeys<IUserSchema, "username" | "name" | "image" | "bio"> & {
    path: string;
    userId: string | undefined;
  }
>;

export async function fetchUser(clerkId: string): Promise<IUserSchema> {
  await connectToMongoDB();
  const mongoUser = await User.findOne({ clerkId });
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
