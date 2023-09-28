import ActivityCard from "@/components/cards/ActivityCard";
import { getActivity } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { IThreadSchema } from "@/lib/models/thread.model";
import { IUserSchema } from "@/lib/models/user.model";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const ActivityPage = async () => {
  const user = await currentUser();
  const mongoUser = await fetchUser(user?.id);
  const res = await getActivity(mongoUser?._id);

  return (
    <section>
      <h1 className="text-2xl font-semibold my-3 mx-1">Activity</h1>
      {res.map((reply: IThreadSchema, idx) => (
        <ActivityCard reply={JSON.parse(JSON.stringify(reply))} />
      ))}
    </section>
  );
};

export default ActivityPage;
