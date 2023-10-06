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
import { useMemo, useReducer } from "react";
import { fetchUser } from "@/lib/actions/user.actions";
import { updateLikes } from "@/lib/actions/thread.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PiShareFat } from "react-icons/pi";
import { IThreadSchema } from "@/lib/models/thread.model";
import { isLikedByTheUser } from "@/lib/utils";
import { usePathname } from "next/navigation";
interface ThreadProps {
  readonly currentUser: IUserSchema;
  readonly threadId: ObjectId;
  readonly author: IUserSchema; // Assuming author is of type string
  readonly threadText: string;
  readonly parentId: string;
  readonly community: ObjectId | null; // Assuming community can be null or a string
  readonly children: ObjectId[]; // Assuming children is an array of string IDs Of Itself means {{Thread-Model}}
  readonly isComment?: boolean;
  readonly likes?: ObjectId[];
}
// Define action types
type ActionType =
  | "TOGGLE_THREAD_REPLY_FORM"
  | "TOGGLE_THREAD_REPLIES"
  | "TOGGLE_LIKES_COUNT";

// Define the initial state interface
interface State {
  isVisibleReplyForm: boolean;
  isVisibleReplies: boolean;
  isLiked: boolean;
}

// Define the reducer function
const reducer = (state: State, action: { type: ActionType }): State => {
  switch (action.type) {
    case "TOGGLE_THREAD_REPLIES":
      return { ...state, isVisibleReplies: !state.isVisibleReplies };
    case "TOGGLE_THREAD_REPLY_FORM":
      return { ...state, isVisibleReplyForm: !state.isVisibleReplyForm };
    case "TOGGLE_LIKES_COUNT":
      return {
        ...state,
        isLiked: !state.isLiked,
      };

    default:
      return state;
  }
};
const ThreadCard = ({
  threadId,
  author,
  threadText,
  parentId,
  community,
  children: replies,
  isComment,
  currentUser,
  likes,
}: ThreadProps) => {
  const path = usePathname();
  const [state, dispatch] = useReducer(
    reducer, // Define the initial state
    {
      isVisibleReplyForm: false,
      isVisibleReplies: false,
      isLiked: isLikedByTheUser(likes ? likes : [], currentUser?.["_id"]),
    }
  );
  const fetchedLikesFromDB = 23; // TODO: feature needs to be implemented
  const handleLikes = async () => {
    dispatch({ type: "TOGGLE_LIKES_COUNT" });
    await updateLikes(currentUser?.["_id"], threadId, path);
    console.log(currentUser?._id, threadId, "hteuh", state.isLiked);
  };
  const toggleReplyForm = () => dispatch({ type: "TOGGLE_THREAD_REPLY_FORM" });
  const toggleThreadReplies = () => dispatch({ type: "TOGGLE_THREAD_REPLIES" });

  // console.log(replies, "autor");

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

  const repliesToggleButton = replies.length > 0 && (
    <button
      onClick={toggleThreadReplies}
      className="text-gray-200 flex items-center gap-1 font-semibold rounded-xl bg-[#e4e4e426] py-1.5 px-3 transition-all hover:bg-[#e4e4e436] "
    >
      <span>
        {state.isVisibleReplies ? <ReplyUpArrow /> : <ReplyDownArrow />}
      </span>

      <span className="text-xs font-bold">
        {replies.length === 1 ? "1 Reply" : `${replies.length} Replies`}
      </span>
    </button>
  );

  const replyToggleButton = (
    <button
      onClick={toggleReplyForm}
      className="text-gray-200 flex items-center gap-1 font-semibold rounded-xl bg-[#e4e4e426] py-1.5 px-3 transition-all hover:bg-[#e4e4e436] "
    >
      <span>{/* <ReplyUpArrow /> */}</span>
      <span>Reply</span>
    </button>
  );
  const threadReplyForm = (
    <section className="py-6 rounded-lg shadow-md border-gray-600">
      <div className="flex items-center">
        <img
          src={currentUser?.["image"]}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
        <input
          type="text"
          placeholder="Add a thread..."
          className="w-full border rounded-xl px-4 py-2 focus:outline-none border-gray-300 focus:border-purple-300 bg-black text-white"
        />
      </div>
      <button className="flex gap-2 mt-4 ml-14 bg-gray-300 shadow-md hover:bg-gray-400 transition-all text-black font-semibold py-2 px-4 rounded-xl">
        <span>Thread</span>
        <SendIcon />
      </button>
    </section>
  );
  const threadReplies: React.ReactNode[] | React.ReactNode =
    replies.length === 0 ? (
      <p className="text-gray-500 ml-2">No Replies</p>
    ) : (
      replies.map((reply: IThreadSchema) => {
        // console.log(reply, "reply");
        const author: IUserSchema = reply?.["author"] as IUserSchema;
        return (
          <div
            key={reply["_id"]}
            className="bg-[#322f5ee5] px-4 py-3 my-2 rounded-2xl shadow-md"
          >
            <div className="flex items-center space-x-4">
              <img
                src={author["image"]}
                alt="Profile Picture"
                className="w-7 h-7 rounded-full border-2 border-gray-600 self-start"
              />
              <div>
                <div className="flex justify-start gap-2 items-center">
                  <span className="font-semibold">{author?.["name"]}</span>
                  <span className="text-gray-400 text-xs">
                    ({reply?.["createdAt"].toString()})
                  </span>
                </div>
                <p className="text-gray-300 text-xs">{reply?.["threadText"]}</p>
              </div>
            </div>
          </div>
        );
      })
    );

  const threadCard = (
    <article className="flex flex-col p-5 m-4 justify-center bg-[#857df82d] rounded-2xl">
      <section className="flex gap-2">
        <img
          src={author?.["image"]}
          className="h-[2.2rem] w-[2.2rem] rounded-full "
          alt="profile"
        />
        <div className="userText w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={`/profile/${author?.["_id"]}`}
                  // title={"Author: " + author?.["name"]}
                  className="text-xs cursor-pointer mb-1 font-semibold text-gray-100"
                >
                  {author?.["name"]}
                </Link>
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
              <span
                onClick={handleLikes}
                title="Demo Feature (Currently in Process...)"
                className="likes transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {state.isLiked ? (
                  <HeartIconSolid className="h-5 w-5" />
                ) : (
                  <HeartIconOutline className="h-5 w-5" />
                )}
                <span>{Number(likes ? likes.length : fetchedLikesFromDB)}</span>
              </span>
              <Image
                src="/assets/reply.svg"
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
              <Dialog>
                <DialogTrigger>
                  <Image
                    src="/assets/repost.svg"
                    alt="heart"
                    width={23}
                    height={23}
                    className="cursor-pointer object-contain"
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Share With Your All Social Media Handles
                    </DialogTitle>
                    <DialogDescription>
                      <span>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </span>
                      <div className="flex mt-3 gap-4 items-center justify-center">
                        <Input
                          value={`http://localhost:3000/thread${threadId}`}
                        />
                        <Button title="Copy Post Url">
                          <LinkIcon />
                        </Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <div className="replies flex gap-3 mt-2.5">
              {repliesToggleButton}
              {replyToggleButton}
            </div>

            {state.isVisibleReplyForm ? threadReplyForm : null}

            {state.isVisibleReplies ? (
              <div className="mt-4">{threadReplies}</div>
            ) : null}
          </div>
        </div>
      </section>
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
function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
      />
    </svg>
  );
}

function HeartIconSolid(props: React.HTMLProps<HTMLSpanElement>) {
  return (
    <span {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-full h-full hover:text-gray-300 text-gray-200"
      >
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
    </span>
  );
}
function HeartIconOutline(props: React.HTMLProps<HTMLSpanElement>) {
  return (
    <span {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-full h-full hover:text-gray-100 text-gray-300"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </span>
  );
}
function LinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
      />
    </svg>
  );
}
export default ThreadCard;
