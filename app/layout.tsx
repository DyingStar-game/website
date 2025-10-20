import type { ReactNode } from "react";

import { cn } from "@lib/utils";
import { Poppins } from "next/font/google";

import "./globals.css";

type Props = {
  children: ReactNode;
};

const PoppinsFont = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default async function RootLayout({ children }: Props) {
  return (
    <html
      className={cn(
        PoppinsFont.className,
        "bg-linear-120 from-background-1 via-background-2 to-background-3 text-foreground h-full bg-fixed",
      )}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen antialiased",
          // "before:top-40 before:w-2/3 before:min-w-[1800px] before:bg-[url('/assets/images/bg-circles.svg')]",
          // "before:pointer-events-none before:fixed before:bottom-0 before:left-1/2 before:z-0 before:-translate-x-1/2 before:bg-cover before:bg-top before:bg-no-repeat before:opacity-30 before:content-['']",
        )}
      >
        {/* <div className="relative z-10"> */}
        {children}
        {/* </div> */}
      </body>
    </html>
  );
}
