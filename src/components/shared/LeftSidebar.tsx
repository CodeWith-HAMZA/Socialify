"use client";
import { sidebarLinks } from "@/constants";
import { IUserSchema } from "@/lib/models/user.model";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
interface Props {
  mongoUser: IUserSchema;
}
const LeftSidebar = ({ mongoUser }: Props) => {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <>
      <div className="">
        {sidebarLinks.map((link, idx) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          return (
            <div className=" ">
              <Link
                className={`flex gap-2 px-6 rounded-lg py-4 transition-all ease-in cursor-pointer ${
                  isActive ? "bg-[#867DFA] " : ""
                }`}
                href={
                  link.label === "Profile"
                    ? `${link.route}/${mongoUser?.["_id"]}`
                    : link.route
                }
              >
                <span className="flex gap-3 py-1">
                  <Image src={link.imgURL} width={24} height={24} alt="Icon" />
                  <p className="hidden md:block ">{link.label}</p>
                </span>
              </Link>
            </div>
          );
        })}
      </div>

      <SignedIn>
        <div className="profileContainer flex gap-5 my-8 ">
          <SignOutButton>
            <div className="flex items-center cursor-pointer px-6 gap-3">
              <Image
                src={"/assets/logout.svg"}
                alt="logout"
                width={25}
                height={25}
              />
              <span className="text-white hidden md:block">Logout</span>
            </div>
          </SignOutButton>
        </div>
      </SignedIn>
    </>
  );
};

export default LeftSidebar;
