import { ThemeToggle } from "@components/DS/theme/theme-toggle";
import { LINKS } from "@feat/navigation/Links";
import { Layout } from "@feat/page/layout";
import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { SiteConfig } from "site-config";

export function HeaderBase({ children }: PropsWithChildren) {
  return (
    <header className="bg-card sticky top-0 z-50 flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
      <Layout className="my-2">
        <div className="flex items-center gap-2">
          <Image
            src={SiteConfig.appIcon}
            alt="app logo"
            width={32}
            height={32}
          />
          <Link
            href={LINKS.Landing.Landing.href()}
            className="text-base font-bold"
          >
            {SiteConfig.title}
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {children}
            <ThemeToggle />
          </nav>
        </div>
      </Layout>
    </header>
  );
}
