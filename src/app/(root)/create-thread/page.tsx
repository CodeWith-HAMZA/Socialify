import PostThread from "@/components/forms/PostThread";
import connectToMongoDB from "@/lib/db/connectToMongoDB";
import UserModel from "@/lib/models/user.model";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const CreateThreadPage = async () => {
  const clerkUser = await currentUser();
  await connectToMongoDB();
  const user = await UserModel.findOne({ clerkId: clerkUser?.["id"] });
  // console.log(user, "hamza");
  if (!user) return redirect("/sign-up");

  return (
    <div className="pt-7 pl-4">
      <h1 className="font-bold text-2xl mb-6">Post Thread</h1>
      <PostThread
        userId={JSON.parse(JSON.stringify({ userMongoId: user?._id }))}
      />
    </div>
  );
};

export default CreateThreadPage;
