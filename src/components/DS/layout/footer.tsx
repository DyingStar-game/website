"use client";

import { LogoNameSvg } from "@components/svg/logoNameSvg";
import { LINKS } from "@feat/navigation/Links";
import { Layout, LayoutContent } from "@feat/page/layout";
import { motion } from "framer-motion";
import Link from "next/link";
import { SiteConfig } from "site-config";
import { Typography } from "../typography";
import { getFooterLinks } from "./footer.link";

export const Footer = () => {
  return (
    <footer className="pb-8">
      <Layout size="lg">
        <LayoutContent>
          <div className="flex flex-col gap-4">
            <Link href={LINKS.Landing.Landing.href()} className="self-center">
              <LogoNameSvg className="h-12 w-auto" />
            </Link>
            <div className="flex flex-col justify-around gap-4 md:flex-row">
              {getFooterLinks().map((group) => (
                <div key={group.title} className="flex flex-col gap-4">
                  <Typography variant="h2" className="self-center md:self-auto">
                    {group.title}
                  </Typography>
                  <nav className="flex flex-col gap-2">
                    {group.links.map((link) =>
                      !link.disabled ? (
                        <Link key={link.href} href={link.href}>
                          <Typography variant="large" className="text-primary">
                            {link.label}
                          </Typography>
                        </Link>
                      ) : (
                        <Typography
                          key={link.href}
                          variant="large"
                          className="text-muted cursor-not-allowed"
                        >
                          {link.label} (Soon)
                        </Typography>
                      ),
                    )}
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
                <Link href={LINKS.RickRoll.href()} className="cursor-text">
                  ©
                </Link>{" "}
                {new Date().getFullYear()} {SiteConfig.title}. All rights
                reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>Version 0.1.0</span>
                <span>•</span>
                <span>Serveurs: Unknown</span>
                <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500"></div>
              </div>
            </motion.div>
          </div>
        </LayoutContent>
      </Layout>
    </footer>
  );
};

