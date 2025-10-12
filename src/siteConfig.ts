import { getServerDomain, getServerUrl } from "@lib/serverUrl";

export const SiteConfig = {
  title: "Dying Star",
  description: "Collect and showcase powerful video and text testimonials", // TODO: Define text
  prodUrl: getServerUrl(),
  appId: "dyingstar",
  domain: getServerDomain(),
  appIcon: "assets/images/icon.png",
};
