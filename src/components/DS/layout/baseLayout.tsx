import type { PropsWithChildren } from "react";

import { Footer } from "@components/DS/layout/footer";
import { Header } from "@components/DS/layout/header";

export const BaseLayout = (props: PropsWithChildren) => {
  return (
    <div className="relative flex min-h-full flex-col">
      <Header />
      <div className="min-h-full flex-1">{props.children}</div>
      <Footer />
    </div>
  );
};
