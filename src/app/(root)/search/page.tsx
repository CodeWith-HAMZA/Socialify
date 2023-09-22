import React from "react";
import SearchBar from "./SearchBar";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";

const SearchPage = async () => {
  const user = await currentUser();
  const mongoUser = await fetchUser(user?.id || "");

  if (!mongoUser) return null;
  if (mongoUser?.["onboarded"] === false) return redirect("/onboarding");

  return (
    <section>
      <h1 className="text-2xl font-semibold my-3   mx-1">Search</h1>
      <SearchBar />

      <div className="bg-gray-900 rounded-2xl p-4">
        <div className="w-full mx-auto">
          <ul>
            {[2, 5, 34, 3].map((_) => (
              <ListItem />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
function ListItem() {
  return (
    <>
      <li className="flex hover:opacity-95 transition-all cursor-pointer items-center justify-between border-b-2 border-gray-800 py-2">
        <div className="flex items-center">
          <img
            src="https://dummyimage.com/600x400/6a6eeb/fff"
            alt="User 2"
            className="w-10 h-10 rounded-full mr-4"
          />
          <span className="text-md font-semibold text-white">User 2</span>
        </div>
        <button className="bg-[#7e75fd] text-sm text-white px-4 py-1.5 rounded-xl hover:bg-[#7d73fdbe] transition duration-300">
          Follow
        </button>
      </li>
    </>
  );
}

export default SearchPage;
