"use client";

import { type PropsWithChildren, useState } from "react";

import { LocaleSwitcher } from "@feat/i18n/LocaleSwitcher";
import { cn } from "@lib/utils";
import type { buttonVariants } from "@ui/button";
import { Button } from "@ui/button";
import type { VariantProps } from "class-variance-authority";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { Menu } from "lucide-react";

export function HeaderBase({ children }: PropsWithChildren) {
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

  return (
    <>
      <motion.header
        style={{ height, backgroundColor: bg }}
        className={cn(
          "xl-gap-8 fixed inset-x-0 top-0 z-50 flex items-start justify-center gap-4 overflow-hidden p-4 shadow-md lg:items-center lg:p-7",
          "min-h-[72px] border-b border-input",
          isOpen
            ? "h-auto! max-h-screen bg-background!"
            : "max-h-18! lg:max-h-35!",
        )}
      >
        <div className="visible flex size-10 flex-1 items-center lg:invisible">
          <Menu
            className="hover:cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        <nav className="flex flex-1 flex-col justify-start gap-4 uppercase lg:flex-row lg:items-center lg:justify-center xl:gap-8">
          {children}
        </nav>
        <div className="flex flex-1 justify-end gap-4">
          <LocaleSwitcher className="hidden lg:inline" />
          <Button
            variant="ghost"
            size={size}
            onClick={() => alert("Todo wait for auth tasks")}
            className="hidden lg:inline"
          >
            Auth
          </Button>
        </div>
      </motion.header>
      {/* Tips for smoother animated header: useTransform + useMotionTemplate */}
      <div className="h-[72px] lg:h-[140px]" />
    </>
  );
}
