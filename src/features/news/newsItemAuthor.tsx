import { Avatar, AvatarFallback } from "@components/ui/avatar";
import { cn } from "@lib/utils";
import { Minus } from "lucide-react";
import { useFormatter } from "next-intl";

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

export const NewsItemAuthorLoader = () => {
  return (
    <div className="flex animate-pulse items-center gap-3 font-light text-foreground uppercase">
      <Avatar>
        <AvatarFallback>LO</AvatarFallback>
      </Avatar>
      Lorem Ipsum
      <Minus className="rotate-90 text-input" />
      01/01/1970
    </div>
  );
};
