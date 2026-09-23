"use client";

import { useState } from "react";

import { HeaderBase } from "@components/DS/layout/headerBase";
import NavLink from "@components/DS/layout/navLink";
import { LINKS } from "@feat/navigation/Links";
import type { buttonVariants } from "@ui/button";
import type { VariantProps } from "class-variance-authority";
import { useMotionValueEvent, useScroll } from "motion/react";

export const Header = () => {
  const [size, setSize] =
    useState<VariantProps<typeof buttonVariants>["size"]>("lg");

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setSize(latest < 100 ? "lg" : "default");
  });

  return (
    <HeaderBase
      start={
        <>
          <NavLink link={LINKS.Project.Project} size={size} />
          <NavLink link={LINKS.Lore.History} size={size} />
        </>
      }
      end={
        <>
          <NavLink link={LINKS.Project.Contribute} size={size} />
          <NavLink link={LINKS.News.All} size={size} />
          <NavLink link={LINKS.Project.Play} size={size} variant="outline" />
        </>
      }
    />
  );
};
