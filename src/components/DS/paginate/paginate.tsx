import type { ComponentProps } from "react";

import type { PageInfoType } from "@feat/api/schema/pageInfo.model";
import { LayoutSection } from "@feat/page/layout";
import { cn } from "@lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UrlObject } from "url";

import PageNumber from "./pageNumber";
import { PaginateAction } from "./paginateAction";

export type PaginateModeType = "button" | "link";

type PaginateProps = ComponentProps<"section"> & {
  pageInfo?: PageInfoType;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  buttonLabelLeft?: string;
  buttonLabelRight?: string;
  mode?: PaginateModeType;
  getPageHref?: (page: number) => string | UrlObject;
};

export const Paginate = ({
  pageInfo,
  setPage,
  buttonLabelLeft,
  buttonLabelRight,
  mode = "button",
  getPageHref,
  className,
  ...props
}: PaginateProps) => {
  const t = useTranslations("Paginate");
  const canPrev = !!pageInfo?.previousPage;
  const canNext = !!pageInfo?.nextPage;

  return (
    <LayoutSection
      className={cn(
        "flex flex-col justify-between gap-6 lg:flex-row",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 justify-between gap-4">
        <PaginateAction
          className="group flex-1 sm:flex-0"
          mode={mode}
          disabled={!canPrev}
          onClick={() => setPage?.((p) => p - 1)}
          href={
            getPageHref && pageInfo
              ? getPageHref(pageInfo.currentPage - 1)
              : undefined
          }
        >
          <ArrowLeft className="transition-transform group-hover:-translate-x-1 group-hover:animate-pulse" />
          {buttonLabelLeft ?? t("button.previous")}
        </PaginateAction>

        {pageInfo && (
          <PageNumber
            className="hidden lg:flex"
            pageInfo={pageInfo}
            setPage={setPage}
            mode={mode}
            getPageHref={getPageHref}
          />
        )}

        <PaginateAction
          className="group flex-1 sm:flex-0"
          mode={mode}
          disabled={!canNext}
          onClick={() => setPage?.((p) => p + 1)}
          href={
            getPageHref && pageInfo
              ? getPageHref(pageInfo.currentPage + 1)
              : undefined
          }
        >
          {buttonLabelRight ?? t("button.next")}
          <ArrowRight className="transition-transform group-hover:translate-x-1 group-hover:animate-pulse" />
        </PaginateAction>
      </div>

      {pageInfo && (
        <PageNumber
          className="flex justify-center lg:hidden"
          pageInfo={pageInfo}
          setPage={setPage}
          mode={mode}
          getPageHref={getPageHref}
        />
      )}
    </LayoutSection>
  );
};
