import connectToMongoDB from "@/lib/db/connectToMongoDB";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import UserModel from "@/lib/models/user.model";
import ThreadModel from "@/lib/models/thread.model";

export async function GET() {
  const data = await currentUser();
  await connectToMongoDB();

  const users = await UserModel.find();
  const threads = await ThreadModel.find();
  return NextResponse.json({ ...{ data, users, threads } });
}
