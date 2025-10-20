import type { Locale } from "@i18n/config";
import type { Metadata, ResolvingMetadata } from "next";
import { getLocale } from "next-intl/server";
import { SiteConfig } from "siteConfig";

import { createLocalizedUrl } from "./serverUrl";
import { localMapper } from "./utils";

/**
 * Add a suffix to the title of the parent metadata
 *
 * If a layout in /users/ define the title as "Users", the title will be append to the title as "Users · My suffix"
 *
 * @param suffix The suffix to append to the title
 * @returns
 */
export const combineWithParentMetadata =
  (metadata: Metadata) =>
  async (
    _props: {
      params: Record<string, string>;
      searchParams?: Record<string, string | string[] | undefined>;
    },
    parent: ResolvingMetadata,
  ): Promise<Metadata> => {
    const locale = (await getLocale()) as Locale;
    const parentMetadata = await parent;
    return {
      ...metadata,
      ...(metadata.openGraph && {
        openGraph: {
          ...metadata.openGraph,
          locale: localMapper(locale),
          url: createLocalizedUrl(locale, metadata.openGraph.url?.toString()),
          images: [
            {
              url: SiteConfig.metaImage,
              width: 1200,
              height: 630,
              alt: SiteConfig.metaImageAlt,
            },
          ],
        },
      }),
      title: `${parentMetadata.title?.absolute} · ${metadata.title}`,
    };
  };
