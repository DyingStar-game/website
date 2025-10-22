"use client";

import { Page400 } from "@feat/page/page-400";
import { cn } from "@lib/utils";

const ErrorPage = () => {
  return (
    <html
      lang="en"
      className={cn(
        "h-full bg-linear-120 from-background-1 via-background-2 to-background-3 bg-fixed text-foreground",
      )}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className={cn("min-h-screen antialiased")}>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex flex-1 items-center justify-center">
            <Page400 />
          </div>
        </div>
      </body>
    </html>
  );
};

export default ErrorPage;
