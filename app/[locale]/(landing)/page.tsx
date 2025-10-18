import { NewsSection } from "@app/[locale]/(landing)/_components/newsSection";
import { CtaWithButton } from "@components/DS/CTA/ctaWithButton";
import { LogoDiscordSvg } from "@components/svg/logoDiscord";
import { LINKS } from "@feat/navigation/Links";
import { LayoutMain } from "@feat/page/layout";
import type { Locale } from "@i18n/config";
// This is necessary because NEXT_PUBLIC_DISCORD_INVITE_ID is a variable that can be used in both the front and back ends.
import { env } from "@lib/env/client";
import { combineWithParentMetadata } from "@lib/metadata";
import { getMetadataSource } from "@lib/utils";
import type { ResolvingMetadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { SiteConfig } from "siteConfig";

export const generateMetadata = async (
  props: {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  },
  parent: ResolvingMetadata,
) => {
  const locale = (await getLocale()) as Locale;
  const metadataSource = getMetadataSource(locale);

  const mergeFn = combineWithParentMetadata({
    title: "Landing",
    description: "test",
    keywords: ["Dying Star", "Dying Star Game", "DyingStar", "Star Deception"],
    openGraph: {
      url: SiteConfig.prodUrl,
      type: "website",
      title: SiteConfig.title,
      description: metadataSource.Landing.Metadata.description,
      images: [
        {
          url: SiteConfig.metaImage,
          width: 1200,
          height: 630,
          alt: SiteConfig.metaImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SiteConfig.title,
      description: metadataSource.Landing.Metadata.description,
      creator: "@dyingstargame",
      site: SiteConfig.prodUrl,
      images: [
        {
          url: SiteConfig.metaImage,
          width: 1200,
          height: 630,
          alt: SiteConfig.metaImageAlt,
        },
      ],
    },
    alternates: {
      canonical: SiteConfig.prodUrl,
    },
  });
  return mergeFn(props, parent);
};

const HomePage = async () => {
  const t = await getTranslations("Landing");

  return (
    <>
      <CtaWithButton
        title={t("CTA.contribute.title")}
        action={{
          label: t("CTA.contribute.action"),
          href: LINKS.Project.Contribute.href(),
        }}
      />

      <LayoutMain size="full">
        <NewsSection />
        {/* <ProjectDescriptionSection /> */}
        {/* <TaskSection /> */}
        <CtaWithButton
          title={t("CTA.discord.title")}
          action={{
            label: t("CTA.discord.action"),
            icon: <LogoDiscordSvg />,
            href: `https://discord.gg/${env.NEXT_PUBLIC_DISCORD_INVITE_ID}`,
            target: "_blank",
          }}
        />
        {/* <YoutubeSection /> */}
      </LayoutMain>
    </>
  );
};

export default HomePage;
