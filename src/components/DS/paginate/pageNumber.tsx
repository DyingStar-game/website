import type { ComponentProps } from "react";

import type { PageInfoType } from "@feat/api/github/schema/projectIssues.model";
import { cn } from "@lib/utils";
import type { UrlObject } from "url";

import type { PaginateModeType } from "./paginate";
import { PaginateAction } from "./paginateAction";

type PageNumberProps = ComponentProps<"div"> & {
  pageInfo: PageInfoType;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  mode?: PaginateModeType;
  getPageHref?: (page: number) => string | UrlObject;
};

const PageNumber = ({
  pageInfo,
  setPage,
  className,
  mode = "button",
  getPageHref,
  ...props
}: PageNumberProps) => {
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

  const renderPage = (pageNumber: number, isCurrent: boolean) => (
    <PaginateAction
      key={pageNumber}
      mode={mode}
      disabled={isCurrent}
      onClick={mode === "button" ? () => setPage?.(pageNumber) : undefined}
      href={
        mode === "link" && getPageHref ? getPageHref(pageNumber) : undefined
      }
      variant={isCurrent ? "default" : "outline"}
      size="sm"
    >
      {pageNumber}
    </PaginateAction>
  );

  return (
    <div className={cn("items-center gap-4", className)} {...props}>
      {renderPage(1, currentPage === 1)}

      {startPage > 2 && <span>...</span>}

      {pages.map((pageNumber) =>
        renderPage(pageNumber, pageNumber === currentPage),
      )}

      {endPage < totalPages - 1 && <span>...</span>}

      {totalPages > 1 && renderPage(totalPages, currentPage === totalPages)}
    </div>
  );
};

export default PageNumber;
