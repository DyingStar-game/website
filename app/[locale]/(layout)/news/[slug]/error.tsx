"use client";

import { Layout, LayoutHeader, LayoutTitle } from "@feat/page/layout";
import { logger } from "@lib/logger";
import type { ErrorParams } from "@type/next";
import { Button } from "@ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@ui/card";
import { useEffect } from "react";

export default function RouteError({ error, reset }: ErrorParams) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Error with post.</LayoutTitle>
      </LayoutHeader>
      <Card>
        <CardHeader>
          <CardTitle>
            Sorry, the post you are looking for doesn't work as expected. Please
            try again later.
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Button onClick={reset}>Try again</Button>
        </CardFooter>
      </Card>
    </Layout>
  );
}
