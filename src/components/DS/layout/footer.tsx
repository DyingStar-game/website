"use client";

import { getFooterLinks } from "@components/DS/layout/footer.link";
import { Typography } from "@components/DS/typography";
import { LogoNameSvg } from "@components/svg/logoNameSvg";
import { LINKS } from "@feat/navigation/Links";
import { Layout } from "@feat/page/layout";
import { Link } from "@i18n/navigation";
import { env } from "@lib/env/client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SiteConfig } from "siteConfig";

export const Footer = () => {
  const t = useTranslations();
  return (
    <Layout asChild padding="none" className="gap-5 pb-8">
      <footer>
        <Link href={LINKS.Landing.Landing.href()} className="self-center">
          <LogoNameSvg className="h-10 w-auto" />
        </Link>
        <div className="flex flex-col justify-around gap-8 md:flex-row">
          {getFooterLinks().map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <Typography variant="h4" className="self-center md:self-auto">
                {t(group.title)}
              </Typography>
              <nav className="flex flex-col gap-2">
                {group.links.map((link) =>
                  !link.disabled ? (
                    <Link key={link.href} href={link.href}>
                      <Typography
                        variant="default"
                        className="text-foreground/40"
                      >
                        {t(link.label)}
                      </Typography>
                    </Link>
                  ) : (
                    <Typography
                      key={link.href}
                      variant="default"
                      className="text-muted cursor-not-allowed"
                    >
                      {t(link.label)} (Soon)
                    </Typography>
                  ),
                )}
              </nav>
            </div>
          ))}
        </div>

        <motion.div
          className="border-input text-input mt-12 flex flex-col items-center justify-between border-t pt-8 md:flex-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 text-sm text-gray-400 md:mb-0">
            © {new Date().getFullYear()} {SiteConfig.title}. All rights
            reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>Version {env.NEXT_PUBLIC_APP_VERSION}</span>
            {/* <span>•</span>
            <span>Serveurs: Unknown</span> */}
            <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500"></div>
          </div>
        </motion.div>
      </footer>
    </Layout>
  );
};
