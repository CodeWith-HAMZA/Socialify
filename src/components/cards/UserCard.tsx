"use client";
import { getActivity } from "@/lib/actions/thread.actions";
import { toggleFollow } from "@/lib/actions/user.actions";
import { IUserSchema } from "@/lib/models/user.model";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  userId: string;
  name: string;
  image: string;
  mongoUser: IUserSchema;
}
function UserCard({ name, image, userId, mongoUser }: Props) {
  const path = usePathname();
  async function handleFollow(e) {
    console.log(name, userId, mongoUser);
    await toggleFollow(userId?.toString(), mongoUser?.["_id"].toString(), path);
  }
  return (
    <>
      <li className="flex hover:opacity-95 transition-all cursor-pointer items-center justify-between border-b-2 border-gray-800 py-2">
        <div className="flex items-center">
          <Image
            src={image}
            alt="Profile"
            className="rounded-full mr-4"
            width={28}
            height={28}
          />
          <Link href={"/profile/" + userId} title={"User: " + name}>
            <span className="text-md font-semibold text-white">{name}</span>
          </Link>
        </div>
        {mongoUser?.["_id"].toString() !== userId.toString() ? (
          <button
            onClick={handleFollow}
            className="bg-[#7e75fd] text-sm text-white px-4 py-1.5 rounded-xl hover:bg-[#7d73fdbe] transition duration-300"
          >
            {mongoUser?.["followings"].includes(userId) ? "UnFollow" : "Follow"}
          </button>
        ) : null}
      </li>
    </>
  );
}

export default UserCard;
