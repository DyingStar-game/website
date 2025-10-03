import { useCallback, useState } from "react";

import type { PageInfoType } from "../schema/projectIssues.model";

export function usePagination() {
  const [pageIndex, setPageIndex] = useState(1);
  const [canGoNext, setCanGoNext] = useState(false);

  const setPageInfo = useCallback((pageInfo?: PageInfoType) => {
    if (!pageInfo) return;

    setCanGoNext(pageInfo.hasNextPage);
  }, []);

  const goNext = useCallback(() => {
    if (canGoNext) setPageIndex((i) => i + 1);
  }, [canGoNext]);

  const goPrev = useCallback(() => {
    setPageIndex((i) => (i > 1 ? i - 1 : i));
  }, []);

  const reset = useCallback(() => {
    setPageIndex(1);
  }, []);

  return {
    pageIndex,
    canGoPrev: pageIndex > 1,
    canGoNext,
    goPrev,
    goNext,
    reset,
    setPageInfo,
  };
}
