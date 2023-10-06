import mongoose, { Schema, Document } from "mongoose";

export interface IThreadSchema extends Document {
  threadText: string;
  author: Schema.Types.ObjectId; // Reference to User collection
  media: {
    type: string; // "image" or "video"
    url: string; // URL to the image or video file
  }[];
  community: Schema.Types.ObjectId | null; // Reference to Community collection
  parentId: string; // Parent Id
  children: Schema.Types.ObjectId[]; // Array of references to Thread collection
  likes: Schema.Types.ObjectId[];
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
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

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
