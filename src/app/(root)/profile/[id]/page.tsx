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
interface Props {
  params: { id: string };
}
const ProfilePage = async ({ params }: Props) => {
  let profileData: React.ReactNode | null = null;
  const user = await currentUser();
  const currentMongoUser = await fetchUser(user?.id || "");
  const mongoUser = await fetchUser("", params.id || "");
  console.log(params.id, "aoeuoetuh");

  if (!mongoUser) return profileData;
  if (mongoUser?.["onboarded"] === false) return redirect("/onboarding");

  const tabs: React.ReactNode = (
    <Tabs defaultValue="threads" className="w-full">
      <TabsList className="grid w-full px-3 h-[2.75rem] grid-cols-4 ">
        {profileTabs.map(({ value, label, icon }, idx) => {
          const totalThreadsCount =
            value === "threads" ? (
              <span className="bg-gray-300 text-black px-2 rounded-md">
                {9}
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
      <TabsContent value="tagged">Tagged</TabsContent>
    </Tabs>
  );

  const profileHeader = (
    <ProfileHeader
      mongoUser={mongoUser}
      currentMongoUser={currentMongoUser}
      clerkUser={user}
    ></ProfileHeader>
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
