import { Footer } from "@components/DS/layout/footer";
import { Header } from "@components/DS/layout/header";
import { Layout, LayoutContent } from "@feat/page/layout";
import type { ReactNode } from "react";
import { DocSidebar } from "./_components/doc-sidebar";
import { getDocs } from "./doc-manager";

export default async function RouteLayout(props: { children: ReactNode }) {
  const docs = await getDocs();

  return (
    <div className="bg-card flex min-h-full flex-col">
      <Header />
      <div className="relative min-h-full flex-1 pt-8 pb-16 lg:pt-12">
        <Layout className="relative" size="xl">
          <LayoutContent className="flex flex-col gap-10 py-8 lg:flex-row">
            <aside className="sticky top-20 h-fit w-[250px] shrink-0 self-start">
              <DocSidebar docs={docs} currentSlug="" />
            </aside>
            <main className="flex-1" style={{ maxWidth: "calc(100% - 250px)" }}>
              {props.children}
            </main>
          </LayoutContent>
        </Layout>
      </div>
      <Footer />
    </div>
  );
}
