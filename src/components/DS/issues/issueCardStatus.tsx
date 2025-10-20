"use client";

import { getProjectStatusIcon } from "@feat/issue/projectHelper";
import { DynamicIcon } from "lucide-react/dynamic";

type StatusInfoProps = {
  status: string;
  className?: string;
};

export const IssueCardStatus = ({ status, className }: StatusInfoProps) => {
  return (
    <div className={className}>
      <DynamicIcon name={getProjectStatusIcon(status)} />
      <span className="text-foreground truncate uppercase">{status}</span>
    </div>
  );
};
