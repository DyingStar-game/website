"use client";

import {
  type IssueSize,
  sizeToVariant,
} from "@feat/api/github/schema/projectIssues.model";
import { Badge } from "@ui/badge";
import { useTranslations } from "next-intl";

type DifficultyBadgeProps = {
  size: IssueSize;
  className?: string;
};

export const DifficultyBadge = ({ size, className }: DifficultyBadgeProps) => {
  const t = useTranslations("Issue.IssueCard.DifficultyBadge");
  return (
    <Badge className={className} variant={sizeToVariant[size]}>
      {t(size)}
    </Badge>
  );
};
