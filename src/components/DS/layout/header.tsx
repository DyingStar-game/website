"use client";

import { LogoNameSvg } from "@components/svg/logoNameSvg";
import LocaleSwitcher from "@feat/i18n/LocaleSwitcher";
import { LINKS } from "@feat/navigation/Links";
import { cn } from "@lib/utils";
import { Button, buttonVariants } from "@ui/button";
import { Link } from "i18n/navigation";
import { usePathname } from "next/navigation";

import { HeaderBase } from "./header-base";

export function Header() {
  const pathname = usePathname();

  return (
    <HeaderBase>
      <Link
        href={LINKS.Project.Tickets.href()}
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          pathname.startsWith(LINKS.Project.Tickets.href()) && "active",
        )}
      >
        Project
      </Link>
      <Link
        href={LINKS.Lore.History.href()}
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          pathname.startsWith(LINKS.Lore.History.href()) && "active",
        )}
      >
        Lore
      </Link>
      <Link
        href={LINKS.Landing.Landing.href()}
        className="order-first transition-all hover:scale-95 lg:order-none"
      >
        <LogoNameSvg className="h-10 w-auto lg:h-12" />
      </Link>
      <Link
        href={LINKS.Community.Forums.href()}
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          pathname.startsWith(LINKS.Community.Forums.href()) && "active",
        )}
      >
        Forum
      </Link>
      <Link
        href={LINKS.Project.Launcher.href()}
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          pathname.startsWith(LINKS.Project.Launcher.href()) && "active",
        )}
      >
        Play Now
      </Link>
      <Button
        variant="ghost"
        size="lg"
        onClick={() => alert("Todo wait for auth tasks")}
        className="lg:hidden"
      >
        Auth
      </Button>
      <LocaleSwitcher className="lg:hidden" />
    </HeaderBase>
  );
}
