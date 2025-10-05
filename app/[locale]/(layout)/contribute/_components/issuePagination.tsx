"use client";

import type { ComponentProps } from "react";

import type { PageInfoType } from "@feat/api/github/schema/projectIssues.model";
import { LayoutSection } from "@feat/page/layout";
import { cn } from "@lib/utils";
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
    <LayoutSection className="mt-6 flex flex-col justify-between lg:flex-row">
      <div className="flex flex-1 justify-between">
        <Button
          variant="outline"
          className="group"
          disabled={!pageInfo?.previousPage}
          onClick={() => setPage((p) => p - 1)}
        >
          <ArrowLeft className="transition-transform group-hover:-translate-x-1 group-hover:animate-pulse" />

          {t("button.previous")}
        </Button>

        {pageInfo && (
          <IssuePageNumber
            className="hidden lg:flex"
            pageInfo={pageInfo}
            setPage={setPage}
          />
        )}

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

      {pageInfo && (
        <IssuePageNumber
          className="flex justify-center lg:hidden"
          pageInfo={pageInfo}
          setPage={setPage}
        />
      )}
    </LayoutSection>
  );
};

type IssuePageNumberProps = ComponentProps<"div"> & {
  pageInfo: PageInfoType;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const IssuePageNumber = ({
  pageInfo,
  setPage,
  className,
}: IssuePageNumberProps) => {
  const { currentPage, totalPages } = pageInfo;
  const maxPagesToShow = 2;

  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage === 1) {
    endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
  }
  if (currentPage === totalPages) {
    startPage = Math.max(2, endPage - maxPagesToShow + 1);
  }
  if (endPage - startPage + 1 < maxPagesToShow) {
    if (startPage === 2) {
      endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
    } else if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - maxPagesToShow + 1);
    }
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={cn("items-center gap-4", className)}>
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "outline"}
        size="sm"
        disabled={currentPage === 1}
        onClick={() => setPage(1)}
      >
        1
      </Button>

      {startPage > 2 && <span>...</span>}

      {pages.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={pageNumber === currentPage ? "default" : "outline"}
          size="sm"
          disabled={pageNumber === currentPage}
          onClick={() => setPage(pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}

      {endPage < totalPages - 1 && <span>...</span>}

      {totalPages > 1 && (
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setPage(totalPages)}
        >
          {totalPages}
        </Button>
      )}
    </div>
  );
};
