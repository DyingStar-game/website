import { Typography } from "@components/DS/typography";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import { NewsItemAuthorLoader } from "@feat/news/newsItemAuthor";
import { NewsItemTagsLoader } from "@feat/news/newsItemTags";
import { LayoutMain, LayoutSection } from "@feat/page/layout";
import { ChevronLeft } from "lucide-react";

/**
 * This page should never be seen by the user because everything is pre-rendered.
 */
export default async function RouteLoading() {
  return (
    <LayoutMain className="animate-pulse">
      <Button variant={"outline"} className="self-end">
        <ChevronLeft /> Loading...
      </Button>
      <LayoutSection className="gap-8 border-b border-input pb-8">
        <Typography variant="h3" as="h1" className="flex items-center gap-4">
          <span className="text-5xl">🔄</span>
          Loading...
        </Typography>

        <Skeleton className="h-40 w-full" />

        <NewsItemTagsLoader />
        <NewsItemAuthorLoader />
      </LayoutSection>
    </LayoutMain>
  );
}
