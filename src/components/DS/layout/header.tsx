//TODO: Remove use client when auth is implemented
"use client";

import { LogoNameSvg } from "@components/svg/logoNameSvg";
import { LINKS } from "@feat/navigation/Links";
import { Button, buttonVariants } from "@ui/button";
import Link from "next/link";
import { HeaderBase } from "./header-base";
import { getTranslations } from "next-intl/server";
import { cn } from "@lib/utils";
// TODO : Modify when merge feat/news
// import { usePathname } from "next/navigation";

export async function Header() {
  const t = await getTranslations();
  // const pathname = usePathname();
  return (
    <HeaderBase>
      <Link
        href={LINKS.Project.Tickets.href()}
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          // pathname.startsWith(LINKS.Project.Tickets.href()) && "active",
        )}
      >
        {t("project")}
      </Link>
      <Link
        href={LINKS.Lore.History.href()}
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          // pathname.startsWith(LINKS.Lore.History.href()) && "active",
        )}
      >
        {t("lore")}
      </Link>
      <Link
        href={LINKS.Landing.Landing.href()}
        className="order-first lg:order-none"
      >
        <LogoNameSvg className="h-10 w-auto lg:h-12" />
      </Link>
      <Link
        href={LINKS.Community.Forums.href()}
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          // pathname.startsWith(LINKS.Community.Forums.href()) && "active",
        )}
      >
        {t("forum")}
      </Link>
      <Link
        href={LINKS.Project.Launcher.href()}
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          // pathname.startsWith(LINKS.Project.Launcher.href()) && "active",
        )}
      >
        {t("playNow")}
      </Link>
      <Button
        variant="ghost"
        size="lg"
        onClick={() => alert("Todo wait for auth tasks")}
        className="lg:hidden"
      >
        Auth
      </Button>
    </HeaderBase>
  );
}
