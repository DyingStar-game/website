"use client";

import { Typography } from "@components/DS/typography";
import { Button, buttonVariants } from "@components/ui/button";
import type { NavigationLink } from "@feat/navigation/navigation.model";
import { DEFAULT_LOCALE } from "@i18n/config";
import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";
import type { VariantProps } from "class-variance-authority";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  link: NavigationLink;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size: VariantProps<typeof buttonVariants>["size"];
  indicator?: boolean | string;
};

const NavLink = ({
  link,
  variant = "ghost",
  size,
  indicator,
}: NavLinkProps) => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  const isActive = (href: string) => {
    const expectedPath = locale === DEFAULT_LOCALE ? href : `/${locale}${href}`;
    return pathname.startsWith(expectedPath);
  };

  return (
    <>
      {!link.disabled ? (
        <Button
          asChild
          variant={variant}
          size={size}
          indicator={indicator}
          className={cn(isActive(link.href()) && "active")}
        >
          <Link href={link.href()}>{t(link.label)}</Link>
        </Button>
      ) : (
        <Typography
          variant="default"
          aria-disabled
          className={cn(
            buttonVariants({ variant, size }),
            isActive(link.href()) && "active",
          )}
        >
          {t(link.label)}
        </Typography>
      )}
    </>
  );
};

export default NavLink;
