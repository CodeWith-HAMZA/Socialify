import mongoose, { Schema, Document } from "mongoose";

// Define the schema for the FriendRequest model
export interface IFriendRequestSchema extends Document {
  sender: Schema.Types.ObjectId;
  recipient: Schema.Types.ObjectId;
  isAccepted: boolean;
}

const friendRequestsSchema: Schema<IFriendRequestSchema> =
  new Schema<IFriendRequestSchema>({
    // * Who Sent The Friend Request
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // * Who Received The Friend Request
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // * If True, The "Recipent" Accepted The Sender's Request
    isAccepted: {
      type: Boolean,
    },
    // Add a field to reference the User model
  });

// Create the FriendRequest model
const FriendRequestModel =
  mongoose.models["FriendRequest"] ||
  mongoose.model<IFriendRequestSchema>("FriendRequest", friendRequestsSchema);

export default FriendRequestModel;
