"use client";

import type { PageInfoType } from "@feat/api/github/schema/projectIssues.model";
import { LayoutSection } from "@feat/page/layout";
import { Button } from "@ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

type IssuePaginationProps = {
  pageInfo?: PageInfoType;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const IssuePagination = ({
  pageInfo,
  setPage,
}: IssuePaginationProps) => {
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
