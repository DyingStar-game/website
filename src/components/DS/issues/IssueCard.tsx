"use client";

import { LogoDiscordSvg } from "@components/svg/logoDiscord";
import { type ProjectIssueType } from "@feat/api/github/schema/projectIssues.model";
import {
  getProjectBgColor,
  getProjectIcon,
  getProjectImage,
} from "@feat/issue/project-helper";
import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Badge } from "@ui/badge";
import { buttonVariants } from "@ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { motion } from "framer-motion";
import { ChevronRight, Tag, Users } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { Typography } from "../typography";
import { DifficultyBadge } from "./issueCardDifficultyBadge";
import { IssueCardStatus } from "./issueCardStatus";

export type TaskCardProps = {
  className?: string;
  issue: ProjectIssueType;
  index: number;
};

export const IssueCard = ({ className, issue, index }: TaskCardProps) => {
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
            <IssueCardStatus
              status={issue.status}
              className="flex gap-1 overflow-hidden"
            />
          )}
        </div>
        <div className={cn("relative aspect-[460/184] w-full self-center")}>
          <Image
            src={getProjectImage(issue.project_number)}
            alt={issue.project_name}
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
      <div
        className={cn(
          "flex flex-col items-stretch gap-5 p-5 pt-0 sm:flex-row sm:items-center sm:pt-5",
        )}
      >
        <div
          className={cn(
            "flex flex-1 items-center justify-start gap-2 sm:min-h-17 sm:flex-col sm:items-start sm:justify-center",
          )}
        >
          <span className="text-sm font-light uppercase md:text-base">
            {t("assigneesCount", { count: issue.assignees.length })}
          </span>
          {issue.assignees.length > 0 && (
            <div className="flex -space-x-4">
              {issue.assignees.map((assignee) => (
                <Tooltip key={assignee.login}>
                  <TooltipTrigger asChild>
                    <Avatar className={cn("size-7 sm:size-9")}>
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
                  </TooltipTrigger>
                  <TooltipContent>{assignee.login}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
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
              "flex-1",
            )}
          >
            {t("button.join")}
            <ChevronRight />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};
