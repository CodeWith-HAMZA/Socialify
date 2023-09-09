import { ObjectId } from "mongoose";
import * as z from "zod";
export interface ThreadFormData {
  thread: string;
  accountId: string;
}
export const ThreadValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(5, { message: "Minimum 4 Chracters" })
    .max(30, { message: "Maximum 30 Characters" }),
  accountId: z.string().nonempty(),
});

export const CommentValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(5, { message: "Minimum 4 Chracters" })
    .max(30, { message: "Maximum 30 Characters" }),
});
