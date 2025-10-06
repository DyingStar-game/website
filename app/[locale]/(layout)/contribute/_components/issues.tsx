"use client";

import { useEffect, useState } from "react";

import { CountInfo } from "@components/DS/countInfo/CountInfo";
import { IssueCard } from "@components/DS/issues/IssueCard";
import { Paginate } from "@components/DS/paginate/paginate";
import { Typography } from "@components/DS/typography";
import { useIssuesCountQuery } from "@feat/issue/get/useIssuesCountQuery.hook";
import { usePaginatedIssuesQuery } from "@feat/issue/get/usePaginatedIssuesQuery.hook";
import { LayoutSection } from "@feat/page/layout";
import { useDebounce } from "@hooks/useDebounce";
import { cn } from "@lib/utils";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import {
  Circle,
  CircleCheckBig,
  FileQuestionMark,
  Minus,
  SearchIcon,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

export const Issues = () => {
  const t = useTranslations("Issue");
  const formatter = useFormatter();

  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const debounced = useDebounce(query, 500);

  const { data: projectIssues, isFetching } = usePaginatedIssuesQuery({
    page,
    query: debounced,
    projects: selectedProjects,
  });

  const { data: projectCount } = useIssuesCountQuery();

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
                variant="filter"
                onClick={() => toggleProject(count.value)}
                className={cn(
                  isSelected && "active",
                  "w-full justify-start gap-3 pr-4 pl-3.5",
                )}
              >
                <span>
                  {isSelected ? (
                    <CircleCheckBig className="size-5" />
                  ) : (
                    <Circle className="size-5" />
                  )}
                </span>
                <span className="flex-1 truncate text-left">{count.value}</span>

                <span className="flex w-1 justify-center">
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
      <Paginate pageInfo={projectIssues?.pageInfo} setPage={setPage} />
    </LayoutSection>
  );
};
