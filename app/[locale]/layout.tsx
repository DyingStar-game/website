import { Suspense } from "react";

import { Providers } from "@app/[locale]/providers";
import { Footer } from "@components/DS/layout/footer";
import { Header } from "@components/DS/layout/header";
import { FloatingLegalFooter } from "@components/DS/legal/floatingLegalFooter";
import { TailwindIndicator } from "@components/utils/tailwindIndicator";
import { NextTopLoader } from "@feat/page/nextTopLoader";
import { ServerToaster } from "@feat/serverSonner/serverToaster";
import { routing } from "@i18n/routing";
import { getServerUrl } from "@lib/serverUrl";
import { cn } from "@lib/utils";
import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SiteConfig } from "siteConfig";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("Layout.Metadata");
  const locale = (await getLocale()) as Locale;

  return {
    title: SiteConfig.title,
    description: t("description"),
    metadataBase: new URL(getServerUrl(locale)),
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
      googleBot: "index, follow",
    },
    applicationName: SiteConfig.title,
    appleWebApp: {
      title: SiteConfig.title,
      statusBarStyle: "default",
      capable: true,
    },
    twitter: {
      creator: "@dyingstargame",
      site: SiteConfig.prodUrl,
    },
  };
};

const PoppinsFont = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
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
        "h-full bg-linear-120 from-background-1 via-background-2 to-background-3 bg-fixed text-foreground",
      )}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen antialiased",
          // "before:top-40 before:w-2/3 before:min-w-[1800px] before:bg-[url('/assets/images/bg-circles.svg')]",
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
              <Header />
              {children}
              <Footer />
              {modal}
              <TailwindIndicator />
              <FloatingLegalFooter />
              <Suspense>
                <ServerToaster />
              </Suspense>
            </Providers>
          </NuqsAdapter>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
