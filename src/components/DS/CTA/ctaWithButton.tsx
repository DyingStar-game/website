import { Typography } from "@components/DS/typography";
import { Layout, LayoutSection } from "@feat/page/layout";
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
    <LayoutSection className={cn("bg-foreground uppercase", className)}>
      <Layout asChild padding="none">
        <div className="flex max-w-4xl flex-col justify-center gap-10 lg:gap-22">
          <Typography
            variant="h2"
            className="text-center text-4xl font-medium text-primary-foreground md:text-5xl lg:text-6xl"
          >
            {title}
          </Typography>
          <Button variant="invert" size="xl">
            {btContent}
          </Button>
        </div>
      </Layout>
    </LayoutSection>
  );
};
