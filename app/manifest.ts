import { DEFAULT_LOCALE } from "@i18n/config";
import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { SiteConfig } from "siteConfig";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value ?? DEFAULT_LOCALE;

  const t = await getTranslations({ locale, namespace: "Manifest" });

  return {
    id: "/",
    name: t("name"),
    short_name: t("shortName"),
    description: t("description"),
    start_url: locale === DEFAULT_LOCALE ? "/" : `/${locale}`,
    orientation: "portrait",
    display_override: ["fullscreen", "minimal-ui"],
    display: "standalone",
    lang: locale,
    background_color: "#151413",
    theme_color: "#ffba08",
    screenshots: [
      {
        src: SiteConfig.metaImage,
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: SiteConfig.metaImageAlt,
      },
    ],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icons/icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
