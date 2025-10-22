"use client";

import { useState } from "react";

import { HeaderBase } from "@components/DS/layout/headerBase";
import NavLink from "@components/DS/layout/navLink";
import { LogoNameSvg } from "@components/svg/logoNameSvg";
import { LocaleSwitcher } from "@feat/i18n/LocaleSwitcher";
import { LINKS } from "@feat/navigation/Links";
import { Link } from "@i18n/navigation";
import type { buttonVariants } from "@ui/button";
import type { VariantProps } from "class-variance-authority";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { SiteConfig } from "siteConfig";

export const Header = () => {
  const [size, setSize] =
    useState<VariantProps<typeof buttonVariants>["size"]>("lg");

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setSize(latest < 100 ? "lg" : "default");
  });

  return (
    <HeaderBase>
      <NavLink link={LINKS.Project.Project} size={size} />
      <NavLink link={LINKS.Lore.History} size={size} />
      <Link
        href={LINKS.Landing.Landing.href()}
        className="order-first self-center transition-all hover:scale-95 xl:order-none"
        aria-label={SiteConfig.title}
      >
        <LogoNameSvg className="h-10 w-auto xl:h-12" />
      </Link>
      <NavLink link={LINKS.Project.Contribute} size={size} />
      <NavLink link={LINKS.News.All} size={size} />
      {/* <Button
        variant="ghost"
        size={size}
        onClick={() => alert("Todo wait for auth tasks")}
        className="xl:hidden"
      >
        Auth
      </Button> */}

      <LocaleSwitcher className="xl:hidden" size={size} />
    </HeaderBase>
  );
};
