import mongoose, { Schema, Document, Date, DateUnit } from "mongoose";

export interface ICommunitySchema extends Document {
  name: string;
  description: string;
  image: string;
  bio:string;
  members: Schema.Types.ObjectId[]; // ref: 'User'
  createdAt: DateUnit;
  updatedAt: DateUnit;
}

const communitySchema: Schema<ICommunitySchema> = new Schema<ICommunitySchema>(
  {
    name: { type: String, required: true },
    description: {
      type: String,
      required: true,
    },
    image: String,  
    bio: String,
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
    ],
  },
  { timestamps: true }
);

const CommunityModel =
  mongoose.models["Community"] ||
  mongoose.model<ICommunitySchema>("Community", communitySchema);

export default CommunityModel;
