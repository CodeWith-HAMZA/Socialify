"use client";
import { toast, Toaster } from "sonner";
import { sendFriendRequest } from "@/lib/actions/friendRequest.actions";
import { toggleFollow } from "@/lib/actions/user.actions";
import { IUserSchema } from "@/lib/models/user.model";
import { User } from "@clerk/nextjs/server";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
interface Props {
  mongoUser: IUserSchema | null;
  clerkUser: User | null;
  currentMongoUser: IUserSchema | null;
}

// profileHeader New Video with banner image
{
  /* <div class="relative bg-cover bg-center h-52">
  <!-- Background Photo -->
  <img
    src="https://dummyimage.com/600x400/de42de/fff"
    alt="Background Photo"
    class="absolute inset-0 w-full h-full object-cover"
  />

  <!-- Dark Overlay -->
  <div class="absolute inset-0 bg-black opacity-50"></div>

  <!-- Circular Main Photo -->
  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <img
      src="https://dummyimage.com/600x400/000000/fff"
      alt="Main Photo"
      class="w-32 h-32 rounded-full border-4 border-white"
    />
  </div>
</div> */
}

const ProfileHeader = ({ mongoUser, clerkUser, currentMongoUser }: Props) => {
  const path = usePathname();

  async function handleFollow(e) {
    await toggleFollow(mongoUser?._id, currentMongoUser?._id, path);
    console.log(mongoUser?.["_id"], currentMongoUser?.["_id"]);
  }

  async function handleAddFriend(e) {
    if (currentMongoUser?._id === mongoUser?._id)
      return toast.error("You Can't Follow Yourself");
    await sendFriendRequest(currentMongoUser?._id, mongoUser?._id, path);
    console.log(mongoUser?.["_id"], currentMongoUser?.["_id"]);
  }

  const followButton =
    mongoUser?.["clerkId"].toString() !== clerkUser?.id.toString() ? (
      <button
        onClick={handleFollow}
        className="bg-gray-600 text-sm text-white px-5 py-2 rounded-xl hover:bg-[#7d73fdbe] transition duration-300"
      >
        {mongoUser?.followers.includes(currentMongoUser?.["_id"])
          ? "Following"
          : "Follow"}
      </button>
    ) : null;

  const friendButton =
    mongoUser?.["clerkId"].toString() !== clerkUser?.id.toString() ? (
      <button
        onClick={handleAddFriend}
        className="bg-gray-600 text-sm text-white px-5 py-2 rounded-xl hover:bg-[#7d73fdbe] transition duration-300"
      >
        {mongoUser?.followers.includes(currentMongoUser?.["_id"])
          ? "Add Friend"
          : "Friends"}
      </button>
    ) : null;
  return (
    <div>
      <Toaster invert />
      <div className="max-w-6xl mx-auto mb-1.5 rounded-md">
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-[12rem] px-6 py-8">
            <img
              src={mongoUser?.["image"]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-70 cursor-pointer hover:opacity-60 transition-all"></div>

            <div className="absolute flex items-center">
              <input type="file" className="hidden" id="profilePhoto" />
              <label htmlFor="profilePhoto">
                <img
                  src={mongoUser?.["image"]}
                  alt="User Profile Picture"
                  className=" w-32 h-32 border-white border-2 rounded-full mr-4 hover:opacity-70 cursor-pointer transition-all "
                />
              </label>
              <div>
                <h2 className="text-3xl font-semibold text-white">
                  {mongoUser?.["name"]}
                </h2>
                <p className="text-gray-400">@{mongoUser?.["username"]}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 px-6 py-4">
            <ul className="flex space-x-4 items-center">
              <li>
                <span className="text-gray-400 mr-2 hover:text-blue-500">
                  Threads:
                </span>
                <span>{mongoUser?.["threads"].length}</span>
              </li>
              <li>
                <span className="text-gray-400 mr-2 hover:text-blue-500">
                  Followers:
                </span>
                <span>{mongoUser?.["followers"].length}</span>
              </li>
              <li>
                <span className="text-gray-400 mr-2 hover:text-blue-500">
                  Following:
                </span>
                <span>{mongoUser?.["followings"].length}</span>
              </li>
              <li>{followButton}</li>
              <li>{friendButton}</li>
            </ul>
            <Accordion className="" type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>About</AccordionTrigger>
                <AccordionContent className="text-gray-300 ">
                  {mongoUser?.["bio"]}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
