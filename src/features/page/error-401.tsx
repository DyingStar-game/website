import type { PropsWithChildren } from "react";

import { Typography } from "@components/DS/typography";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";

type Error401Props = PropsWithChildren<{
  title?: string;
}>;

export const Error401 = (props: Error401Props) => {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="flex flex-col">
        <Typography variant="code">401</Typography>
        <CardTitle>{props.title ?? "Unauthorized"}</CardTitle>
        <CardDescription>
          You don't have permission to access this resource. Please sign in or
          contact your administrator if you believe this is a mistake.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-row gap-2"></CardFooter>
    </Card>
  );
};
