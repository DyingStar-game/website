"use client";

import { DynamicIcon, type IconName } from "lucide-react/dynamic";

type StatusInfoProps = {
  status: string;
  className?: string;
};

export const IssueCardStatus = ({ status, className }: StatusInfoProps) => {
  const statusIconMap: Record<string, IconName> = {
    "written specifications": "circle-question-mark",
    todo: "circle-ellipsis",
    "in progress": "circle-play",
    done: "circle-check",
  };

  return (
    <div className={className}>
      <DynamicIcon name={statusIconMap[status.toLowerCase()] ?? "circle"} />
      <span className="truncate text-foreground uppercase">{status}</span>
    </div>
  );
};
