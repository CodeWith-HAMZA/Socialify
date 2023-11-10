import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { fetchUser } from "@/lib/actions/user.actions";
import { IUserSchema } from "@/lib/models/user.model";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { HiChevronDoubleRight } from "react-icons/hi";

const NotificationBar = async () => {
  const user = await currentUser();
  const mongoUser: IUserSchema | null = await fetchUser(user?.id || "");

  if (!mongoUser || !mongoUser["onboarded"])
    return (
      <div>
        {" "}
        <Alert className="px-8 py-2">
          <AlertDescription className="flex justify-between items-center gap-3">
            {/* <Button className="rounded-full h-5 px-1">
        <MinusIcon size={14} />
      </Button> */}
            <span className="text-xs">
              Welcome! It seems that your profile is incomplete. Please take a
              moment to provide the necessary details to complete your profile.{" "}
            </span>
            <Button
              variant={"default"}
              size={"sm"}
              className="py-1 rounded-full text-xs font-bold flex items-center gap-1"
            >
              <Link href={"/onboarding"}>Onboarding</Link>
              <HiChevronDoubleRight size={20} />
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
};

export default NotificationBar;
