"use client";

import type { MouseEventHandler } from "react";
import { useEffect } from "react";

import { useForwardCursorPager } from "@feat/api/github/hooks/useForwardCursorPager";
import { projectIssuesQueryOptions } from "@feat/api/github/hooks/useProjectIssues";
import IssueCard from "@feat/issue/IssueCard";
import { LayoutSection } from "@feat/page/layout";
import { cn } from "@lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Tasks() {
  const {
    after: afterCursor,
    canGoPrev,
    canGoNext,
    goPrev,
    goNext,
    setPageInfo,
  } = useForwardCursorPager();

  const { data: projectIssues } = useQuery(
    projectIssuesQueryOptions(afterCursor),
  );

  useEffect(() => {
    if (projectIssues?.pageInfo) {
      setPageInfo(projectIssues.pageInfo);
    }
  }, [projectIssues?.pageInfo, setPageInfo]);

  return (
    <LayoutSection>
      <div
        className={cn(
          "grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3",
          !projectIssues && "animate-pulse",
        )}
      >
        {projectIssues && projectIssues.issues.length > 0 ? (
          projectIssues.issues.map((projectItem, idx) => (
            <IssueCard key={projectItem.id} issue={projectItem} index={idx} />
          ))
        ) : (
          <>
            <div className="h-60 rounded-md bg-gradient-to-br from-white/10 to-transparent to-90%" />
            <div className="h-60 rounded-md bg-gradient-to-br from-white/10 to-transparent to-90%" />
            <div className="h-60 rounded-md bg-gradient-to-br from-white/10 to-transparent to-90%" />
          </>
        )}
      </div>
      {/* <ul>
        <li>Actual Cursor : {afterCursor}</li>
        <li>Next Cursor : {projectIssues?.pageInfo.endCursor}</li>
        <li>Page index : {pageIndex}</li>
      </ul>

      <Button onClick={goPrev} disabled={!canGoPrev}>
        Previous page !
      </Button>

      <Button onClick={() => goNext()} disabled={!canGoNext}>
        Next page !
      </Button> */}

      <IssuePagination
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
        goNext={goNext}
        goPrev={goPrev}
      />
    </LayoutSection>
  );
}

type IssuePaginationProps = {
  goPrev: MouseEventHandler<HTMLButtonElement>;
  goNext: MouseEventHandler<HTMLButtonElement>;
  canGoPrev: boolean;
  canGoNext: boolean;
};

const IssuePagination = ({
  goPrev,
  goNext,
  canGoPrev,
  canGoNext,
}: IssuePaginationProps) => {
  const t = useTranslations("Issue.IssuePagination");

  return (
    <LayoutSection className="mt-6 flex flex-row justify-between">
      <div className="flex flex-1 justify-start">
        <Button
          variant="outline"
          className="group"
          disabled={!canGoPrev}
          onClick={goPrev}
        >
          <ArrowLeft className="transition-transform group-hover:-translate-x-1 group-hover:animate-pulse" />

          {t("button.previous")}
        </Button>
      </div>

      <div className="flex flex-1 justify-end">
        <Button
          variant="outline"
          className="group"
          disabled={!canGoNext}
          onClick={goNext}
        >
          {t("button.next")}
          <ArrowRight className="transition-transform group-hover:translate-x-1 group-hover:animate-pulse" />
        </Button>
      </div>
    </LayoutSection>
  );
};
