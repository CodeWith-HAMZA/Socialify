import React from "react";
import LeftSidebar from "../shared/LeftSidebar";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

const LeftSideBarContainer = async () => {
  const user = await currentUser();
  if (!user?.id) return;
  const mongoUser = await fetchUser(user.id);
  return (
    <section className="text-white bg-[#2C2D32] h-screen sm:block hidden">
      <div className="flex flex-col justify-between overflow-y-scroll gap-6 px-6 h-screen">
        <LeftSidebar mongoUser={mongoUser} />
      </div>
    </section>
  );
};

export default LeftSideBarContainer;
