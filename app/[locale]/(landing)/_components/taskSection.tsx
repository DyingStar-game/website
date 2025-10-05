import { IssueCard } from "@components/DS/issues/IssueCard";
import { searchProjectIssues } from "@feat/api/github/hooks/indexedProjectIssues";
import { LINKS } from "@feat/navigation/Links";
import { LayoutContentTitle, LayoutSection } from "@feat/page/layout";
import { getTranslations } from "next-intl/server";

export const TaskSection = async () => {
  const t = await getTranslations("Landing.Task");

  const issues = await searchProjectIssues(1, null, null, 6);

  return (
    <LayoutSection className="gap-14" size="container">
      <LayoutContentTitle
        title={t("title")}
        action={{ label: t("action"), href: LINKS.Project.Contribute.href() }}
      />
      <div className="gap-4 *:mb-4 xl:columns-2 2xl:columns-3">
        {issues.issues.map((issue, idx) => (
          <IssueCard key={issue.id} issue={issue} index={idx} />
        ))}
      </div>
    </LayoutSection>
  );
};
