"use client";
import { sidebarLinks } from "@/constants";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
const BottomBar = () => {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div className="flex justify-around py-1 sm:hidden fixed bottom-0 right-0 w-screen bg-black text-white  ">
      {sidebarLinks.map((link) => {
        const isActive =
          (pathname.includes(link.route) && link.route.length > 1) ||
          pathname === link.route;

        return (
          <Link
            href={link.route}
            className={`${
              isActive ? "bg-[#867DFA]" : ""
            } flex flex-col gap-2 items-center px-3 py-1 rounded-lg`}
          >
            <Image src={link.imgURL} width={27} height={27} alt="Icon" />
            <span className="text-xs">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomBar;
