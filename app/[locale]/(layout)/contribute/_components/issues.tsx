"use client";

import { useEffect, useState } from "react";

import { IssueCard } from "@components/DS/issues/IssueCard";
import { Paginate } from "@components/DS/paginate/paginate";
import { useIssuesCountQuery } from "@feat/issue/get/useIssuesCountQuery.hook";
import { usePaginatedIssuesQuery } from "@feat/issue/get/usePaginatedIssuesQuery.hook";
import { LayoutSection } from "@feat/page/layout";
import { useDebounce } from "@hooks/useDebounce";
import { cn } from "@lib/utils";

import IssueCardsFallback from "./issueCardsFallback";
import IssueSearch from "./issueSearch";
import IssueStatus from "./issueStatus";
import IssuesNotFound from "./issuesNotFound";

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
