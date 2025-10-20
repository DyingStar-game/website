import type { Dispatch, SetStateAction } from "react";

import IssueSearchButtonFallback from "@app/[locale]/(layout)/contribute/_components/issueSearchButtonFallback";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import type { IssuesCountType } from "@feat/issue/get/IssuesCount.model";
import type { LayoutSectionProps } from "@feat/page/layout";
import { LayoutSection } from "@feat/page/layout";
import { cn } from "@lib/utils";
import { Circle, CircleCheckBig, Minus, SearchIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

type IssueSearchProps = LayoutSectionProps & {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  projectCount?: IssuesCountType;
  toggleProject: (value: string) => void;
  selectedProjects: string[];
};

export const IssueSearch = ({
  query,
  setQuery,
  projectCount,
  selectedProjects,
  toggleProject,
  className,
  ...props
}: IssueSearchProps) => {
  const t = useTranslations("Issue.IssueSearch");
  const formatter = useFormatter();
  return (
    <LayoutSection
      className={cn("bg-card gap-5 rounded-md p-4 sm:p-8", className)}
      padding="none"
      {...props}
    >
      <Input
        id="search"
        placeholder={t("input.placeholder")}
        icon={<SearchIcon />}
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
      <div className="flex flex-col flex-wrap gap-4 xl:flex-row">
        {projectCount ? (
          projectCount.countByProject.map((count) => {
            const isSelected = selectedProjects.includes(count.value);

            return (
              <Button
                key={count.value}
                variant="filter"
                onClick={() => toggleProject(count.value)}
                className={cn(
                  isSelected && "active",
                  "w-full justify-start gap-3 pl-3.5 pr-4",
                )}
              >
                <span>
                  {isSelected ? (
                    <CircleCheckBig className="size-5" />
                  ) : (
                    <Circle className="size-5" />
                  )}
                </span>
                <span className="flex-1 truncate text-left">{count.value}</span>

                <span className="flex w-1 justify-center">
                  <Minus className="size-8 rotate-90" strokeWidth={1} />
                </span>
                <span className="min-w-6">{formatter.number(count.count)}</span>
              </Button>
            );
          })
        ) : (
          <IssueSearchButtonFallback />
        )}
      </div>
    </LayoutSection>
  );
};
