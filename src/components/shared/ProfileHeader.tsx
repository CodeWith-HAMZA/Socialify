"use client";
import { toast, Toaster } from "sonner";
import { sendFriendRequest } from "@/lib/actions/friendRequest.actions";
import { toggleFollow } from "@/lib/actions/user.actions";
import { IUserSchema } from "@/lib/models/user.model";
import { User } from "@clerk/nextjs/server";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { HiPencilAlt } from "react-icons/hi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { IoMdCloudUpload } from "react-icons/io";

interface Props {
  mongoUser: IUserSchema | null;
  clerkUser: User | null;
  currentMongoUser: IUserSchema | null;
}

const ProfileHeader = ({ mongoUser, clerkUser, currentMongoUser }: Props) => {
  const path = usePathname();
  const [selectedImage, setSelectedImage] = useState(null);

  async function handleFollow(e) {
    await toggleFollow(mongoUser?._id, currentMongoUser?._id, path);
    console.log(mongoUser?.["_id"], currentMongoUser?.["_id"]);
  }

  function handleProfileUpload(e) {
    toast.error("No Upload Functionality Is Being Made");
  }

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Use FileReader to read the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
            <div className="absolute inset-0 bg-black opacity-75 cursor-pointer hover:opacity-70 transition-all"></div>

            <div className="absolute flex items-center">
              <input
                type="file"
                className="hidden"
                id="profilePhoto"
                onChange={handleImageChange}
              />
              <Dialog>
                <DialogTrigger
                  disabled={
                    mongoUser?.["clerkId"].toString() !==
                    clerkUser?.id.toString()
                  }
                >
                  <img
                    src={selectedImage || mongoUser?.["image"]}
                    alt="User Profile Picture"
                    className=" w-32 h-32 border-white border-2 rounded-full mr-4 hover:opacity-95 opacity-75 cursor-pointer transition-all "
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Profile Photo</DialogTitle>
                    <DialogDescription>
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center justify-center py-5">
                          <label
                            className="relative top-[-3rem] left-[8rem] cursor-pointer bg-gray-500 rounded-full p-1"
                            htmlFor="profilePhoto"
                          >
                            <HiPencilAlt className="h-5 w-5 text-gray-300 hover:text-white transition-all" />
                          </label>

                          <img
                            src={selectedImage || mongoUser?.["image"]}
                            alt="User Profile Picture"
                            className=" w-32 h-32 border-white border-2 rounded-full mr-4 hover:opacity-95 opacity-75 cursor-pointer transition-all "
                          />
                        </div>
                        <Button
                          disabled={!selectedImage}
                          onClick={handleProfileUpload}
                        >
                          Upload Picture
                          <IoMdCloudUpload className="h-5 w-5 ml-1" />
                        </Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

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
