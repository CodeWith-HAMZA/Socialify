import type { Metadata } from "next";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
  title: "Threads - auth",
  description: "Meta Threads App",
};

const inter = Inter({ subsets: ["latin"] });
interface Props {
  children: React.ReactNode;
}
export default function RootLayout({ children }: Props) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={`${inter.className}  `}>
          <main>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              {children}
            </ThemeProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
