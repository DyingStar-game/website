//TODO: Remove use client when auth is implemented
"use client";

import { LogoNameSvg } from "@components/svg/logoNameSvg";
import { LINKS } from "@feat/navigation/Links";
import { Button, buttonVariants } from "@ui/button";
import Link from "next/link";
import { HeaderBase } from "./header-base";

export function Header() {
  return (
    <HeaderBase>
      <Link
        href={LINKS.Project.Tickets.href()}
        className={buttonVariants({ variant: "ghost", size: "lg" })}
      >
        Project
      </Link>
      <Link
        href={LINKS.Lore.History.href()}
        className={buttonVariants({ variant: "ghost", size: "lg" })}
      >
        Lore
      </Link>
      <Link
        href={LINKS.Landing.Landing.href()}
        className="order-first md:order-none"
      >
        <LogoNameSvg className="h-10 w-auto" />
      </Link>
      <Link
        href={LINKS.Community.Forums.href()}
        className={buttonVariants({ variant: "ghost", size: "lg" })}
      >
        Forum
      </Link>
      <Link
        href={LINKS.Project.Launcher.href()}
        className={buttonVariants({ variant: "ghost", size: "lg" })}
      >
        Play Now
      </Link>
      <Button
        variant="ghost"
        size="lg"
        onClick={() => alert("Todo wait for auth tasks")}
        className="md:hidden"
      >
        Auth
      </Button>
    </HeaderBase>
  );
}

