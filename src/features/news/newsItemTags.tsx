import { Badge } from "@components/ui/badge";
import { Tag } from "lucide-react";

type NewsItemTagsProps = {
  tags: string[];
};

export const NewsItemTags = ({ tags }: NewsItemTagsProps) => {
  return (
    <div className="flex flex-wrap gap-4">
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
export const NewsItemTagsLoader = ({ tagCount = 2 }: { tagCount?: number }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: tagCount }).map((_, index) => {
        return (
          <Badge
            key={index}
            variant="category"
            className="h-8 w-28 animate-pulse rounded-full"
          >
            <Tag className="mr-auto" />
          </Badge>
        );
      })}
    </div>
  );
};
