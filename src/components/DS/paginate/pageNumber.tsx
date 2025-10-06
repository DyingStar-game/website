import type { ComponentProps } from "react";

import { Button } from "@components/ui/button";
import type { PageInfoType } from "@feat/api/github/schema/projectIssues.model";
import { cn } from "@lib/utils";

type PageNumberProps = ComponentProps<"div"> & {
  pageInfo: PageInfoType;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const PageNumber = ({ pageInfo, setPage, className }: PageNumberProps) => {
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

export default PageNumber;
