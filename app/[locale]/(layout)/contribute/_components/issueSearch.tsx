import type { Dispatch, SetStateAction } from "react";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import type { IssuesCountType } from "@feat/issue/get/IssuesCount.type";
import { LayoutSection } from "@feat/page/layout";
import { cn } from "@lib/utils";
import { Circle, CircleCheckBig, Minus, SearchIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import IssueSearchButtonFallback from "./issueSearchButtonFallback";

type IssueSearchProps = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  projectCount?: IssuesCountType;
  toggleProject: (value: string) => void;
  selectedProjects: string[];
};

const IssueSearch = ({
  query,
  setQuery,
  projectCount,
  selectedProjects,
  toggleProject,
}: IssueSearchProps) => {
  const t = useTranslations("Issue.IssueSearch");
  const formatter = useFormatter();
  return (
    <LayoutSection
      className="gap-5 rounded-md bg-card p-4 sm:p-8"
      padding="none"
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
                  "w-full justify-start gap-3 pr-4 pl-3.5",
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

export default IssueSearch;
