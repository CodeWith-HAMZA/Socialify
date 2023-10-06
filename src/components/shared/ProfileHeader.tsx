"use client";
import { IUserSchema } from "@/lib/models/user.model";
import React from "react";
interface Props {
  mongoUser: IUserSchema;
}
const ProfileHeader = ({ mongoUser }: Props) => {
  return (
    <div>
      <div className="max-w-6xl mx-auto mb-0.5 rounded-md">
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center">
              <img
                src={mongoUser?.["image"]}
                alt="User Profile Picture"
                className="w-20 h-20 rounded-full mr-4"
              />
              <div>
                <h2 className="text-3xl font-semibold text-white">
                  {mongoUser?.["name"]}
                </h2>
                <p className="text-gray-400">@{mongoUser?.["username"]}</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-gray-300">{mongoUser?.["bio"]}</p>
            </div>
          </div>
          <div className="bg-gray-800 px-6 py-4">
            <ul className="flex space-x-4">
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
