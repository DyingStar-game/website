import { Typography } from "@components/DS/typography";
import { LINKS } from "@feat/navigation/Links";
import { buttonVariants } from "@ui/button";
import Link from "next/link";

export function Page404() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-8">
      <div className="space-y-3 text-center">
        <Typography variant="code">404</Typography>
        <Typography variant="h1">Page not found</Typography>
        <Typography>
          Sorry, we couldn't find the page you're looking for.
        </Typography>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href={LINKS.Landing.Landing.href()}
          className={buttonVariants({ variant: "outline" })}
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}
