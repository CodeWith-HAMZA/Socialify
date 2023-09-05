"use client";
//app/page.tsx
import { UploadButton } from "@/utils/uploadthing";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="my-8 px-2">
      {/* <UserButton afterSignOutUrl="/" /> */}
      {/* <h1 className="">e<SignedIn>SignnedIn Material</SignedIn> i</h1> */}
      <h1 className="text-2xl font-semibold ">Home</h1>
      <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
    </div>
  );
}
// NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGV2b3RlZC1mb3gtNTYuY2xlcmsuYWNjb3VudHMuZGV2JA
// CLERK_SECRET_KEY=sk_test_zqPqWVIPj9wgdhsr7F4bXppvN2npMATdVrv2nMDqA6

// NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
// NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
// NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
// NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
