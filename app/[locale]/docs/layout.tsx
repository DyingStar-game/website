import type { ReactNode } from "react";

import { DocSidebar } from "@app/[locale]/docs/_components/docSidebar";
import { getDocs } from "@app/[locale]/docs/docManager";
import { LayoutMain } from "@feat/page/layout";

export default async function RouteLayout(props: { children: ReactNode }) {
  const docs = await getDocs();

  return (
    <>
      <aside className="sticky top-20 h-fit w-[250px] shrink-0 self-start">
        <DocSidebar docs={docs} currentSlug="" />
      </aside>
      <LayoutMain>{props.children}</LayoutMain>
    </>
  );
}
