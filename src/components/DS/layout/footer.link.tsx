import { LINKS } from "@feat/navigation/Links";
import type {
  GeneratedNavigationLinksGroups,
  NavigationLink,
  NavigationLinksGroup,
  NavigationLinksGroups,
} from "@feat/navigation/navigation.model";

const FOOTER_LINKS: NavigationLinksGroups = [
  {
    title: "Project",
    links: [
      LINKS.Project.Roadmap,
      LINKS.Project.Contribute,
      LINKS.Project.Launcher,
      LINKS.Project.Configuration,
      LINKS.Project.Changelog,
    ],
  },
  {
    title: "Lore",
    links: [
      LINKS.Lore.History,
      LINKS.Lore.Items,
      LINKS.Lore.Fauna,
      LINKS.Lore.Tutorials,
    ],
  },
  {
    title: "Community",
    links: [
      LINKS.Community.Discord,
      LINKS.Community.Github,
      LINKS.Community.Youtube,
      LINKS.Community.Forums,
      LINKS.Community.Wiki,
    ],
  },
  {
    title: "Play now",
    links: [
      LINKS.Community.Discord,
      LINKS.Community.Github,
      LINKS.Community.Youtube,
      LINKS.Community.Forums,
      LINKS.Community.Wiki,
    ],
  },
];

export const getFooterLinks = (): GeneratedNavigationLinksGroups =>
  FOOTER_LINKS.map((group: NavigationLinksGroup) => ({
    ...group,
    links: group.links
      .filter((link: NavigationLink) => !link.hidden)
      .map((link: NavigationLink) => ({
        ...link,
        href: link.href(),
      })),
  }));
