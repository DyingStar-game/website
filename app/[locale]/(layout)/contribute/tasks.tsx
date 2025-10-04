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
  Circle,
  CircleCheckBig,
  FileQuestionMark,
  Minus,
  SearchIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

export default function Tasks() {
  const t = useTranslations("Issue");
  const formatter = useFormatter();

  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const debounced = useDebounce(query, 500);

  const { data: projectIssues, isFetching } = useQuery(
    projectIssuesQueryOptions(page, debounced, selectedProjects),
  );

  const { data: projectCount } = useQuery(projectCountQueryOptions());

  const toggleProject = (value: string) => {
    setSelectedProjects((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  useEffect(() => {
    setPage(1);
  }, [debounced, selectedProjects]);

  return (
    <LayoutSection>
      <div className="flex flex-col gap-8 xl:flex-row">
        <CountInfo
          className="flex-1"
          icon="bookmark-check"
          title={t("IssueStatus.Available")}
          count={projectCount?.openIssueCount ?? 0}
        />
        <CountInfo
          className="flex-1"
          icon="user-star"
          title={t("IssueStatus.Active")}
          count={projectCount?.openIssueWithAssigneeCount ?? 0}
        />
        <CountInfo
          className="flex-1"
          icon="puzzle"
          title={t("IssueStatus.Projects")}
          count={projectCount?.countByProject.length ?? 0}
        />
      </div>

      <LayoutSection className="gap-5 rounded-md bg-card p-8" padding="none">
        <Input
          placeholder={t("IssueSearch.input.placeholder")}
          icon={<SearchIcon />}
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <div className="flex flex-col flex-wrap gap-4 xl:flex-row">
          {projectCount?.countByProject.map((count) => {
            const isSelected = selectedProjects.includes(count.value);

            return (
              <Button
                key={count.value}
                variant="search"
                onClick={() => toggleProject(count.value)}
                className={cn(
                  isSelected && "active",
                  "justify-start gap-3 pr-4 pl-3.5",
                )}
              >
                <span>
                  {isSelected ? (
                    <CircleCheckBig className="size-5" />
                  ) : (
                    <Circle className="size-5" />
                  )}
                </span>
                <span className="flex-1 text-left">{count.value}</span>

                <span className="ml-1 flex w-2 justify-center">
                  <Minus className="size-9 rotate-90" strokeWidth={1} />
                </span>
                <span className="min-w-6">{formatter.number(count.count)}</span>
              </Button>
            );
          })}
        </div>
      </LayoutSection>

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
            <div className="col-span-full flex h-143 flex-col items-center justify-center gap-4">
              <FileQuestionMark className="size-20" />
              <Typography variant="p">Not found</Typography>
            </div>
          )
        ) : (
          <>
            <div className="h-143 rounded-md bg-gradient-to-br from-white/10 to-transparent to-70%" />
            <div className="h-143 rounded-md bg-gradient-to-br from-white/10 to-transparent to-70%" />
            <div className="h-143 rounded-md bg-gradient-to-br from-white/10 to-transparent to-70%" />
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
