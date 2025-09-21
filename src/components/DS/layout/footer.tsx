"use client";
import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SiteConfig } from "site-config";

import { LogoNameSvg } from "@components/svg/logoNameSvg";
import { FOOTER_LINKS, LINKS } from "@feat/navigation/Links";
import { Layout, LayoutContent } from "@feat/page/layout";
import LocaleSwitcher from "@feat/i18n/locale-switcher";
import type { NavigationLink } from "@feat/navigation/navigation.type";
import { Typography } from "../typography";

export const FooterLink = ({ link }: { link: NavigationLink }) => {
  const t = useTranslations();
  const href = useMemo(() => link.href(), [link]);
  const label = useMemo(() => t(link.label), [link, t]);

  return link.disabled ? (
    <Typography variant="large" className="text-muted cursor-not-allowed">
      {label} ({t("soon")})
    </Typography>
  ) : (
    <Link href={href}>
      <Typography variant="large" className="text-primary">
        {label}
      </Typography>
    </Link>
  );
};

export const Footer = () => {
  const t = useTranslations();
  return (
    <footer className="w-screen pb-8">
      <Layout size="lg">
        <LayoutContent>
          <div className="flex flex-col gap-4">
            <Link
              href={LINKS.Landing.Landing.href()}
              className="mx-auto scale-90"
            >
              <LogoNameSvg className="h-20 w-auto" />
            </Link>
            <div className="flex justify-around">
              {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                <div key={title} className="flex flex-col gap-4">
                  <Typography variant="h2">{t(title)}</Typography>
                  <nav className="flex flex-col gap-2">
                    {links.map((link: NavigationLink) => (
                      <FooterLink key={link.href()} link={link} />
                    ))}
                  </nav>
                </div>
              ))}
            </div>

            <motion.div
              className="mt-12 flex flex-col items-center justify-between border-t border-white/10 pt-8 md:flex-row"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <p className="mb-4 text-sm text-gray-400 md:mb-0">
                {t.rich("copyright", {
                  link: (children) => (
                    <Link href={LINKS.RickRoll.href()} className="cursor-text">
                      {children}
                    </Link>
                  ),
                  year: new Date().getFullYear(),
                  title: SiteConfig.title,
                })}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <LocaleSwitcher />
                <span>{t("version", { version: "0.1.0" })}</span>
                <span>•</span>
                <span>
                  {t("server", { count: 1 })}: {t("unknown")}
                </span>
                <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500"></div>
              </div>
            </motion.div>
          </div>
        </LayoutContent>
      </Layout>
    </footer>
  );
};
