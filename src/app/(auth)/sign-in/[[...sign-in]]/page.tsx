import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-gray-100 acitve:bg-gray-300 focus:bg-gray-300 hover:bg-gray-300 font-[400] text-sm text-black",
          // account: "",
        },
      }}
      // redirectUrl={"/redirectFromSignIn"}
      // afterSignUpUrl={"/afterSignupURLSigin"}
      // afterSignInUrl={"/afterSigninUrlFRomSignin"}
    />
  );
}
