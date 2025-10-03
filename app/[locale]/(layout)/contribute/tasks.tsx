"use client";

import { useEffect, useState } from "react";

import CountInfo from "@components/DS/countInfo/CountInfo";
import { Typography } from "@components/DS/typography";
import { projectCountQueryOptions } from "@feat/api/github/hooks/projectCountQueryOptions";
import { projectIssuesQueryOptions } from "@feat/api/github/hooks/projectIssuesQueryOptions";
import type { PageInfoType } from "@feat/api/github/schema/projectIssues.model";
import IssueCard from "@feat/issue/IssueCard";
import { LayoutSection } from "@feat/page/layout";
import { useDebounce } from "@hooks/use-debounce";
import { cn } from "@lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import {
  ArrowLeft,
  ArrowRight,
  FileQuestionMark,
  SearchIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Tasks() {
  const t = useTranslations("Issue");

  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const debounced = useDebounce(query, 500);

  const { data: projectIssues, isFetching } = useQuery(
    projectIssuesQueryOptions(page, debounced),
  );

  const { data: projectCount } = useQuery(projectCountQueryOptions());

  useEffect(() => {
    setPage(1);
  }, [debounced]);

  return (
    <LayoutSection>
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

      <Input
        placeholder={t("IssueSearch.input.placeholder")}
        icon={<SearchIcon size="16" />}
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
      <div
        className={cn(
          "grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3",
          !projectIssues && "animate-pulse",
        )}
      >
        {!isFetching ? (
          projectIssues && projectIssues.issues.length > 0 ? (
            projectIssues.issues.map((projectItem, idx) => (
              <IssueCard key={projectItem.id} issue={projectItem} index={idx} />
            ))
          ) : (
            <div className="col-span-full flex h-70 flex-col items-center justify-center gap-4">
              <FileQuestionMark className="size-20" />
              <Typography variant="p">Not found</Typography>
            </div>
          )
        ) : (
          <>
            <div className="h-70 rounded-md bg-gradient-to-br from-white/10 to-transparent to-70%" />
            <div className="h-70 rounded-md bg-gradient-to-br from-white/10 to-transparent to-70%" />
            <div className="h-70 rounded-md bg-gradient-to-br from-white/10 to-transparent to-70%" />
          </>
        )}
      </div>
      <IssuePagination pageInfo={projectIssues?.pageInfo} setPage={setPage} />
    </LayoutSection>
  );
}

type IssuePaginationProps = {
  pageInfo?: PageInfoType;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const IssuePagination = ({ pageInfo, setPage }: IssuePaginationProps) => {
  const t = useTranslations("Issue.IssuePagination");

  return (
    <LayoutSection className="mt-6 flex flex-row justify-between">
      <div className="flex flex-1 justify-start">
        <Button
          variant="outline"
          className="group"
          disabled={!pageInfo?.previousPage}
          onClick={() => setPage((p) => p - 1)}
        >
          <ArrowLeft className="transition-transform group-hover:-translate-x-1 group-hover:animate-pulse" />

          {t("button.previous")}
        </Button>
      </div>

      {pageInfo && (
        <div className="flex items-center gap-4">
          {Array.from({ length: pageInfo.totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            const isActive = pageNumber === pageInfo.currentPage;

            return (
              <Button
                key={pageNumber}
                variant={isActive ? "default" : "outline"}
                size="sm"
                disabled={isActive}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>
      )}

      <div className="flex flex-1 justify-end">
        <Button
          variant="outline"
          className="group"
          disabled={!pageInfo?.nextPage}
          onClick={() => setPage((p) => p + 1)}
        >
          {t("button.next")}
          <ArrowRight className="transition-transform group-hover:translate-x-1 group-hover:animate-pulse" />
        </Button>
      </div>
    </LayoutSection>
  );
};
