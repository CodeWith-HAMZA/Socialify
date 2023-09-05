import React from "react";

const RightSidebar = () => {
  return (
    <div className="flex text-white flex-col bg-[#121415] ml-auto">
      <div className="card h-1/2 w-72 px-4 py-3">
        <h2 className="">Suggested Communities</h2>
        <div className="flex flex-col"></div>
      </div>
      <div className="card h-1/2 w-72 px-4 py-3">
        <h2 className="">Suggested Users</h2>
        <div className="flex flex-col"></div>
      </div>
    </div>
  );
};

export default RightSidebar;
