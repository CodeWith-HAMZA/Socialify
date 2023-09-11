"use client";

import { ObjectId } from "mongoose";
import { Schema } from "zod";

interface ThreadProps {
  threadId: ObjectId;
  author: ObjectId; // Assuming author is of type string
  threadText: string;
  parentId: string;
  community: ObjectId | null; // Assuming community can be null or a string
  children: ObjectId[]; // Assuming children is an array of string IDs Of Itself means {{Thread-Model}}
}

const ThreadCard = ({
  threadId,
  author,
  threadText,
  parentId,
  community,
  children,
}: ThreadProps) => {
  console.log(threadText);
  const threadCard = (
    <article className="flex flex-col p-3 m-4 justify-center bg-[#2C2D32] rounded-2xl">
      <div className="flex gap-2">
        <img
          src="/logo.svg"
          className="h-[2.2rem] w-[2.2rem]  "
          alt="profile"
        />
        <div className="userText ">
          <h1 className="text-sm mb-1 font-semibold text-gray-100">
            Hamza Shaikh
          </h1>
          <p className="text-xs text-gray-300 "> {threadText}</p>
        </div>
      </div>
    </article>
  );

  return threadCard;
};
// console.log()
// this is the thread card

export default ThreadCard;
