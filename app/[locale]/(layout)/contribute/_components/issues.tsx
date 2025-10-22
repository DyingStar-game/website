"use client";

import { useEffect, useRef, useState } from "react";

import { IssueCardsFallback } from "@app/[locale]/(layout)/contribute/_components/issueCardsFallback";
import { IssueSearch } from "@app/[locale]/(layout)/contribute/_components/issueSearch";
import { IssueStatus } from "@app/[locale]/(layout)/contribute/_components/issueStatus";
import { IssuesNotFound } from "@app/[locale]/(layout)/contribute/_components/issuesNotFound";
import { DynamicJsonLd } from "@components/DS/dynamicJsonLd";
import { IssueCard } from "@components/DS/issues/issueCard";
import { Paginate } from "@components/DS/paginate/paginate";
import { useIssuesCountQuery } from "@feat/issue/get/useIssuesCountQuery.hook";
import { usePaginatedIssuesQuery } from "@feat/issue/get/usePaginatedIssuesQuery.hook";
import { LINKS } from "@feat/navigation/Links";
import { LayoutSection } from "@feat/page/layout";
import { useDebounce } from "@hooks/useDebounce";
import { useTranslations } from "next-intl";
import type { ItemList, WithContext } from "schema-dts";

export const Issues = () => {
  const issueCardsRef = useRef<HTMLDivElement>(null);
  const previousPage = useRef<number>(1);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const debounced = useDebounce(query, 500);
  const t = useTranslations("Issue");

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

  useEffect(() => {
    // Ignore first render
    if (previousPage.current === page) {
      return;
    }

    previousPage.current = page;

    if (issueCardsRef.current) {
      const header = document.getElementById("fixed-header");
      const headerOffset = header ? header.getBoundingClientRect().height : 0;

      const parent = issueCardsRef.current.parentElement;
      const styles = parent ? window.getComputedStyle(parent) : null;
      const gap = parseFloat(styles ? styles.gap : "0");

      const elementPosition =
        issueCardsRef.current.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset - gap;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [page]);

  const contributeListJsonLd: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("JsonLd.ItemList.name"),
    itemListElement: (projectIssues?.issues ?? []).map((issue, idx) => ({
      "@type": "ListItem",
      position: idx + 1 + ((projectIssues?.pageInfo.currentPage ?? 1) - 1) * 12, // TODO: Change 12 by pageSize when implemente
      item: {
        "@type": "CreativeWork",
        url: issue.url,
        name: issue.title,
        dateCreated: issue.createdAt,
        dateModified: issue.updatedAt,
        isPartOf: LINKS.Community.Github.href(),
        keywords: issue.labels,
        contributor: issue.assignees.map((assignee) => ({
          "@type": "Person",
          name: assignee.login,
          ...(assignee.avatarUrl && { image: assignee.avatarUrl }),
        })),

        ...(issue.discordUrl && { discussionUrl: issue.discordUrl }),
      },
    })),
  };

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
        className="grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3"
        ref={issueCardsRef}
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
      <DynamicJsonLd data={contributeListJsonLd} />
    </LayoutSection>
  );
};
