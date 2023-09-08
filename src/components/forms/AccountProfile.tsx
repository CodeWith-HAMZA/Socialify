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
import { UserFormData, UserValidation } from "@/lib/validations/user";
import * as z from "zod";
import Image from "next/image";
import { isBase64Image } from "@/lib/utils";
import { uploadFiles } from "@/utils/uploadthing";
import { updateUserData } from "@/lib/actions/user.actions";
import { ObjectId } from "mongoose";
import { usePathname, useRouter } from "next/navigation";
type User = {
  id?: string;
  objectId?: string;
  username?: string;
  name?: string;
  bio?: string;
  image?: string;
};

interface Props {
  user: User;
  BtnText: string;
}

const AccountProfile = ({ user, BtnText }: Props) => {
  const [SelectedFiles, setSelectedFiles] = useState<File[] | FileList | null>(
    null
  );
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    } as UserFormData,
  });

  useEffect(() => {
    console.log(user, BtnText);
  }, []);

  async function onSubmit(values: z.infer<typeof UserValidation>) {
    const { username, name, bio, profile_photo } = values;
    console.log(values, "values");

    const blob = profile_photo;
    const hasImageChanged = isBase64Image(blob);

    console.log(hasImageChanged);
    if (hasImageChanged) {
      // * upload file to Uploadthing using api-endpoint '/imageUploader'
      const res = await uploadFiles({
        endpoint: "imageUploader",
        files: SelectedFiles as File[],
      });

      console.log("upload hogai", res);
    }

    await updateUserData({
      userId: user.id,
      name,
      username,
      bio,
      image: profile_photo,
      path: pathname,
    });

    // if (pathname === "/profile/edit") {
    //   router.back();
    // } else {
    //   router.push("/");
    // }
  }
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ): void {
    event.preventDefault();
    const files: FileList | null = event.target.files;
    const file: File | undefined = files?.[0];

    if (files?.length === 0) {
      return;
    }

    // ? check if the file is image
    if (!file?.type.includes("image")) return;

    const fileReader = new FileReader();

    setSelectedFiles(Array.from(files || []));

    fileReader.onload = async (_event) => {
      // * path-url of the image
      const imagePathURL = _event.target?.result?.toString() || "";

      fieldChange(imagePathURL); // * image URL
      console.log({ hamza: imagePathURL.toString() });
    };
    // * reading the current-image-file as data url
    fileReader.readAsDataURL(file);
  }

  return (
    <div className="mt-12">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="profile_photo"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-5">
                    <FormLabel>
                      {field.value ? (
                        <Image
                          src={field.value}
                          width={70}
                          height={70}
                          alt="profile"
                          className="rounded-full border-2 border-gray-700 object-contain"
                        />
                      ) : (
                        <Image
                          src={"/assets/profile.svg"}
                          width={80}
                          height={80}
                          className="rounded-full border-2 border-gray-700 p-3  object-contain "
                          alt="profile"
                        />
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleChange(e, field["onChange"])}
                      />
                    </FormControl>
                  </div>
                  <FormDescription>Select Your Profile Photo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      unselectable="on"
                      placeholder="Enter Your Username"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Enter Your User Name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Name" {...field} />
                  </FormControl>
                  <FormDescription>Enter Your Name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write About Yourself" {...field} />
                  </FormControl>

                  <FormDescription>Describe yourself</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full flex gap-1.5 items-center">
              <span>{BtnText}</span>
              <span>
                <ProfileIcon />
              </span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

function ProfileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4 font-bold"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}
export default AccountProfile;
