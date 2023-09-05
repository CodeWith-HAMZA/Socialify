import { SignUp } from "@clerk/nextjs";

export default function Page({ ...props }) {
  console.log(props);
  return (
    <SignUp
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-gray-100 acitve:bg-gray-300 focus:bg-gray-300 hover:bg-gray-300 font-[400] text-sm text-black",
          // account: "",
        },
      }}
    />
  );
}
