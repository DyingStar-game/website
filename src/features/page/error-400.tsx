import type { PropsWithChildren } from "react";

import { Typography } from "@components/DS/typography";
import { LINKS } from "@feat/navigation/Links";
import { buttonVariants } from "@ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import Link from "next/link";

type Page400Props = PropsWithChildren<{
  title?: string;
}>;

export function Error400(props: Page400Props) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col">
        <Typography variant="code">400</Typography>
        <CardTitle>{props.title ?? "Bad request"}</CardTitle>
        <CardDescription>
          It seems we're experiencing some technical difficulties. Not to worry,
          our team is working on it. In the meantime, try refreshing the page or
          visiting us a bit later.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-row gap-2">
        <Link
          href={LINKS.Landing.Landing.href()}
          className={buttonVariants({ variant: "invert" })}
        >
          Go back home
        </Link>
      </CardFooter>
    </Card>
  );
}
