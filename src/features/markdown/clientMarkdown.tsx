"use client";

import { type ComponentPropsWithoutRef } from "react";

import { cn } from "@lib/utils";
import Markdown from "markdown-to-jsx";

type ClientMarkdownProps = ComponentPropsWithoutRef<typeof Markdown>;

export const ClientMarkdown = ({
  children,
  className,
  ...props
}: ClientMarkdownProps) => {
  return (
    <Markdown className={cn("prose dark:prose-invert", className)} {...props}>
      {children}
    </Markdown>
  );
};
