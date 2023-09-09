"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { redirect, usePathname, useRouter } from "next/navigation";
import { ThreadFormData, ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { ObjectId } from "mongoose";

interface Props {
  userId: { userMongoId: string | ObjectId | null };
}
const PostThread = ({ userId: { userMongoId } }: Props) => {
  const [Isloading, setIsloading] = useState(false);
  const pathname = usePathname();
  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      accountId: userMongoId || null,
      thread: "",
    } as ThreadFormData,
  });
  const router = useRouter();

  useEffect(() => {
    if (!userMongoId) {
      router.push("/sign-up");
    }
    console.log(userMongoId);
  }, []);

  async function onSubmit({
    accountId,
    thread,
  }: z.infer<typeof ThreadValidation>): Promise<void> {
    console.log("first");
    console.log({
      author: userMongoId as ObjectId,
      threadText: thread,
      community: null,
      path: pathname as string,
    });
    setIsloading(true);
    await createThread({
      author: userMongoId as ObjectId,
      threadText: thread,
      community: null,
      path: pathname as string,
    });
    setIsloading(false);
    router.push("/");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">
                Connect The Whole World By Threading Them
              </FormLabel>
              <FormControl className="">
                <Textarea
                  className="focus-visible:ring-0  "
                  unselectable="on"
                  placeholder="Write Your Own Thread"
                  {...field}
                />
              </FormControl>
              <FormDescription> Make Others Listen Your Voice</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={Isloading}>
          <span>{Isloading ? "Posting..." : "Publish Thread"}</span>
          <span> {!Isloading ? "" : <PlusIcon />}</span>
        </Button>
      </form>
    </Form>
  );
};

function PlusIcon() {
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
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}

export default PostThread;
