"use client";

import { type ReactNode, useEffect, useState } from "react";

import IconSwitch from "@components/DS/iconAnimate/iconSwitch";
import { LogoNameSvg } from "@components/svg/logoNameSvg";
import { LocaleSwitcher } from "@feat/i18n/LocaleSwitcher";
import { LINKS } from "@feat/navigation/Links";
import { Link, usePathname } from "@i18n/navigation";
import { cn } from "@lib/utils";
import type { buttonVariants } from "@ui/button";
import type { VariantProps } from "class-variance-authority";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { SiteConfig } from "siteConfig";

type HeaderBaseProps = {
  start: ReactNode;
  end: ReactNode;
};

export const HeaderBase = ({ start, end }: HeaderBaseProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] =
    useState<VariantProps<typeof buttonVariants>["size"]>("lg");
  const { scrollY } = useScroll();
  const height = useTransform(scrollY, [0, 100], ["140px", "92px"]);
  const opacity = useTransform(scrollY, [0, 10], [0, 1]);
  const bg = useMotionTemplate`rgba(21, 20, 19, ${opacity})`; // match with background class

  useMotionValueEvent(scrollY, "change", (latest) => {
    setSize(latest < 100 ? "lg" : "default");
  });

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        id="fixed-header"
        style={{ height, backgroundColor: bg }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] content-start items-start gap-4 overflow-hidden p-4 shadow-md xl:content-center xl:items-center xl:p-7 2xl:gap-8",
          "min-h-[72px] border-b border-input",
          isOpen
            ? "h-auto! max-h-screen bg-background!"
            : "max-h-18! xl:max-h-35!",
        )}
      >
        <div className="relative col-start-1 row-start-1 flex size-10 items-center xl:hidden">
          <IconSwitch
            icon="menu"
            switchIcon="x"
            onClick={() => setIsOpen(!isOpen)}
            isSwitch={isOpen}
          />
        </div>

        <div className="col-start-2 row-start-1 flex items-center self-center">
          <Link
            href={LINKS.Landing.Landing.href()}
            className="transition-all hover:scale-95"
            aria-label={SiteConfig.title}
          >
            <LogoNameSvg className="h-10 w-auto xl:h-12" />
          </Link>
        </div>

        <nav className="col-span-3 col-start-1 row-start-2 flex flex-col gap-4 uppercase xl:col-span-1 xl:col-start-1 xl:row-start-1 xl:flex-row xl:items-center xl:justify-end xl:gap-3 2xl:gap-8">
          {start}
        </nav>

        <div className="col-span-3 col-start-1 row-start-3 flex flex-col gap-4 xl:col-span-1 xl:col-start-3 xl:row-start-1 xl:flex-row xl:items-center xl:gap-3 2xl:gap-8">
          <nav className="flex flex-col gap-4 uppercase xl:flex-row xl:items-center xl:gap-3 2xl:gap-8">
            {end}
          </nav>
          <LocaleSwitcher size={size} className="xl:ml-auto" />
          {/* <Button
            variant="ghost"
            size={size}
            onClick={() => alert("Todo wait for auth tasks")}
          >
            Auth
          </Button> */}
        </div>
      </motion.header>
      {/* Tips for smoother animated header: useTransform + useMotionTemplate */}
      <div className="h-[72px] xl:h-[140px]" />
    </>
  );
};
