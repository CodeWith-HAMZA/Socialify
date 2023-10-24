import AccountProfile from "@/components/forms/AccountProfile";
import connectToMongoDB from "@/lib/db/connectToMongoDB";
import UserModel, { IUserSchema } from "@/lib/models/user.model";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import React, { useEffect } from "react";

const OnboardingSection = ({ children }: { children: React.ReactNode }) => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-semibold my-3">Onboarding</h1>
    <p>
      Complete your Profile, An adventurous soul with a passion for learning,
      connecting, and making a positive impact
    </p>
    <section>{children}</section>
  </div>
);

const OnboardingPage = async () => {
  // * Fetching Current (SignnedIn) User From CLerk
  const clerkUser = await currentUser();
  if (!clerkUser) return redirect("/sign-up");

  // * Connecting To Mongodb
  await connectToMongoDB();

  // TODO: Gotta Remove The fetching-User from 'mongo',
  // as when he is landed first time on the onboarding after signup from clerk,
  // He wouldn't have any kind of record in the mongo-db
  // * Querying For The user through its clerkId
  const mongoUser: SelectKeys<
    IUserSchema,
    "_id" | "image" | "bio" | "username" | "name" | "clerkId"
  > | null = (await UserModel.findOne({ clerkId: clerkUser?.id })) ?? {};
  if (mongoUser?.["onboarded"]) {
    redirect("/");
  }

  let accountProfile: React.ReactNode | null =
    clerkUser || mongoUser ? (
      // client-side component
      <AccountProfile
        user={{
          ...clerkUser,
          name:
            mongoUser?.name ||
            `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}` ||
            "",
          username: mongoUser?.username || clerkUser?.username || "",
          image: mongoUser?.image || clerkUser?.imageUrl || "",
          bio: mongoUser?.bio || "",
        }}
        BtnText="Continue"
      />
    ) : null;
  return (
    // server-side-component
    <OnboardingSection>{accountProfile}</OnboardingSection>
  );
};

export default OnboardingPage;
