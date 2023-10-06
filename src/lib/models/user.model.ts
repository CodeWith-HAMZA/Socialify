import mongoose, { Schema, Document, Date, DateUnit } from "mongoose";

export interface IUserSchema extends Document {
  clerkId: string;
  username: string;
  name: string;
  email?: string;
  followers: Schema.Types.ObjectId[];
  followings: Schema.Types.ObjectId[];
  image: string;
  bio: string;
  threads: Schema.Types.ObjectId[]; // ref: 'Thread'
  communities: Schema.Types.ObjectId[]; // ref: 'Community'
  onboarded: boolean;
  password: string;
  createdAt: DateUnit;
}

const userSchema: Schema<IUserSchema> = new Schema<IUserSchema>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    followings: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    bio: {
      type: String,
      required: true,
    },
    threads: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thread",
      },
    ],
    communities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Community",
      },
    ],
    onboarded: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel =
  mongoose.models["User"] || mongoose.model<IUserSchema>("User", userSchema);

export default UserModel;
