import { FloatingLegalFooter } from "@components/DS/legal/floating-legal-footer";
import { TailwindIndicator } from "@components/utils/tailwind-indicator";
import { NextTopLoader } from "@feat/page/next-top-loader";
import { ServerToaster } from "@feat/server-sonner/server-toaster";
import { getServerUrl } from "@lib/server-url";
import { cn } from "@lib/utils";
import type { Metadata } from "next";
import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { SiteConfig } from "site-config";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: SiteConfig.title,
  description: SiteConfig.description,
  metadataBase: new URL(getServerUrl()),
};

const CaptionFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-caption",
});

const GeistSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const GeistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "h-full overflow-x-hidden bg-[url('/images/Background.png')] bg-cover bg-scroll bg-top bg-no-repeat font-sans antialiased",
          GeistMono.variable,
          GeistSans.variable,
          CaptionFont.variable,
        )}
      >
        <NuqsAdapter>
          <Providers>
            <NextTopLoader
              delay={100}
              showSpinner={false}
              color="hsl(var(--primary))"
            />
            {children}
            {modal}
            <TailwindIndicator />
            <FloatingLegalFooter />
            <Suspense>
              <ServerToaster />
            </Suspense>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
