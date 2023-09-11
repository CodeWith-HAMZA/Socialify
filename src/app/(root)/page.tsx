import ThreadsContainer from "@/components/ThreadsContainer";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import connectToMongoDB from "@/lib/db/connectToMongoDB";
import ThreadModel, { IThreadSchema } from "@/lib/models/thread.model";

import { UploadButton } from "@/utils/uploadthing";
import { SignedIn, UserButton, currentUser } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  await connectToMongoDB();
  const { threads, isNextPage, totalThreadsCount } = await fetchThreads(1, 5);

  return (
    <div className="my-8 px-2 overflow-hidden ">
      {/* <UserButton afterSignOutUrl="/" /> */}
      {/* <h1 className="">e<SignedIn>SignnedIn Material</SignedIn> i</h1> */}
      <h1 className="text-2xl font-semibold ">Home</h1>
      <main className=" overflow-hidden">
        <ThreadsContainer
          threads={threads}
          isNextPage={isNextPage}
          totalThreadsCount={totalThreadsCount}
        ></ThreadsContainer>
      </main>
    </div>
  );
}
// NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGV2b3RlZC1mb3gtNTYuY2xlcmsuYWNjb3VudHMuZGV2JA
// CLERK_SECRET_KEY=sk_test_zqPqWVIPj9wgdhsr7F4bXppvN2npMATdVrv2nMDqA6

// NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
// NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
// NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
// NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
