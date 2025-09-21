import { Typography } from "@components/DS/typography";
import { LINKS } from "@feat/navigation/Links";
import { buttonVariants } from "@ui/button";
import Link from "next/link";
import type { PropsWithChildren } from "react";

type Page400Props = PropsWithChildren<{
  title?: string;
}>;

export function Page400(props: Page400Props) {
  return (
    <main className="flex flex-col items-center gap-8">
      <div className="max-w-lg space-y-3 text-center">
        <Typography variant="code">400</Typography>
        <Typography variant="h1">{props.title ?? "Bad Request"}</Typography>
        {props.children ?? (
          <Typography>
            It seems we're experiencing some technical difficulties. Not to
            worry, our team is working on it. In the meantime, try refreshing
            the page or visiting us a bit later.
          </Typography>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Link href={LINKS.Landing.Landing.href()} className={buttonVariants({ variant: "invert" })}>
          Go back home
        </Link>
      </div>
    </main>
  );
}
