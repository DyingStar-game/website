import { useCallback, useState } from "react";

import type { PageInfoType } from "../schema/projectIssues.model";

export function useForwardCursorPager() {
  const [history, setHistory] = useState<(string | undefined)[]>([undefined]);
  const [pageIndex, setPageIndex] = useState(0);
  const [canGoNext, setCanGoNExt] = useState(false);

  const after = history[pageIndex];

  const setPageInfo = useCallback(
    (pageInfo?: PageInfoType) => {
      if (!pageInfo) return;
      const endCursor = pageInfo.endCursor ?? undefined;

      setCanGoNExt(pageInfo.hasNextPage);

      if (
        pageInfo.hasNextPage &&
        pageIndex === history.length - 1 &&
        endCursor &&
        history[history.length - 1] !== endCursor
      ) {
        setHistory((h) => [...h, endCursor]);
      }
    },
    [history, pageIndex],
  );

  const goNext = useCallback(() => {
    if (canGoNext) setPageIndex((i) => i + 1);
  }, [canGoNext]);

  const goPrev = useCallback(() => {
    setPageIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const reset = useCallback(() => {
    setHistory([undefined]);
    setPageIndex(0);
  }, []);

  return {
    after,
    pageIndex,
    totalPagesLoaded: history.length,
    history,
    canGoPrev: pageIndex > 0,
    canGoNext,
    goPrev,
    goNext,
    reset,
    setPageInfo,
  };
}
