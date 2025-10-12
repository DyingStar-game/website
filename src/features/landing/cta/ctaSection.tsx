import { Typography } from "@components/DS/typography";
import { buttonVariants } from "@components/ui/button";
import { SectionLayout } from "@feat/landing/sectionLayout";
import Link from "next/link";

export const CtaSection = () => {
  return (
    <SectionLayout className="lg:flex lg:items-center lg:justify-between lg:px-8">
      <Typography variant="h3">
        <Typography variant="h2" as="span">
          Ready to start posting ?
        </Typography>
        <br />
        <span className="text-muted-foreground">It's time to start.</span>
      </Typography>
      <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:shrink-0">
        <Link className={buttonVariants({ size: "lg" })} href="#pricing">
          Get started
        </Link>
      </div>
    </SectionLayout>
  );
};
