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
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SiteConfig } from "siteConfig";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("Layout.Metadata");

  return {
    title: SiteConfig.title,
    description: t("description"),
    metadataBase: new URL(getServerUrl()),
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
      googleBot: "index, follow",
    },
    applicationName: SiteConfig.title,
    // alternates: {
    //   types: {
    //     "application/rss+xml": "https://dminhvu.com/rss.xml"
    //   }
    // },
    alternates: {
      canonical: SiteConfig.prodUrl,
    },
    appleWebApp: {
      title: SiteConfig.title,
      statusBarStyle: "default",
      capable: true,
    },
    twitter: {
      creator: "@dyingstargame",
      site: SiteConfig.prodUrl,
    },
    // verification: {
    //   google: "YOUR_DATA",
    //   yandex: ["YOUR_DATA"],
    //   other: {
    //     "msvalidate.01": ["YOUR_DATA"],
    //     "facebook-domain-verification": ["YOUR_DATA"]
    //   }
    // }
  };
};

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
  );
}
