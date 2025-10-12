"use client";

import { useEffect, useState } from "react";

import IssueCardsFallback from "@app/[locale]/(layout)/contribute/_components/issueCardsFallback";
import IssueSearch from "@app/[locale]/(layout)/contribute/_components/issueSearch";
import IssueStatus from "@app/[locale]/(layout)/contribute/_components/issueStatus";
import IssuesNotFound from "@app/[locale]/(layout)/contribute/_components/issuesNotFound";
import { IssueCard } from "@components/DS/issues/issueCard";
import { Paginate } from "@components/DS/paginate/paginate";
import { useIssuesCountQuery } from "@feat/issue/get/useIssuesCountQuery.hook";
import { usePaginatedIssuesQuery } from "@feat/issue/get/usePaginatedIssuesQuery.hook";
import { LayoutSection } from "@feat/page/layout";
import { useDebounce } from "@hooks/useDebounce";
import { cn } from "@lib/utils";

export const Issues = () => {
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
      <IssueStatus projectCount={projectCount} />

      <IssueSearch
        query={query}
        setQuery={setQuery}
        selectedProjects={selectedProjects}
        toggleProject={toggleProject}
        projectCount={projectCount}
      />

      <div
        className={cn("grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3")}
      >
        {!isFetching ? (
          projectIssues && projectIssues.issues.length > 0 ? (
            projectIssues.issues.map((projectItem, idx) => (
              <IssueCard key={projectItem.id} issue={projectItem} index={idx} />
            ))
          ) : (
            <IssuesNotFound />
          )
        ) : (
          <IssueCardsFallback />
        )}
      </div>
      <Paginate pageInfo={projectIssues?.pageInfo} setPage={setPage} />
    </LayoutSection>
  );
};
