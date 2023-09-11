import { ObjectId } from "mongoose";
import * as z from "zod";
export interface ThreadFormData {
  thread: string;
  accountId: string;
}
export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(5, { message: "Minimum 4 Chracters" }),
  accountId: z.string().nonempty(),
  // .max(30, { message: "Maximum 30 Characters" }),
});

export const CommentValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(5, { message: "Minimum 4 Chracters" })
    .max(30, { message: "Maximum 30 Characters" }),
});
