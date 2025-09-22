"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination";

type AutomaticPaginationProps = {
  currentPage: number;
  totalPages: number;
  searchParam?: string;
  paramName?: string;
};

export function AutomaticPagination({
  currentPage,
  totalPages,
  searchParam,
  paramName = "page",
}: AutomaticPaginationProps) {
  const generatePageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const buildUrl = (page: number) => {
    const searchQuery = searchParam
      ? `&${getSearchParamName()}=${searchParam}`
      : "";
    return `?${paramName}=${page}${searchQuery}`;
  };

  const getSearchParamName = () => {
    // Determine search param name based on context
    return paramName === "page" ? "q" : "search";
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={currentPage > 1 ? buildUrl(currentPage - 1) : undefined}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {generatePageNumbers().map((pageNum, index) => (
            <PaginationItem key={index}>
              {pageNum === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={buildUrl(pageNum as number)}
                  isActive={pageNum === currentPage}
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={
                currentPage < totalPages ? buildUrl(currentPage + 1) : undefined
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
