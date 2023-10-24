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
import FriendRequestCard from "@/components/cards/FriendRequestCard";
import {
  FriendRequest,
  getPendingReceivedFriendRequests,
} from "@/lib/actions/friendRequest.actions";
import { IFriendRequestSchema } from "@/lib/models/friendRequest.model";
interface Props {
  params: { id: string };
}
const ProfilePage = async ({ params }: Props) => {
  let profileData: React.ReactNode | null = null;
  let friendRequests = [];
  let profileTabsCopy = profileTabs;

  // * User, Whose Profile Is Opened
  const mongoUser = await fetchUser("", params.id || "");
  if (!mongoUser) return profileData;
  if (mongoUser?.["onboarded"] === false) return redirect("/onboarding");

  // * Current-User
  const user = await currentUser();
  const currentMongoUser = JSON.parse(
    JSON.stringify(await fetchUser(user?.id || ""))
  );

  // * Friend-Request Will Be Shown or Fetched for the Current-Logged-In User, meaning We Can't See Other's Friend-Requests List
  if (params.id === currentMongoUser?.["_id"]) {
    friendRequests = JSON.parse(
      JSON.stringify(await getPendingReceivedFriendRequests(params.id || ""))
    );
  } else {
    // Remove the "Friend Requests" element from the array
    profileTabsCopy = profileTabsCopy.filter(
      (tab) => tab.value !== "friendRequests"
    );
  }

  const friendRequestsTab =
    friendRequests.length === 0 ? (
      <div className="text-center my-4">
        <span className="text-gray-300 text-xl">No Remaining Requests</span>
      </div>
    ) : (
      friendRequests.map((friendRequest: FriendRequest) => (
        <FriendRequestCard
          key={friendRequest?.["_id"]}
          friendRequest={friendRequest}
        />
      ))
    );
  const tabs: React.ReactNode = (
    <Tabs defaultValue="threads" className="w-full">
      <TabsList
        className={`grid w-full px-3 h-[2.75rem] grid-cols-${profileTabsCopy.length.toString()}`}
      >
        {profileTabsCopy.map(({ value, label, icon }, idx) => {
          const totalThreadsCount =
            value === "friendRequests" ? (
              <span className="bg-gray-300 text-black px-2 rounded-md">
                {friendRequests.length}
              </span>
            ) : null;

          return (
            <TabsTrigger
              key={idx}
              className="flex justify-center items-center gap-3"
              value={value}
            >
              {icon && (
                <Image src={icon} width={25} height={25} alt="tab-icon" />
              )}
              <span>{label} </span>
              {totalThreadsCount}
            </TabsTrigger>
          );
        })}
      </TabsList>
      <TabsContent value="threads">
        <ThreadsTab mongoUser={mongoUser} />
      </TabsContent>
      <TabsContent value="replies">Replies</TabsContent>
      <TabsContent value="friendRequests">
        <div className="">{friendRequestsTab}</div>
      </TabsContent>
      <TabsContent value="tagged">Tagged</TabsContent>
    </Tabs>
  );

  const profileHeader = (
    <ProfileHeader
      mongoUser={mongoUser}
      currentMongoUser={currentMongoUser}
      clerkUser={user}
    />
  );

  profileData = (
    <section>
      {profileHeader}
      {tabs}
    </section>
  );

  return profileData;
};

export default ProfilePage;
