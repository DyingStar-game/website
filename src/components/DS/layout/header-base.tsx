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
          "fixed inset-x-0 top-0 z-50 flex items-start justify-center gap-4 overflow-hidden p-4 shadow-md xl:items-center xl:p-7 2xl:gap-8",
          "min-h-[72px] border-b border-input",
          isOpen
            ? "h-auto! max-h-screen bg-background!"
            : "max-h-18! xl:max-h-35!",
        )}
      >
        <div className="visible flex size-10 flex-1 items-center xl:invisible">
          <Menu
            className="hover:cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        <nav className="flex flex-1 flex-col justify-start gap-4 uppercase xl:flex-row xl:items-center xl:justify-center xl:gap-3 2xl:gap-8">
          {children}
        </nav>
        <div className="flex flex-1 justify-end gap-4">
          <LocaleSwitcher className="hidden xl:inline" size={size} />
          <Button
            variant="ghost"
            size={size}
            onClick={() => alert("Todo wait for auth tasks")}
            className="hidden xl:inline"
          >
            Auth
          </Button>
        </div>
      </motion.header>
      {/* Tips for smoother animated header: useTransform + useMotionTemplate */}
      <div className="h-[72px] xl:h-[140px]" />
    </>
  );
}
