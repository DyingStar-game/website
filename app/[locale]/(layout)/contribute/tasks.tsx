"use client";

import type { MouseEventHandler } from "react";
import { useEffect, useState } from "react";

import CountInfo from "@components/DS/countInfo/CountInfo";
import { projectCountQueryOptions } from "@feat/api/github/hooks/projectCountQueryOptions";
import { projectIssuesQueryOptions } from "@feat/api/github/hooks/projectIssuesQueryOptions";
import { usePagination } from "@feat/api/github/hooks/usePagination";
import IssueCard from "@feat/issue/IssueCard";
import { LayoutSection } from "@feat/page/layout";
import { useDebounce } from "@hooks/use-debounce";
import { cn } from "@lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Tasks() {
  const { canGoPrev, canGoNext, goPrev, goNext, setPageInfo, pageIndex } =
    usePagination();
  const [query, setQuery] = useState<string>("");
  const debounced = useDebounce(query, 500);

  const { data: projectIssues } = useQuery(
    projectIssuesQueryOptions(pageIndex, debounced),
  );

  const { data: projectCount } = useQuery(projectCountQueryOptions());

  useEffect(() => {
    setPageInfo({
      hasNextPage: projectIssues?.hasNextPage ?? false,
    });
  }, [projectIssues?.hasNextPage, setPageInfo]);

  return (
    <LayoutSection>
      <Input onChange={(e) => setQuery(e.target.value)} value={query} />
      <div className="flex flex-col gap-8 xl:flex-row">
        <CountInfo
          className="flex-1"
          icon="bookmark-check"
          title="Tâches disponibles"
          count={projectIssues?.issueCount ?? 0}
        />
        <CountInfo
          className="flex-1"
          icon="user-star"
          title="Contributeurs actifs"
          count={projectCount?.openIssueWithAssigneeCount ?? 0}
        />
        <CountInfo
          className="flex-1"
          icon="puzzle"
          title="Domaines couverts"
          count={2}
        />
      </div>
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
