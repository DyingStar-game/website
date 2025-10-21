import { Issues } from "@app/[locale]/(layout)/contribute/_components/issues";
import Hero from "@components/DS/hero/hero";
import { JsonLd } from "@components/DS/jsonLd";
import { LINKS } from "@feat/navigation/Links";
import { LayoutMain } from "@feat/page/layout";
import { combineWithParentMetadata } from "@lib/metadata";
import { createLocalizedUrl } from "@lib/serverUrl";
import type { ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { CollectionPage, HowTo, WithContext } from "schema-dts";

export const generateMetadata = async (
  props: {
    params: Record<string, string>;
    searchParams?: Record<string, string | string[] | undefined>;
  },
  parent: ResolvingMetadata,
) => {
  const t = await getTranslations("Issue.Metadata");

  const mergeFn = combineWithParentMetadata({
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      url: LINKS.Project.Contribute.href(),
      type: "article",
    },
    alternates: {
      canonical: LINKS.Project.Contribute.href(),
    },
  });
  return mergeFn(props, parent);
};

const ContributePage = async (props: PageProps<"/[locale]/contribute">) => {
  const params = await props.params;
  const t = await getTranslations("Issue");

  const currentUrl = createLocalizedUrl(
    params.locale,
    LINKS.Project.Contribute.href(),
  );

  const contributePageJsonLd: WithContext<HowTo> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("Hero.title"),
    about: t("Hero.description"),
    inLanguage: params.locale,
    url: currentUrl,
  };

  const collectionPageJsonLd: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("JsonLd.CollectionPage.name"),
    url: currentUrl,
    inLanguage: params.locale,
  };

  return (
    <>
      <Hero title={t("Hero.title")} description={t("Hero.description")} />
      <LayoutMain>
        <Issues />
        <JsonLd data={contributePageJsonLd} />
        <JsonLd data={collectionPageJsonLd} />
      </LayoutMain>
    </>
  );
};

export default ContributePage;
