"use server";
import User, { IUserSchema } from "@/lib/models/user.model";
import connectToMongoDB from "../db/connectToMongoDB";
import { revalidatePath } from "next/cache";
type UserParams = Required<
  SelectKeys<IUserSchema, "username" | "name" | "image" | "bio"> & {
    path: string;
    userId: string | undefined;
  }
>;

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

    const createdUser = await User.create(<Required<IUserSchema>>{
      clerkId: userId,
      username: username,
      name: name,
      image: image,
      onboarded: true,
      bio: bio,
    });
    console.log("created User ", createdUser);
    // // * Update The Current Data Through Its Clerk Id
    // await User.findOneAndUpdate({ clerkId: userId }, <IUserSchema>{
    //   username: username.toLowerCase(),
    //   name,
    //   bio,
    //   image,
    //   onboarded: true,
    // });

    if (path === "/profile/edit") return revalidatePath(path);
  } catch (error: any) {
    throw new Error(
      `Failed To Update User in DB 'user.acitons.ts': ${error?.message}`
    );
  }
}
