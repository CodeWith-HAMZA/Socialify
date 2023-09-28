"use client";
import { IThreadSchema } from "@/lib/models/thread.model";
import Link from "next/link";

export default function ActivityCard({ reply }: any) {
  return (
    <div
      onClick={() => {
        console.log(reply);
      }}
      className="bg-gray-800 p-4 rounded-xl rounded-tl-none shadow-md mt-2"
    >
      <div className="flex items-center">
        {/* Left side: Profile Image */}
        <img
          src={reply.author.image}
          alt="Profile"
          className="w-9 h-9 rounded-full mr-4 justify-self-start"
        />

        {/* Right side: Text */}
        <div className="text-sm">
          <Link href={"#"} className="text-gray-200 font-semibold mr-3">
            {reply.author.name}
          </Link>
          <Link href={"#"} className="text-violet-400">
            Replied Your Thread
          </Link>
        </div>
      </div>

      <div className="text-xs pl-12 text-gray-400">"{reply.threadText}..."</div>
    </div>
  );
}
