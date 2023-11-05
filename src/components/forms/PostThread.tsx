"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { RxCross2 } from "react-icons/rx";
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
import { uploadFiles } from "@/utils/uploadthing";
import { toast } from "sonner";
import { hasTyped } from "@/lib/utils";
import { UploadFileResponse } from "uploadthing/client";

interface Props {
  userId: { userMongoId: string | ObjectId | null };
}
const PostThread = ({ userId: { userMongoId } }: Props) => {
  const [Isloading, setIsloading] = useState(false);
  const [SelectedImages, setSelectedImages] = useState<
    { src: string; image: File }[]
  >([]);
  const pathname = usePathname();
  const form = useForm<z.infer<typeof ThreadValidation>>({
    // resolver: zodResolver(ThreadValidation),
    defaultValues: {
      accountId: userMongoId || null,
      thread: "",
      images: [],
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
    images,
  }: z.infer<typeof ThreadValidation>): Promise<void> {
    if (!hasTyped(thread)) {
      toast.error("Couldn't Post Empty Thread");
      return;
    }
    if (SelectedImages.length > 3) {
      toast.error("Media Image's Limit Exceeded, must be less than 4");
      return;
    }
    let uploadthingImages: UploadFileResponse[] = [];
    setIsloading(true);
    if (SelectedImages.length > 0) {
      uploadthingImages = await uploadFiles({
        endpoint: "imageUploader",
        files: SelectedImages.map(
          (selectedImage) => selectedImage.image
        ) as File[],
      });
    }

    await createThread({
      author: userMongoId as ObjectId,
      threadText: thread,
      community: null,
      path: pathname as string,
      media: uploadthingImages.map((res) => ({ type: "image", url: res.url })),
    });

    setIsloading(false);
    router.push("/");
  }

  // Handle file input change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files);
    const images = files.map((file) => ({
      src: URL.createObjectURL(file),
      image: file,
    }));
    setSelectedImages(images);
  };
  function handleImageRemoval(index: number) {
    const updatedImages = [...SelectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  }

  return (
    <>
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
                <FormDescription>
                  {" "}
                  Make Others Listen Your Voice
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Choose Images</FormLabel>
                <FormControl className="">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    placeholder="Select Images For The Post"
                    {...field}
                    onChange={(e) => handleImageChange(e)} // Handle file input change
                  />
                </FormControl>

                <FormDescription>
                  {" "}
                  Make Others Listen Your Voice
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            type="submit"
            className="flex gap-2 bg-[#7a71fc] px-6 transition-all py-3 hover:bg-[#776ef7c5] rounded-2xl "
            disabled={Isloading}
          >
            <span>{Isloading ? "Posting..." : "Publish Thread"}</span>
            <span>{Isloading ? null : <PlusIcon />}</span>
          </button>
        </form>
      </Form>
      <div className="">
        {SelectedImages.length > 0 && (
          <div>
            <h3 className="text-xl font-normal  mt-12">Selected Images:</h3>
            <div className="images flex flex-wrap  items-start justify-evenly">
              {SelectedImages.map((image, index) => (
                <div
                  key={index}
                  className="relative w-[44%] transition-all cursor-pointer"
                >
                  <button
                    onClick={() => handleImageRemoval(index)}
                    className="relative top-[3.4rem] left-2 z-10 bg-gray-500 bg-opacity-70 hover:bg-opacity-90 transition-all px-3 py-2 rounded-full"
                  >
                    <RxCross2 className="h-7 w-7" />
                  </button>
                  <img
                    src={image.src}
                    className="w-full rounded-xl hover:opacity-95 object-contain"
                    alt={`Image-${index}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
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
