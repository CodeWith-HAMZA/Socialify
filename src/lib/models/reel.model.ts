import mongoose, { Date, ObjectId, Schema } from "mongoose";
export interface IReelSchema extends Document {
  user: Schema.Types.ObjectId;
  caption?: string;
  videoUrl: string;
  likes: Schema.Types.ObjectId[];
  disLikes: Schema.Types.ObjectId[];
  comments: [{ thread: ObjectId; createdAt: Date }];
  createdAt: Date;
}

const reelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  caption: String,
  videoUrl: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (for likes)
    },
  ],
  disLikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (for dislikes)
    },
  ],

  comments: [
    {
      thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread", // Reference to the User model (for comments)
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reel = mongoose.model("Reel", reelSchema);

export default Reel;
