import type { ReactNode } from "react";

import { LayoutMain } from "@feat/page/layout";

import { DocSidebar } from "./_components/doc-sidebar";
import { getDocs } from "./doc-manager";

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
