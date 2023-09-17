"use client";
import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import Image from "next/image";
import { ObjectId } from "mongoose";
import { postThreadReply } from "@/lib/actions/thread.actions";

interface Props {
  author: string;
  currentUser: object | null;
  children?: object[];
  community: object | null;
  parentId: object | null;
  threadText: string;
  threadId: ObjectId;
  isComment?: boolean;
}

const ThreadReply: React.FC<Props> = ({
  currentUser,
  threadId,
  author,
  threadText,
  parentId,
  community,
  children: comments,
  isComment,
}) => {
  const [thread, setThread] = useState<string>(""); // Initialize the "thread" state

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Handle form submission here, you can access the "thread" value using the "thread" state
    const th = await postThreadReply({
      threadId: threadId,
      replyText: thread,
      userId: currentUser["_id"],
    });
    console.log(th, "ue");

    // Reset the "thread" state after submission
  };

  return (
    <div className="m-4 py-5 px-1 rounded-2xl flex gap-2 justify-start items-start">
      <Image
        src={currentUser?.["image"]}
        className="rounded-full"
        width={24}
        height={24}
        alt="profile"
      />
      <form onSubmit={handleSubmit} className="w-full">
        <div className="">
          {/* <label htmlFor="thread">Write Your Thread Reply</label> */}
          <Textarea
            id="thread"
            value={thread}
            rows={2}
            className="focus:outline-none mb-4 focus-visible:ring-0   w-full "
            onChange={(e) => setThread(e.target.value)} // Update the "thread" state on input change
            placeholder="Write Your Thread Reply"
          ></Textarea>
        </div>

        <Button
          type="submit"
          className="transition-all"
          disabled={thread.length === 0}
        >
          Post Comment
        </Button>
      </form>
    </div>
  );
};

export default ThreadReply;
