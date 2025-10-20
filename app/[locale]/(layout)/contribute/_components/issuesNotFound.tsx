import { Typography } from "@components/DS/typography";
import { FileQuestionMark } from "lucide-react";
import { useTranslations } from "next-intl";

export const IssuesNotFound = () => {
  const t = useTranslations("Issue.IssuesNotFound");
  return (
    <div className="h-143 col-span-full flex flex-col items-center justify-center gap-4">
      <FileQuestionMark className="size-20" />
      <Typography variant="p">{t("label")}</Typography>
    </div>
  );
};
