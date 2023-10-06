import SearchBar from "./SearchBar";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
type searchQuery = { q?: string | null };

interface Props {
  searchParams: searchQuery;
}
const SearchPage = async ({ searchParams }: Props) => {
  const user = await currentUser();
  const mongoUser = await fetchUser(user?.id || "");

  if (!mongoUser) return null;
  if (mongoUser?.["onboarded"] === false) return redirect("/onboarding");
  const searchQuery = searchParams.q;
  const res = await fetchUsers(
    mongoUser["_id"],
    3,
    1,
    searchQuery ?? "",
    "asc"
  );

  const usersList = res?.users.map((user) => {
    const { _id, name, image } = user;

    return (
      <UserCard
        key={_id}
        userId={_id}
        name={name}
        image={image}
        mongoUser={JSON.parse(JSON.stringify(mongoUser))}
      />
    );
  });

  return (
    <section>
      <h1 className="text-2xl font-semibold my-3 mx-1">Search</h1>
      <SearchBar mongoUser={JSON.parse(JSON.stringify(mongoUser))} />

      <div className="bg-gray-900 rounded-2xl p-4">
        <div className="w-full mx-auto">
          <ul>{res?.users.length !== 0 ? usersList : "No Users Found"}</ul>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
