"use client";

import { Layout, LayoutContent } from "@feat/page/layout";
import { Button } from "@ui/button";
import Link from "next/link";
import { SiteConfig } from "site-config";

export function Footer() {
  return (
    <footer className="bg-background border-t pb-8">
      <Layout className="my-14">
        <LayoutContent>
          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr]">
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold tracking-tight">
                  {SiteConfig.title}
                </h3>
                <p className="text-muted-foreground max-w-xs text-sm">
                  {SiteConfig.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                <div className="flex flex-col gap-3">
                  <h4 className="font-medium">Product</h4>
                  <nav className="flex flex-col gap-2">
                    <Button
                      asChild
                      variant="link"
                      className="h-auto justify-start p-0"
                    >
                      <Link href="/news">Blog</Link>
                    </Button>
                    <Button
                      asChild
                      variant="link"
                      className="h-auto justify-start p-0"
                    >
                      <Link href="/docs">Documentation</Link>
                    </Button>
                    <Button
                      asChild
                      variant="link"
                      className="h-auto justify-start p-0"
                    >
                      <Link href="/orgs">Dashboard</Link>
                    </Button>
                    <Button
                      asChild
                      variant="link"
                      className="h-auto justify-start p-0"
                    >
                      <Link href="/account">Account</Link>
                    </Button>
                  </nav>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="font-medium">Company</h4>
                  <nav className="flex flex-col gap-2">
                    <Button
                      asChild
                      variant="link"
                      className="h-auto justify-start p-0"
                    >
                      <Link href="/about">About</Link>
                    </Button>
                    <Button
                      asChild
                      variant="link"
                      className="h-auto justify-start p-0"
                    >
                      <Link href="/contact">Contact</Link>
                    </Button>
                  </nav>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="font-medium">Legal</h4>
                  <nav className="flex flex-col gap-2">
                    <Button
                      asChild
                      variant="link"
                      className="h-auto justify-start p-0"
                    >
                      <Link href="/legal/terms">Terms</Link>
                    </Button>
                    <Button
                      asChild
                      variant="link"
                      className="h-auto justify-start p-0"
                    >
                      <Link href="/legal/privacy">Privacy</Link>
                    </Button>
                  </nav>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground text-sm">
                  Address not available
                </p>
                <p className="text-muted-foreground text-sm">
                  © {new Date().getFullYear()} Dying Star. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </LayoutContent>
      </Layout>
    </footer>
  );
}
