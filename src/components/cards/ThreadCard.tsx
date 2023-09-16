"use client";

import { IUserSchema } from "@/lib/models/user.model";
import { ObjectId } from "mongoose";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface ThreadProps {
  threadId: ObjectId;
  author: IUserSchema; // Assuming author is of type string
  threadText: string;
  parentId: string;
  community: ObjectId | null; // Assuming community can be null or a string
  children: ObjectId[]; // Assuming children is an array of string IDs Of Itself means {{Thread-Model}}
  isComment?: boolean;
}

const ThreadCard = ({
  threadId,
  author,
  threadText,
  parentId,
  community,
  children: comments,
  isComment,
}: ThreadProps) => {
  const routeToThreadDetails = (
    <div className="thread-details mt-3">
      <Link href={`/thread/${threadId}`}>
        <span className="text-xs flex gap-0.5  items-center text-gray-300 hover:text-gray-100">
          <span>See More</span>
          <span>
            <RightArrow />
          </span>
        </span>
      </Link>
    </div>
  );
  const threadReplies = (
    <div className="replies mt-2.5">
      {comments.length === 0 ? (
        <button className="text-gray-200 flex items-center gap-1 font-semibold rounded-xl bg-[#e4e4e426] py-1.5 px-3 transition-all hover:bg-[#e4e4e436] ">
          <span>
            <ReplyDownArrow />
            {/* <ReplyUpArrow /> */}
          </span>
          <span>Replies</span>
        </button>
      ) : null}
    </div>
  );
  const threadCard = (
    <article className="flex flex-col p-3 m-4 justify-center bg-[#746ddd51] rounded-2xl">
      <div className="flex gap-2">
        <img
          src={author?.["image"]}
          className="h-[2.2rem] w-[2.2rem] rounded-full "
          alt="profile"
        />
        <div className="userText">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <h1
                  // title={"Author: " + author?.["name"]}
                  className="text-xs cursor-pointer mb-1 font-semibold text-gray-100"
                >
                  {author?.["name"]}
                </h1>
              </TooltipTrigger>
              <TooltipContent>
                <p>{"Author: " + author?.["name"]}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="text-sm mt-1 text-gray-300">
            <p className="">{threadText}</p>
            {routeToThreadDetails}
            <div className="flex items-center mt-2 gap-2">
              <Image
                src={"/assets/heart-gray.svg"}
                className="cursor-pointer hover:text-white"
                width={23}
                alt="heart-gray"
                height={23}
              />
              <Image
                src="/assets/reply.svg"
                alt="heart"
                width={23}
                height={23}
                className="cursor-pointer object-contain"
              />
              <Image
                src="/assets/repost.svg"
                alt="heart"
                width={23}
                height={23}
                className="cursor-pointer object-contain"
              />
              <Image
                src="/assets/share.svg"
                alt="heart"
                width={23}
                height={23}
                className="cursor-pointer object-contain"
              />
            </div>
            {threadReplies}
            {/* <div className="comments">
              {isComment && comments.length ? <>comments</> : <>No Comments</>}
            </div> */}
          </div>
        </div>
      </div>
    </article>
  );

  return threadCard;
};
// console.log()
// this is the thread card

function ReplyDownArrow() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-3.5 h-3.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </>
  );
}
function ReplyUpArrow() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-3.5 h-3.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    </>
  );
}

function RightArrow() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </>
  );
}

export default ThreadCard;
