import type {
  GenericLinkSchema,
  NavigationLink,
} from "@feat/navigation/navigation.model";
import { env } from "@lib/env/client";
import { Info } from "lucide-react";
import { z } from "zod";

// Constantes pour les chemins
const PATHS = {
  NEWS: `/news/:newsSlug`,
};

export const EmptyLinkParamsSchema = z.object({}).strict();

export const NewsLinkParamsSchema = EmptyLinkParamsSchema.extend({
  newsSlug: z.string(),
}).strict();

// Fonction utilitaire pour remplacer les paramètres dans les URLs
const createLinkGenerator = (path: string, needsParams = false) => {
  if (!needsParams) {
    return () => path;
  }

  return (params: Record<string, string> = {}) => {
    let result = path;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`:${key}`, value);
    });
    return result;
  };
};

// Fonction pour créer un lien de navigation
const createLink = (
  href: string,
  label: string,
  options: Partial<
    Omit<NavigationLink, "href" | "label" | "generateLink">
  > = {},
  needsParams = false,
): NavigationLink => ({
  href: createLinkGenerator(href, needsParams),
  label,
  ...options,
});

// Définition des liens
export const LINKS = {
  Landing: {
    Landing: createLink("/", "Project", undefined, false),
  },
  News: {
    All: createLink("/news", "Links.News.All", undefined, false),
    Detail: createLink(`${PATHS.NEWS}`, "News", { Icon: Info }, true),
  },

  Project: {
    Contribute: createLink("/contribute", "Links.Project.Contribute", {}),
    Launcher: createLink("/launcher", "Launcher", { disabled: true }, false),
    Configuration: createLink(
      "/configuration",
      "Configuration",
      { disabled: true },
      false,
    ),
    Changelog: createLink("/changelog", "Changelog", { disabled: true }, false),
    Roadmap: createLink("/roadmap", "Roadmap", { disabled: true }, false),
    Project: createLink("/project", "Links.Project.Project", {}, false),
  },

  Lore: {
    History: createLink(
      "/history",
      "Links.Lore.History",
      { disabled: true },
      false,
    ),
    Items: createLink("/items", "Items", { disabled: true }, false),
    Fauna: createLink("/fauna", "Fauna", { disabled: true }, false),
    Tutorials: createLink("/tutorials", "Tutorials", { disabled: true }, false),
  },

  Community: {
    Discord: createLink(
      `https://discord.gg/${env.NEXT_PUBLIC_DISCORD_INVITE_ID}`,
      "Links.Community.Discord",
      { target: "_blank" },
      false,
    ),
    Github: createLink(
      `https://github.com/${env.NEXT_PUBLIC_GITHUB_REPO}`,
      "Links.Community.Github",
      { target: "_blank" },
      false,
    ),
    Rss: createLink("/rss.xml", "Links.Community.Rss", { target: "_blank" }),
  },

  Support: {
    help: createLink("/help", "Help", { disabled: true }, false),
    bugs: createLink("/bugs", "Bugs", { disabled: true }, false),
    contact: createLink("/contact", "Contact", { disabled: true }, false),
    faq: createLink("/faq", "FAQ", { disabled: true }, false),
  },

  Legal: {
    terms: createLink("/legal/terms", "Terms", { disabled: true }, false),
    privacy: createLink("/legal/privacy", "Privacy", { disabled: true }, false),
    cookies: createLink("/cookies", "Cookies", { disabled: true }, false),
    rgpd: createLink("/rgpd", "RGPD", { disabled: true }, false),
  },

  Maintenance: createLink("/maintenance", "Maintenance", {
    hidden: true,
    disabled: true,
  }),
  RickRoll: createLink(
    "https://www.youtube.com/watch?v=xvFZjo5PgG0&list=RDxvFZjo5PgG0&start_radio=1",
    "RickRoll",
    { disabled: true, hidden: true },
    false,
  ),
} satisfies GenericLinkSchema;
