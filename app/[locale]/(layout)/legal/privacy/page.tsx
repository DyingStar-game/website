import { JsonLd } from "@components/DS/jsonLd";
import { ServerMdx } from "@feat/markdown/serverMdx";
import { LINKS } from "@feat/navigation/Links";
import {
  LayoutHeader,
  LayoutMain,
  LayoutSection,
  LayoutTitle,
} from "@feat/page/layout";
import { combineWithParentMetadata } from "@lib/metadata";
import { createLocalizedUrl } from "@lib/serverUrl";
import fs from "fs";
import type { ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import path from "path";
import type { Article, WithContext } from "schema-dts";

export const generateMetadata = async (
  props: {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  },
  parent: ResolvingMetadata,
) => {
  const t = await getTranslations("Privacy.Metadata");

  const mergeFn = combineWithParentMetadata({
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      url: LINKS.Legal.privacy.href(),
      type: "article",
    },
    alternates: {
      canonical: LINKS.Legal.privacy.href(),
    },
  });
  return mergeFn(props, parent);
};

export const dynamic = "force-static";

const PrivacyPage = async (props: PageProps<"/[locale]/legal/privacy">) => {
  const { locale } = await props.params;
  const t = await getTranslations("Privacy");
  const markdownPath = path.join(
    process.cwd(),
    `content`,
    locale,
    `privacy.${locale}.md`,
  );
  const markdown = fs.readFileSync(markdownPath, "utf8");

  const privacyPageJsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("JsonLd.Article.headline"),
    inLanguage: locale,
    url: createLocalizedUrl(locale, LINKS.Legal.privacy.href()),
  };

  return (
    <LayoutMain>
      <LayoutHeader>
        <LayoutTitle>{t("title")}</LayoutTitle>
      </LayoutHeader>
      <LayoutSection>
        <ServerMdx source={markdown} />
      </LayoutSection>
      <JsonLd data={privacyPageJsonLd} />
    </LayoutMain>
  );
};

export default PrivacyPage;
