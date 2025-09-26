import { Typography } from "@components/DS/typography";
import { cn } from "@lib/utils";
import { Button } from "@ui/button";

export type CtaWithButtonProps = React.ComponentProps<"section"> & {
  title: string;
  btContent: string;
};

export const CtaWithButton = ({
  title,
  btContent,
  className,
}: CtaWithButtonProps) => {
  return (
    <section
      className={cn(
        "flex flex-col items-center bg-foreground uppercase",
        className,
      )}
    >
      <div className="flex max-w-4xl flex-col justify-center gap-10 lg:gap-22">
        <Typography
          variant="h2"
          className="text-center text-5xl font-medium text-primary-foreground lg:text-6xl"
        >
          {title}
        </Typography>
        <Button variant="invert" size="xl">
          {btContent}
        </Button>
      </div>
    </section>
  );
};
