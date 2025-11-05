import { getServerDomain, getServerUrl } from "@lib/serverUrl";

export const SiteConfig = {
  title: "Dying Star",
  description: "Collect and showcase powerful video and text testimonials", // TODO: Define text
  prodUrl: getServerUrl(),
  appId: "dyingstar",
  domain: getServerDomain(),
  metaImage: `${getServerUrl()}/assets/images/opengraph-image.png`,
  metaImageAlt: "SplashScreen",
};
