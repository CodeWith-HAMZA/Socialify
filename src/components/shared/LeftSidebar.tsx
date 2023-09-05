"use client";
import { sidebarLinks } from "@/constants";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const LeftSidebar = () => {
  const [activeRoute, setActiveRoute] = useState("/");
  const pathname = usePathname();
  console.log(pathname);

  const handleRouteChange = (route: string) => {
    setActiveRoute(route);
  };
  return (
    <section className="text-white bg-[#2C2D32] h-screen sm:block hidden">
      <div className="flex flex-col justify-between overflow-y-scroll gap-6 px-6 h-screen">
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
                  href={link.route}
                >
                  <span className="flex gap-3 py-1">
                    <Image
                      src={link.imgURL}
                      width={24}
                      height={24}
                      alt="Icon"
                    />
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
      </div>
    </section>
  );
};

export default LeftSidebar;
