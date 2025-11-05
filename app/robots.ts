import { getServerUrl } from "@lib/serverUrl";
import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 0,
      },
    ],
    sitemap: `${getServerUrl()}/sitemap.xml`,
  };
};

export default robots;
