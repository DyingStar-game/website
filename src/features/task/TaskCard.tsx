"use client";

import React, { useState } from "react";

import { LINKS } from "@feat/navigation/Links";
import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";
import { Avatar, AvatarFallback } from "@ui/avatar";
import { Badge } from "@ui/badge";
import { buttonVariants } from "@ui/button";
import {
  AudioLines,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  Minus,
  Tag,
  Users,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";

import { Typography } from "../../components/DS/typography";

export type TaskCardProps = {
  className?: string;
  title: string;
  content?: string;
};

const TaskCard = ({ className, title, content }: TaskCardProps) => {
  const t = useTranslations("News.NewsItem");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article
      className={cn("flex flex-col rounded-md bg-blue text-white", className)}
    >
      <div className="flex justify-between border-b border-white/60 p-5">
        <div className="flex items-center gap-4">
          <AudioLines className="size-9" />
          <Badge variant="category">Audio</Badge>
        </div>
        <ChevronUp
          className={cn(
            "size-9 cursor-pointer transition-transform",
            isOpen && "rotate-180",
          )}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex gap-2">
          <div className="flex gap-1">
            <Users />
            <span className="text-foreground uppercase">Team</span>
          </div>
          <div className="flex gap-1">
            <CircleCheck />
            <span className="text-foreground uppercase">In progress</span>
          </div>
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
          className="flex items-center gap-4 font-medium text-white"
        >
          {title}
        </Typography>
        <div className="flex justify-between gap-2">
          <Badge variant="category">Niveau intermédiaire</Badge>
          <Badge variant="category">Disponible et titre plus long</Badge>
        </div>
        <Typography
          variant="p"
          className={cn(
            "line-clamp-6 flex-1 overflow-hidden text-justify text-ellipsis lg:text-xl",
            !isOpen && "hidden",
          )}
          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. "
        >
          {content}
        </Typography>
        <div className="flex gap-2">
          <Badge variant="category">
            <Tag /> Automation
          </Badge>
          <Badge variant="category">
            <Tag /> CI/CD
          </Badge>
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
          <span className="font-light uppercase">26 contributeurs</span>
          <Avatar className={cn(!isOpen && "hidden")}>
            <AvatarFallback>YN</AvatarFallback>
          </Avatar>
        </div>
        <Link
          href="#"
          className={cn(
            buttonVariants({
              variant: "outlineWhite",
            }),
            !isOpen && "hidden",
          )}
        >
          Rejoindre
          <ChevronRight />
        </Link>
      </div>
    </article>
  );
};

type NewsItemAuthorProps = {
  author: string;
  date: Date;
  className?: string;
};

export const NewsItemAuthor = ({
  author,
  date,
  className,
}: NewsItemAuthorProps) => {
  const format = useFormatter();

  return (
    <div
      className={cn(
        "flex items-center gap-3 font-light text-foreground uppercase",
        className,
      )}
    >
      <Avatar>
        <AvatarFallback>{author.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      {author}
      <Minus className="rotate-90 text-input" />
      {format.dateTime(date, { dateStyle: "short" })}
    </div>
  );
};

type NewsItemTagsProps = {
  tags: string[];
};

export const NewsItemTags = ({ tags }: NewsItemTagsProps) => {
  return (
    <div className="flex gap-4">
      {tags.map((tag) => {
        return (
          <Badge key={tag} variant="category">
            <Tag /> {tag}
          </Badge>
        );
      })}
    </div>
  );
};

export default TaskCard;
