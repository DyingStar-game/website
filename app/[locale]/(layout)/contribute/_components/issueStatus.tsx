import type { ComponentProps } from "react";

import { CountInfo } from "@components/DS/countInfo/CountInfo";
import type { IssuesCountType } from "@feat/issue/get/IssuesCount.model";
import { cn } from "@lib/utils";
import { useTranslations } from "next-intl";

type IssueStatusProps = ComponentProps<"div"> & {
  projectCount?: IssuesCountType;
};

export const IssueStatus = ({
  projectCount,
  className,
  ...props
}: IssueStatusProps) => {
  const t = useTranslations("Issue.IssueStatus");

  return (
    <div
      className={cn("flex flex-col gap-8 xl:flex-row", className)}
      {...props}
    >
      <CountInfo
        className="flex-1"
        icon="bookmark-check"
        title={t("Available")}
        count={projectCount?.openIssueCount}
      />
      <CountInfo
        className="flex-1"
        icon="user-star"
        title={t("Active")}
        count={projectCount?.openIssueWithAssigneeCount}
      />
      <CountInfo
        className="flex-1"
        icon="puzzle"
        title={t("Projects")}
        count={projectCount?.countByProject.length}
      />
    </div>
  );
};
