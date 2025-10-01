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
import {
  AudioLines,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  Tag,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { Typography } from "../../components/DS/typography";

export type TaskCardProps = {
  className?: string;
  issue: ProjectIssueType;
};

const IssueCard = ({ className, issue }: TaskCardProps) => {
  const t = useTranslations("Issue.IssueCard");
  const [isOpen, setIsOpen] = useState(true);

  return (
    <article
      className={cn(
        "flex flex-col justify-between rounded-md bg-blue text-white",
        className,
      )}
    >
      <div className="flex justify-between border-b border-white/60 p-5">
        <div className="flex items-center gap-4">
          <AudioLines className="size-9" />
          <Badge variant="category">{issue.project_name}</Badge>
        </div>
        <ChevronUp
          className={cn(
            "size-9 cursor-pointer transition-transform",
            isOpen && "rotate-180",
          )}
          onClick={() => setIsOpen(!isOpen)}
        />
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
            <div className="flex gap-1 overflow-hidden">
              <CircleCheck />
              <span className="truncate text-foreground uppercase">
                {issue.status}
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "relative aspect-[460/184] w-full self-center",
            !isOpen && "hidden",
          )}
        >
          <Image
            src="https://images.unsplash.com/photo-1707305311532-73bd64624a07?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="alt"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 70vw, 512px" // Optimize for tailwind breakpoint size
          />
        </div>
        <Typography
          variant="h3"
          className="flex flex-1 items-stretch gap-4 font-medium text-white"
        >
          {issue.title}
        </Typography>
        <div className="flex flex-1 items-start justify-between gap-2">
          {issue.size && <DifficultyBadge size={issue.size} />}
          {issue.priority && (
            <Badge className="ml-auto" variant="outlineWhite">
              {issue.priority}
            </Badge>
          )}
        </div>
        {/* <Typography
          variant="p"
          className={cn(
            "line-clamp-6 flex-1 overflow-hidden text-justify text-ellipsis lg:text-xl",
            !isOpen && "hidden",
          )}
          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. "
        >
          {}
        </Typography> */}
        <div className="flex flex-1 items-start gap-2">
          {issue.labels.map((label, idx) => (
            <Badge key={idx} variant="category">
              <Tag /> {label}
            </Badge>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "flex items-center gap-4 p-5",
          !isOpen && "border-t border-white/60",
        )}
      >
        <div
          className={cn("flex flex-1 flex-col gap-2", !isOpen && "items-end")}
        >
          <span className="font-light uppercase">
            {t("assigneesCount", { count: issue.assignees.length })}
          </span>
          {issue.assignees.length > 0 && (
            <div className="flex -space-x-4">
              {issue.assignees.map((assignee) => (
                <Avatar
                  key={assignee.login}
                  className={cn("size-9", !isOpen && "hidden")}
                >
                  {assignee.avatar_url && (
                    <AvatarImage
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
              !isOpen && "hidden",
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
            !isOpen && "hidden",
          )}
        >
          {t("button.join")}
          <ChevronRight />
        </Link>
      </div>
    </article>
  );
};

type DifficultyBadgeType = {
  size: IssueSize;
  className?: string;
};

const DifficultyBadge = ({ size, className }: DifficultyBadgeType) => {
  const t = useTranslations("Issue.IssueCard.DifficultyBadge");
  return (
    <Badge className={className} variant={sizeToVariant[size]}>
      {t(size)}
    </Badge>
  );
};

export default IssueCard;
