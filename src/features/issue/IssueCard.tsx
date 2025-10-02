"use client";

import React, { useState } from "react";

import { LogoDiscordSvg } from "@components/svg/logoDiscord";
import {
  type IssueSize,
  type ProjectIssueType,
  sizeToVariant,
} from "@feat/api/github/schema/projectIssues.model";
import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Badge } from "@ui/badge";
import { buttonVariants } from "@ui/button";
import { motion } from "framer-motion";
import { ChevronRight, Tag, Users } from "lucide-react";
import type { IconName } from "lucide-react/dynamic";
import { DynamicIcon } from "lucide-react/dynamic";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { Typography } from "../../components/DS/typography";
import {
  getProjectBgColor,
  getProjectIcon,
  getProjectImage,
} from "./project-helper";

export type TaskCardProps = {
  className?: string;
  issue: ProjectIssueType;
  index: number;
};

const IssueCard = ({ className, issue, index }: TaskCardProps) => {
  const t = useTranslations("Issue.IssueCard");

  return (
    <motion.article
      className={cn(
        "flex break-inside-avoid-column flex-col justify-between rounded-md text-white",
        getProjectBgColor(issue.project_number),
        className,
      )}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
        delay: (index % 3) * 0.05,
      }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="flex justify-between border-b border-white/60 p-5">
        <div className="flex items-center gap-4">
          <DynamicIcon
            name={getProjectIcon(issue.project_number)}
            className="size-9"
          />
          <Badge variant="category">
            {issue.project_name.replace(/\p{Extended_Pictographic}/gu, "")}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex h-6 gap-2">
          {issue.team && (
            <div className="flex gap-1 overflow-hidden">
              <Users />
              <span className="truncate text-foreground uppercase">
                {issue.team}
              </span>
            </div>
          )}
          {issue.status && (
            <StatusInfo
              status={issue.status}
              className="flex gap-1 overflow-hidden"
            />
          )}
        </div>
        <div className={cn("relative aspect-[460/184] w-full self-center")}>
          <Image
            src={getProjectImage(issue.project_number)}
            alt="alt"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 70vw, 512px" // Optimize for tailwind breakpoint size
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.32, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Typography
            variant="h3"
            title={issue.title}
            className="line-clamp-2 flex-1 items-stretch gap-4 overflow-hidden font-medium text-ellipsis text-white"
          >
            {issue.title}
          </Typography>
        </motion.div>

        {(issue.size ?? issue.priority) && (
          <div className="flex items-start justify-between gap-2">
            {issue.size && <DifficultyBadge size={issue.size} />}
            {issue.priority && (
              <Badge className="ml-auto" variant="outlineWhite">
                {issue.priority}
              </Badge>
            )}
          </div>
        )}
        {issue.labels.length > 0 && (
          <div className="flex items-start gap-2">
            {issue.labels.map((label, idx) => (
              <Badge key={idx} variant="category">
                <Tag /> {label}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className={cn("flex items-center gap-4 p-5")}>
        <div
          className={cn("flex min-h-17 flex-1 flex-col justify-center gap-2")}
        >
          <span className="font-light uppercase">
            {t("assigneesCount", { count: issue.assignees.length })}
          </span>
          {issue.assignees.length > 0 && (
            <div className="flex -space-x-4">
              {issue.assignees.map((assignee) => (
                <Avatar key={assignee.login} className={cn("size-9")}>
                  {assignee.avatar_url && (
                    <AvatarImage
                      className="bg-white"
                      src={assignee.avatar_url}
                      alt={assignee.login}
                    />
                  )}
                  <AvatarFallback>
                    {assignee.login.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          )}
        </div>
        {issue.discord_url && (
          <Link
            href={issue.discord_url}
            target="_blank"
            className={cn(
              buttonVariants({
                variant: "outlineWhite",
              }),
            )}
          >
            <span className="sr-only">Discord</span>
            <LogoDiscordSvg />
          </Link>
        )}
        <Link
          href={issue.url}
          target="_blank"
          className={cn(
            buttonVariants({
              variant: "outlineWhite",
            }),
          )}
        >
          {t("button.join")}
          <ChevronRight />
        </Link>
      </div>
    </motion.article>
  );
};

type DifficultyBadgeProps = {
  size: IssueSize;
  className?: string;
};

const DifficultyBadge = ({ size, className }: DifficultyBadgeProps) => {
  const t = useTranslations("Issue.IssueCard.DifficultyBadge");
  return (
    <Badge className={className} variant={sizeToVariant[size]}>
      {t(size)}
    </Badge>
  );
};

type StatusInfoProps = {
  status: string;
  className?: string;
};

const StatusInfo = ({ status, className }: StatusInfoProps) => {
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

export default IssueCard;
