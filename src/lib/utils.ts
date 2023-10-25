import { type ClassValue, clsx } from "clsx";
import { ObjectId } from "mongoose";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// created by chatgpt
export function isBase64Image(imageData: string): boolean {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

// created by chatgpt
export function formatDateString(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

// created by chatgpt
export function formatThreadCount(count: number): string {
  if (count === 0) {
    return "No Threads";
  } else {
    const threadCount = count.toString().padStart(2, "0");
    const threadWord = count === 1 ? "Thread" : "Threads";
    return `${threadCount} ${threadWord}`;
  }
}

// * created by chatgpt for removing extra spaces
export function removeExtraSpaces(inputString: string): string {
  // Remove extra spaces between words
  const stringWithoutExtraSpaces = inputString.replace(/\s+/g, " ");

  // Remove spaces at the beginning and end
  const trimmedString = stringWithoutExtraSpaces.trim();

  return trimmedString;
}

export function isLikedByTheUser(
  likes: ObjectId[],
  currentUserId: ObjectId
): boolean {
  if (!currentUserId || !likes) return;

  const isUserFound = likes?.find(
    (_) => _.toString() === currentUserId.toString()
  );
  return isUserFound ? true : false;
}

export async function safeAsyncOperation<T>(
  asyncFn: () => Promise<T>
): Promise<T | null> {
  try {
    return await asyncFn();
  } catch (error: unknown) {
    // Handle the error as needed, for example, log it
    console.error(error);
    // Return null or an appropriate value based on your error handling strategy
    return null;
  }
}

// * For Thread-Posting
export function hasTyped(str: string) {
  // Remove all spaces from the string
  const stringWithoutSpaces = str.replace(/\s/g, "");

  // Check if the resulting string has at least one character
  return stringWithoutSpaces.length > 0;
}
