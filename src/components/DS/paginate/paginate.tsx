import type { ComponentProps } from "react";

import type { PageInfoType } from "@feat/api/github/schema/projectIssues.model";
import { LayoutSection } from "@feat/page/layout";
import { cn } from "@lib/utils";
import { Button } from "@ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import PageNumber from "./pageNumber";

type PaginateProps = ComponentProps<"section"> & {
  pageInfo?: PageInfoType;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  buttonLabelLeft?: string;
  buttonLabelRight?: string;
};

export const Paginate = ({
  pageInfo,
  setPage,
  buttonLabelLeft,
  buttonLabelRight,
  className,
  ...props
}: PaginateProps) => {
  const t = useTranslations("Paginate");

  return (
    <LayoutSection
      className={cn(
        "mt-6 flex flex-col justify-between lg:flex-row",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 justify-between">
        <Button
          variant="outline"
          className="group"
          disabled={!pageInfo?.previousPage}
          onClick={() => setPage((p) => p - 1)}
        >
          <ArrowLeft className="transition-transform group-hover:-translate-x-1 group-hover:animate-pulse" />

          {buttonLabelLeft ?? t("button.previous")}
        </Button>

        {pageInfo && (
          <PageNumber
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
          {buttonLabelRight ?? t("button.next")}
          <ArrowRight className="transition-transform group-hover:translate-x-1 group-hover:animate-pulse" />
        </Button>
      </div>

      {pageInfo && (
        <PageNumber
          className="flex justify-center lg:hidden"
          pageInfo={pageInfo}
          setPage={setPage}
        />
      )}
    </LayoutSection>
  );
};
