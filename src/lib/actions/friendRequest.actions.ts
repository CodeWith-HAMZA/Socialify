"use server";

import { revalidatePath } from "next/cache";
import connectToMongoDB from "../db/connectToMongoDB";
import FriendRequestModel, {
  IFriendRequestSchema,
} from "../models/friendRequest.model";
import { safeAsyncOperation } from "../utils";
import UserModel, { IUserSchema } from "../models/user.model";

export async function sendFriendRequest(
  senderId: string,
  recipientId: string,
  path: string
) {
  return await safeAsyncOperation(async () => {
    await connectToMongoDB();
    // Check if a friend request already exists between the sender and recipient
    const existingRequest = await FriendRequestModel.findOne({
      sender: senderId,
      recipient: recipientId,
    });

    if (existingRequest) {
      throw new Error("Friend request already sent.");
    }

    // Create and save a new friend request
    const friendRequest: IFriendRequestSchema = new FriendRequestModel({
      sender: senderId,
      recipient: recipientId,
    });
    await friendRequest.save();

    revalidatePath(path);
  });
}

export async function acceptFriendRequest(
  senderId: string,
  recipientId: string,
  path: string
) {
  return safeAsyncOperation(async () => {
    await connectToMongoDB();
    // Find and update the friend request to mark it as accepted
    const requestToUpdate = await FriendRequestModel.findOne({
      sender: senderId,
      recipient: recipientId,
    });

    if (!requestToUpdate) {
      throw new Error("Friend request not found.");
    }

    requestToUpdate["isAccepted"] = true;
    await requestToUpdate.save();

    revalidatePath(path);
    // Add each user to the other's list of friends (You may need to adjust this based on your user schema)
    // Add senderId to recipient's friends list
    // Add recipientId to sender's friends list
  });
}

export type FriendRequest = ReplaceProperty<
  IFriendRequestSchema,
  "sender",
  IUserSchema
>;
export async function getPendingReceivedFriendRequests(
  userId: string
): Promise<FriendRequest[] | null> {
  await connectToMongoDB();
  const pendingRequests = await FriendRequestModel.find({
    recipient: userId,
    isAccepted: false,
  }).populate("sender", "_id name username image ", UserModel);

  return await pendingRequests;
}

export async function getFriends(userId: string): Promise<string[] | null> {
  return await safeAsyncOperation(async () => {
    await connectToMongoDB();
    const friendRequests = await FriendRequestModel.find({
      $or: [{ sender: userId }, { recipient: userId }],
      isAccepted: true,
    });

    // Extract the IDs of the users who are friends
    const friends = friendRequests.map((request) => {
      if (request.sender.toString() === userId) {
        return request.recipient.toString();
      }
      return request.sender.toString();
    });

    return friends;
  });
}

export async function getPendingSentFriendRequests(
  userId: string,
  path: string
): Promise<IFriendRequestSchema[] | null> {
  const asyncFn = async () => {
    await connectToMongoDB();
    const pendingRequests = await FriendRequestModel.find({
      sender: userId,
      isAccepted: false,
    });

    return pendingRequests;
  };

  return await safeAsyncOperation(asyncFn);
}

export async function countSentFriendRequests(
  userId: string
): Promise<number | null> {
  const asyncFn = async () => {
    await connectToMongoDB();
    const count = await FriendRequestModel.countDocuments({
      sender: userId,
    });

    return count;
  };

  return await safeAsyncOperation(asyncFn);
}

export async function countReceivedFriendRequests(
  userId: string
): Promise<number | null> {
  const asyncFn = async () => {
    await connectToMongoDB();
    const count = await FriendRequestModel.countDocuments({
      recipient: userId,
      isAccepted: false,
    });

    return count;
  };

  return await safeAsyncOperation(asyncFn);
}

export async function rejectFriendRequest(requestId: string, path: string) {
  const asyncFn = async () => {
    const deletedRequest = await FriendRequestModel.findOneAndRemove({
      _id: requestId,
    });

    if (!deletedRequest) {
      throw new Error("Friend request not found");
    }
    revalidatePath(path);
  };

  return await safeAsyncOperation(asyncFn);
}
