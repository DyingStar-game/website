"use client";

import type { IssueSize } from "@feat/api/github/schema/issueField.size.graphql";
import { getProjectVariantSize } from "@feat/issue/project-helper";
import { Badge } from "@ui/badge";
import { useTranslations } from "next-intl";

type DifficultyBadgeProps = {
  size: IssueSize;
  className?: string;
};

export const DifficultyBadge = ({ size, className }: DifficultyBadgeProps) => {
  const t = useTranslations("Issue.IssueCard.DifficultyBadge");
  return (
    <Badge className={className} variant={getProjectVariantSize(size)}>
      {t(size)}
    </Badge>
  );
};
