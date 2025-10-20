import type { ComponentProps } from "react";

import { Typography } from "@components/DS/typography";
import { Layout, LayoutSection } from "@feat/page/layout";

type HeroProps = ComponentProps<"section"> & {
  title: string;
  description?: string;
};

const Hero = ({ title, description, ...props }: HeroProps) => {
  return (
    <LayoutSection size={"container"} {...props}>
      <Layout asChild padding="none">
        <div className="pt-15 lg:pt-22 flex max-w-4xl flex-col justify-center text-center md:pt-20">
          <Typography variant="h1">{title}</Typography>
          {description && <Typography variant="p">{description}</Typography>}
        </div>
      </Layout>
    </LayoutSection>
  );
};

export default Hero;
