import { FloatingLegalFooter } from "@components/DS/legal/floating-legal-footer";
import { TailwindIndicator } from "@components/utils/tailwind-indicator";
import { NextTopLoader } from "@feat/page/next-top-loader";
import { ServerToaster } from "@feat/server-sonner/server-toaster";
import { getServerUrl } from "@lib/server-url";
import { cn } from "@lib/utils";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { SiteConfig } from "site-config";
import "./globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "i18n/routing";
import { Providers } from "./providers";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@components/DS/layout/header";
import { Footer } from "@components/DS/layout/footer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: SiteConfig.title,
  description: SiteConfig.description,
  metadataBase: new URL(getServerUrl()),
};

const PoppinsFont = Poppins({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params,
  modal,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={cn(
        PoppinsFont.className,
        "from-background-1 via-background-2 to-background-3 text-foreground h-full bg-linear-120 bg-fixed",
      )}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen antialiased",
          // "before:top-40 before:w-2/3 before:min-w-[1800px] before:bg-[url('/images/bg-circles.svg')]",
          // "before:pointer-events-none before:fixed before:bottom-0 before:left-1/2 before:z-0 before:-translate-x-1/2 before:bg-cover before:bg-top before:bg-no-repeat before:opacity-30 before:content-['']",
        )}
      >
        <NextIntlClientProvider>
          <NuqsAdapter>
            <Providers>
              <NextTopLoader
                delay={100}
                showSpinner={false}
                color="hsl(var(--primary))"
              />
              {/* <div className="relative z-10"> */}
              <Header />
              {children}
              <Footer />
              {modal}
              <TailwindIndicator />
              <FloatingLegalFooter />
              <Suspense>
                <ServerToaster />
              </Suspense>
              {/* </div> */}
            </Providers>
          </NuqsAdapter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
