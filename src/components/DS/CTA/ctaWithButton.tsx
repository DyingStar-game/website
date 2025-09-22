import { Typography } from "@components/DS/typography";
import { SectionLayout } from "@feat/landing/section-layout";
import { Button } from "@ui/button";

export type CtaWithButtonProps = {
  title: string;
  btContent: string;
  size?: "xs" | "sm" | "base" | "lg" | "full";
};

export const CtaWithButton = (props: CtaWithButtonProps) => {
  return (
    <SectionLayout
      variant="primary"
      className="flex flex-col items-center justify-center gap-10 uppercase"
      size={props.size ?? "sm"}
    >
      <Typography
        variant="h2"
        className="text-primary-foreground line-clamp-3 text-center text-4xl uppercase"
      >
        {props.title}
      </Typography>
      <Button variant="invert" size="xl" className="w-full">
        {props.btContent}
      </Button>
    </SectionLayout>
  );
};

