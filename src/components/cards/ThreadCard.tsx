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

interface ThreadProps {
  threadId: ObjectId;
  author: IUserSchema; // Assuming author is of type string
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
  console.log(author);
  const threadCard = (
    <article className="flex flex-col p-3 m-4 justify-center bg-[#2C2D32] rounded-2xl">
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

          <div className="text-xs mt-1 text-gray-300">
            <p className="">{threadText}</p>
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
          </div>
        </div>
      </div>
    </article>
  );

  return threadCard;
};
// console.log()
// this is the thread card

export default ThreadCard;
