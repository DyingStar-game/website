import type { ComponentProps } from "react";

import { Layout, LayoutSection } from "@feat/page/layout";

import { Typography } from "../typography";

type HeroProps = ComponentProps<"section"> & {
  title: string;
  description?: string;
};

const Hero = ({ title, description, ...props }: HeroProps) => {
  return (
    <LayoutSection size={"container"} {...props}>
      <Layout asChild padding="none">
        <div className="flex max-w-4xl flex-col justify-center pt-15 text-center md:pt-20 lg:pt-22">
          <Typography variant="h1">{title}</Typography>
          {description && <Typography variant="p">{description}</Typography>}
        </div>
      </Layout>
    </LayoutSection>
  );
};

export default Hero;
