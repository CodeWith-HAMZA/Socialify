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

const ProfilePage = async () => {
  const user = await currentUser();
  // if (!user) return null;

  // const userInfo = await fetchUser(user?.id);

  // if (userInfo["onboarded"]) return redirect("/onboarding");

  return (
    <section>
      <ProfileHeader />
      <Tabs defaultValue="threads" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {profileTabs.map(({ value, label, icon }) => {
            const totalThreadsCount =
              value === "threads" ? (
                <span className="bg-gray-300 text-black px-2 rounded-md">
                  {4}
                </span>
              ) : null;
            return (
              <TabsTrigger
                className="flex justify-center items-center gap-3"
                value={value}
              >
                <Image src={icon} width={25} height={25} alt="tab-icon" />
                <span>{label}</span>
                {totalThreadsCount}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="threads">Hamza</TabsContent>
        <TabsContent value="tab2">Shaikh</TabsContent>
        <TabsContent value="tab3">Shakkkkkkkk</TabsContent>
      </Tabs>
    </section>
  );
};

export default ProfilePage;
