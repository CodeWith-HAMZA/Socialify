"use client";
import { getActivity } from "@/lib/actions/thread.actions";
import Image from "next/image";
import Link from "next/link";

interface UserProps {
  userId: string;
  name: string;
  image: string;
}
function UserCard({ name, image, userId }: UserProps) {
  return (
    <>
      <li className="flex hover:opacity-95 transition-all cursor-pointer items-center justify-between border-b-2 border-gray-800 py-2">
        <div className="flex items-center">
          <Image
            src={image}
            alt="User 2"
            className="rounded-full mr-4"
            onClick={async () => {
              const userthreads = await getActivity(userId);
              console.log(userthreads);
            }}
            width={28}
            height={28}
          />
          <Link href={"/profile/" + userId}>
            <span className="text-md font-semibold text-white">{name}</span>
          </Link>
        </div>
        <button className="bg-[#7e75fd] text-sm text-white px-4 py-1.5 rounded-xl hover:bg-[#7d73fdbe] transition duration-300">
          Follow
        </button>
      </li>
    </>
  );
}

export default UserCard;
