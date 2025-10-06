"use client";

import { useState } from "react";

import { LogoNameSvg } from "@components/svg/logoNameSvg";
import { LocaleSwitcher } from "@feat/i18n/LocaleSwitcher";
import { LINKS } from "@feat/navigation/Links";
import { DEFAULT_LOCALE } from "@i18n/config";
import { cn } from "@lib/utils";
import { Button, buttonVariants } from "@ui/button";
import type { VariantProps } from "class-variance-authority";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { HeaderBase } from "./header-base";

export function Header() {
  const pathname = usePathname();
  const locale = useLocale();
  const [size, setSize] =
    useState<VariantProps<typeof buttonVariants>["size"]>("lg");

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setSize(latest < 100 ? "lg" : "default");
  });

  const getNavLinkClasses = (href: string) => {
    const expectedPath = locale === DEFAULT_LOCALE ? href : `/${locale}${href}`;
    const isActive = pathname.startsWith(expectedPath);

    return cn(buttonVariants({ variant: "ghost", size }), isActive && "active");
  };

  return (
    <HeaderBase>
      <Link
        href={LINKS.Project.Contribute.href()}
        className={getNavLinkClasses(LINKS.Project.Contribute.href())}
      >
        Project
      </Link>
      <Link
        href={LINKS.Lore.History.href()}
        className={getNavLinkClasses(LINKS.Lore.History.href())}
      >
        Lore
      </Link>
      <Link
        href={LINKS.Landing.Landing.href()}
        className="order-first self-center transition-all hover:scale-95 lg:order-none"
      >
        <LogoNameSvg className="h-10 w-auto xl:h-12" />
      </Link>
      <Link
        href={LINKS.Community.Forums.href()}
        className={getNavLinkClasses(LINKS.Community.Forums.href())}
      >
        Forum
      </Link>
      <Link
        href={LINKS.Project.Launcher.href()}
        className={getNavLinkClasses(LINKS.Project.Launcher.href())}
      >
        Play Now
      </Link>
      <Button
        variant="ghost"
        size={size}
        onClick={() => alert("Todo wait for auth tasks")}
        className="lg:hidden"
      >
        Auth
      </Button>
      <LocaleSwitcher className="lg:hidden" />
    </HeaderBase>
  );
}
