import type { ReactNode } from "react";

import { JsonLd } from "@components/DS/jsonLd";
import { getContentPage } from "@feat/contentPage/contentPageManager";
import { ServerMdx } from "@feat/markdown/serverMdx";
import type { NavigationLink } from "@feat/navigation/navigation.model";
import {
  LayoutHeader,
  LayoutMain,
  LayoutSection,
  LayoutTitle,
} from "@feat/page/layout";
import { LOCALES } from "@i18n/config";
import { combineWithParentMetadata } from "@lib/metadata";
import { createLocalizedUrl } from "@lib/serverUrl";
import type { ResolvingMetadata } from "next";
import type { Locale } from "next-intl";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Article, WithContext } from "schema-dts";

type CreateContentPageOptions = {
  /**
   * Name of the markdown file in `content/<locale>/pages/`, without extension
   */
  slug: string;
  link: NavigationLink;
  /**
   * Rendered after the markdown content
   */
  children?: ReactNode;
};

/**
 * Creates a page rendering `content/<locale>/pages/<slug>.md`.
 * Title, description and keywords come from the markdown frontmatter.
 *
 * @example
 * ```ts
 * const page = createContentPage({ slug: "features", link: LINKS.Project.Features });
 *
 * export const dynamic = "force-static";
 * export const { generateMetadata, generateStaticParams } = page;
 * export default page.Page;
 * ```
 */
export const createContentPage = ({
  slug,
  link,
  children,
}: CreateContentPageOptions) => {
  const getPageOrNotFound = async (locale: Locale) => {
    const page = await getContentPage(slug, locale);
    if (!page) notFound();
    return page;
  };

  const generateMetadata = async (
    props: {
      params: Record<string, string>;
      searchParams?: Record<string, string | string[] | undefined>;
    },
    parent: ResolvingMetadata,
  ) => {
    const { attributes } = await getPageOrNotFound(await getLocale());

    const mergeFn = combineWithParentMetadata({
      title: attributes.metaTitle ?? attributes.title,
      description: attributes.description,
      keywords: attributes.keywords,
      openGraph: {
        url: link.href(),
        type: "article",
      },
      alternates: {
        canonical: link.href(),
      },
    });
    return mergeFn(props, parent);
  };

  const generateStaticParams = async () => {
    return LOCALES.map((locale) => ({
      locale,
    }));
  };

  const Page = async (props: { params: Promise<{ locale: Locale }> }) => {
    const { locale } = await props.params;
    const { attributes, content } = await getPageOrNotFound(locale);

    const pageJsonLd: WithContext<Article> = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: attributes.title,
      inLanguage: locale,
      url: createLocalizedUrl(locale, link.href()),
    };

    return (
      <LayoutMain>
        <LayoutHeader>
          <LayoutTitle>{attributes.title}</LayoutTitle>
        </LayoutHeader>
        <LayoutSection size="container" className="gap-6">
          <ServerMdx source={content} />
        </LayoutSection>
        {children}
        <JsonLd data={pageJsonLd} />
      </LayoutMain>
    );
  };

  return { generateMetadata, generateStaticParams, Page };
};
