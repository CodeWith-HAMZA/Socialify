import connectToMongoDB from "@/lib/db/connectToMongoDB";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import UserModel from "@/lib/models/user.model";

export async function GET() {
  const data = await currentUser();
  const connected = await connectToMongoDB();

  const users = await UserModel.find();
  return NextResponse.json({ data, users });
}
