import { CountInfo } from "@components/DS/countInfo/CountInfo";
import type { IssuesCountType } from "@feat/issue/get/IssuesCount.type";
import { useTranslations } from "next-intl";

type IssueStatusProps = {
  projectCount?: IssuesCountType;
};

const IssueStatus = ({ projectCount }: IssueStatusProps) => {
  const t = useTranslations("Issue.IssueStatus");

  return (
    <div className="flex flex-col gap-8 xl:flex-row">
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

export default IssueStatus;
