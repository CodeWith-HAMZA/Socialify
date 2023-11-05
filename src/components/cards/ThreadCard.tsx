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
import {
  Dispatch,
  DispatchWithoutAction,
  useMemo,
  useReducer,
  useState,
} from "react";
import { fetchUser } from "@/lib/actions/user.actions";
import { postThreadReply, updateLikes } from "@/lib/actions/thread.actions";
import { GoChevronUp, GoChevronDown } from "react-icons/go";
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
import { RiSendPlaneFill } from "react-icons/ri";
import { MediaType } from "@/utils/types";
import ReplyCard from "./ReplyCard";
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
  readonly media?: MediaType[];
}
// Define action types
type ActionType =
  | "TOGGLE_THREAD_REPLY_FORM"
  | "TOGGLE_THREAD_REPLIES"
  | "TOGGLE_SHOWMORE_MEDIA"
  | "TOGGLE_LIKES_COUNT";

// Define the initial state interface
interface State {
  isVisibleReplyForm: boolean;
  isVisibleReplies: boolean;
  isShownMoreMedia: boolean;
  isLiked: boolean;
}

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
    case "TOGGLE_SHOWMORE_MEDIA":
      return {
        ...state,
        isShownMoreMedia: !state.isShownMoreMedia,
      };
    default:
      return state;
  }
};

const MediaContent = ({
  media,
  dispatch,
  isShownMoreMedia,
}: {
  media: MediaType[];
  dispatch: Dispatch<{
    type: ActionType;
  }>;
  isShownMoreMedia: boolean;
}) => {
  if (media.length === 0) {
    return null;
  }

  const toggleMedia = () => dispatch({ type: "TOGGLE_SHOWMORE_MEDIA" });
  const isMoreMediaRemaining = !isShownMoreMedia && media.length - 2 > 0;

  return (
    <>
      <div className="media py-3 ">
        <div
          className={`flex justify-start gap-3 flex-wrap overflow-y-hidden transition-all ${
            isShownMoreMedia || media.length - 2 === 0 ? "" : "h-[10rem]"
          }`}
        >
          {media
            ? media.map((image) => (
                <div
                  className={`mediaImage ${
                    media.length === 1 ? "w-full" : "w-[44%]"
                  }`}
                  key={image.url}
                >
                  <a href={image.url} target="_blank">
                    <img
                      src={image.url}
                      className="opacity-90 hover:opacity-80 rounded-lg cursor-pointer w-full object-contain"
                      alt="Media Image"
                    />
                  </a>
                </div>
              ))
            : null}
        </div>
        <div
          className="rotate-180 flex justify-center items-center gap-3"
          style={{
            boxShadow: isShownMoreMedia ? "" : "5px 20px  30px 20px #17162C",
          }}
        >
          {isMoreMediaRemaining ? (
            <span className="rotate-180 text-center text-xl">
              {media.length - 2}+ More
            </span>
          ) : null}
          <button
            onClick={toggleMedia}
            className="ml-2 bg-gray-700 rotate-180 p-1 px-4 rounded-xl my-3 transition-all hover:bg-gray-600"
          >
            {isShownMoreMedia ? (
              <div className="flex gap-1 items-center">
                <span>Show Less</span>
                <GoChevronUp />
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <span>Show More</span>
                <GoChevronDown />
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
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
  media,
}: ThreadProps) => {
  console.log(replies);
  const [Loading, setLoading] = useState(false);
  const path = usePathname();
  const [state, dispatch] = useReducer(
    reducer, // Define the initial state
    {
      isVisibleReplyForm: false,
      isVisibleReplies: false,
      isShownMoreMedia: false,
      isLiked: isLikedByTheUser(likes || [], currentUser?.["_id"]),
    }
  );

  async function handlePostingThreadReply(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const replyText = formData.get("replyText");
    setLoading(true);
    currentUser?.["_id"];
    await postThreadReply({
      // @ts-ignore
      threadId,
      replyText: replyText as string,
      // @ts-ignore
      userId: currentUser?.["_id"],
      path,
    });
    setLoading(false);
  }
  const handleLikes = async () => {
    dispatch({ type: "TOGGLE_LIKES_COUNT" });
    await updateLikes(currentUser?.["_id"], threadId, path);
    console.log(currentUser?._id, threadId, "hteuh", state.isLiked);
  };
  const toggleReplyForm = () => dispatch({ type: "TOGGLE_THREAD_REPLY_FORM" });
  const toggleThreadReplies = () => dispatch({ type: "TOGGLE_THREAD_REPLIES" });

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

  const repliesToggleButton =
    replies.length !== 0 ? (
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
    ) : null;

  const replyToggleButton = (
    <button
      onClick={toggleReplyForm}
      className="text-gray-200 flex items-center gap-1 font-semibold rounded-xl bg-[#e4e4e426] px-5 py-2 transition-all hover:bg-[#e4e4e436] "
    >
      <span>{/* <ReplyUpArrow /> */}</span>
      <span>Reply</span>
    </button>
  );

  const threadReplyForm = (
    <form
      onSubmit={handlePostingThreadReply}
      className="py-6 rounded-lg shadow-md border-gray-600"
    >
      <div className="flex items-center">
        <img
          src={currentUser?.["image"]}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
        <input
          type="text"
          name="replyText"
          placeholder="Add a thread..."
          className="w-full border rounded-xl px-4 py-2 focus:outline-none border-gray-300 focus:border-purple-300 bg-black text-white"
        />
      </div>
      <div className="btns flex items-start gap-2">
        <button
          onClick={toggleReplyForm}
          className="flex gap-2 mt-4 ml-14 bg-gray-700 shadow-md hover:bg-gray-600 transition-all text-gray-200 font-semibold py-2 px-4 rounded-xl"
        >
          <span>Cancel</span>
        </button>
        <button className="flex gap-2 mt-4  bg-gray-300 shadow-md hover:bg-gray-400 transition-all text-black font-semibold py-2 px-4 rounded-xl">
          <span>Thread</span>
          <RiSendPlaneFill className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
  const threadReplies: React.ReactNode[] | React.ReactNode =
    replies.length === 0 ? (
      <p className="text-gray-500 ml-2">No Replies</p>
    ) : (
      replies.map((reply: IThreadSchema, idx) => {
        // console.log(reply, "reply");
        const author: IUserSchema = reply?.["author"] as IUserSchema;
        return <ReplyCard reply={reply} key={idx} />;
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
            <p className="" onClick={() => console.log(media.at(0)?.url)}>
              {threadText}
            </p>
            {routeToThreadDetails}
            <div className="bg-gray-600 p-[0.5px]" />
            {media ? (
              <MediaContent
                media={media}
                dispatch={dispatch}
                isShownMoreMedia={state.isShownMoreMedia}
              />
            ) : null}
            <div className="flex items-center mt-2 gap-2">
              <span
                onClick={handleLikes}
                title="Demo Feature (Currently in Process...)"
                className="likes transition-all flex p-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 rounded-full items-center gap-1 cursor-pointer"
              >
                {state.isLiked ? (
                  <HeartIconSolid className="h-5 w-5  " />
                ) : (
                  <HeartIconOutline className="h-5 w-5" />
                )}
                <span>{likes ? Number(likes.length) : "NE"}</span>
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
                <DialogTrigger
                  title="Share the post"
                  className="bg-gray-800 p-2 transition-all hover:bg-gray-700 rounded-full"
                >
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
        className="w-full h-full hover:text-red-600 transition-all text-red-500"
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
        className="w-full h-full hover:text-red-600 transition-all text-red-500"
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
