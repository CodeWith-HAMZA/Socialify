import React from "react";

const SearchBar = () => {
  return (
    <div className="w-full mx-auto py-4 text-white">
      <div className="relative rounded-xl bg-gray-600 shadow-md">
        <input
          type="text"
          placeholder="Search..."
          className="w-full py-2 pl-4 pr-10 text-gray-100 rounded-xl focus:outline-none focus:shadow-outline bg-gray-800"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button className="text-gray-300">
            {" "}
            <SearchIcon />
          </button>
        </div>
      </div>
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
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}
