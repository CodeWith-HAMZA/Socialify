"use client";
import { getActivity } from "@/lib/actions/thread.actions";
import { fetchUsers } from "@/lib/actions/user.actions";
import { IUserSchema } from "@/lib/models/user.model";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  mongoUser: IUserSchema;
}
const SearchBar = ({ mongoUser }: Props) => {
  const [SearchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  async function handleSearchQuery(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // const res = await fetchUsers(mongoUser["_id"], 3, 1, SearchQuery, "asc");
    if (SearchQuery) router.push(`/search?q=${SearchQuery}`);
    else router.push(`/search`);
  }

  const clearButton = SearchQuery ? (
    <span
      className="mx-3 text-xs text-gray-400 underline hover:text-red-300 cursor-pointer"
      onClick={(e) => {
        setSearchQuery("");
        router.push("/search");
      }}
    >
      clear
    </span>
  ) : null;

  return (
    <div className="w-full mx-auto py-3 text-white">
      <form
        onSubmit={handleSearchQuery}
        className="relative rounded-xl bg-gray-600 shadow-md"
      >
        <input
          type="text"
          placeholder="Search..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          value={SearchQuery}
          className="w-full py-2 pl-4 pr-10 text-gray-100 rounded-xl focus:outline-none focus:shadow-outline bg-gray-800"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {clearButton}
          <button
            className={`text-gray-${SearchQuery === "" ? "400" : "200"} `}
          >
            <SearchIcon />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-7 h-7"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}
