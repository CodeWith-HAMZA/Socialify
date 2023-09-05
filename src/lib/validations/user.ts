import * as z from "zod";
export interface UserFormData {
  username: string;
  name: string;
  bio: string;
  profile_photo: string;
}
export const UserValidation = z.object({
  username: z.string().min(5).max(20),
  name: z.string().min(5).max(20),
  bio: z.string().min(20).max(100),
  profile_photo: z.string().url().nonempty(),
});
