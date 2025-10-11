"use client";

import { Typography } from "@components/DS/typography";
import { buttonVariants } from "@components/ui/button";
import type { NavigationLink } from "@feat/navigation/navigation.model";
import { DEFAULT_LOCALE } from "@i18n/config";
import { Link } from "@i18n/navigation";
import { cn } from "@lib/utils";
import type { VariantProps } from "class-variance-authority";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  link: NavigationLink;
  size: VariantProps<typeof buttonVariants>["size"];
};

const NavLink = ({ link, size }: NavLinkProps) => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  const getNavLinkClasses = (href: string) => {
    const expectedPath = locale === DEFAULT_LOCALE ? href : `/${locale}${href}`;
    const isActive = pathname.startsWith(expectedPath);

    return cn(buttonVariants({ variant: "ghost", size }), isActive && "active");
  };

  return (
    <>
      {!link.disabled ? (
        <Link href={link.href()} className={getNavLinkClasses(link.href())}>
          {t(link.label)}
        </Link>
      ) : (
        <Typography
          variant="default"
          aria-disabled
          className={getNavLinkClasses(link.href())}
        >
          {t(link.label)}
        </Typography>
      )}
    </>
  );
};

export default NavLink;
