"use client";

import { projectIssuesQueryOptions } from "@feat/api/github/hooks/useProjectIssues";
import IssueCard from "@feat/issue/IssueCard";
import { LayoutSection } from "@feat/page/layout";
import { useQuery } from "@tanstack/react-query";

export default function Tasks() {
  const { data: projectIssues, error } = useQuery(projectIssuesQueryOptions());

  return (
    <LayoutSection>
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 2xl:grid-cols-3">
        {projectIssues?.map((projectItem) => (
          <IssueCard key={projectItem.id} issue={projectItem} />
        ))}
      </div>
    </LayoutSection>
  );
}
