import mongoose, { Schema, Document } from "mongoose";

export interface IThreadSchema extends Document {
  threadText: string;
  author: Schema.Types.ObjectId; // Reference to User collection
  community: Schema.Types.ObjectId | null; // Reference to Community collection
  parentId: string; // Parent Id
  children: Schema.Types.ObjectId[]; // Array of references to Thread collection
}

const threadSchema: Schema<IThreadSchema> = new Schema<IThreadSchema>(
  {
    threadText: {
      type: String,
      required: [true, "Thread Text Is Required"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author Is Required"],
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
    },
    parentId: {
      type: String,
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thread",
      },
    ],
  },
  { timestamps: true }
);

const ThreadModel =
  mongoose.models["Thread"] ||
  mongoose.model<IThreadSchema>("Thread", threadSchema);

export default ThreadModel;
