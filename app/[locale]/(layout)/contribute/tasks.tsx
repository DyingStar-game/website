"use client";

import { projectIssuesQueryOptions } from "@feat/api/github/hooks/useProjectIssues";
import IssueCard from "@feat/issue/IssueCard";
import { LayoutSection } from "@feat/page/layout";
import { cn } from "@lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function Tasks() {
  const { data: projectIssues } = useQuery(projectIssuesQueryOptions());

  return (
    <LayoutSection>
      <div
        className={cn(
          "grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3",
          !projectIssues && "animate-pulse",
        )}
      >
        {projectIssues && projectIssues.length > 0 ? (
          projectIssues.map((projectItem, idx) => (
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
    </LayoutSection>
  );
}
