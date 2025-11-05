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
  const t = await getTranslations("Project.Metadata");

  const mergeFn = combineWithParentMetadata({
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      url: LINKS.Legal.terms.href(),
      type: "article",
    },
    alternates: {
      canonical: LINKS.Legal.terms.href(),
    },
  });
  return mergeFn(props, parent);
};

export const dynamic = "force-static";

const TermsPage = async (props: PageProps<"/[locale]/legal/terms">) => {
  const { locale } = await props.params;
  const t = await getTranslations("Terms");
  const markdownPath = path.join(
    process.cwd(),
    `content`,
    locale,
    `terms.${locale}.md`,
  );
  const markdown = fs.readFileSync(markdownPath, "utf8");

  const termsPageJsonLd: WithContext<Article> = {
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
      <JsonLd data={termsPageJsonLd} />
    </LayoutMain>
  );
};

export default TermsPage;
