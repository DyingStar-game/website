import { Typography } from "../../components/DS/typography";
import React from "react";
import Link from "next/link";
import { buttonVariants } from "@ui/button";
import { cn } from "@lib/utils";

export type ContentTitleProps = {
  title: string;
  btnTitle: string;
  href: string;
  className?: string;
};

const ContentTitle = ({
  title,
  btnTitle,
  href,
  className,
}: ContentTitleProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-center",
        className,
      )}
    >
      <Typography
        variant="h2"
        className="flex flex-1 items-center gap-4 overflow-hidden text-6xl font-normal uppercase"
      >
        {title}
      </Typography>

      <Link
        href={href}
        className={buttonVariants({
          variant: "outline",
        })}
      >
        {btnTitle}
      </Link>
    </div>
  );
};

export default ContentTitle;
