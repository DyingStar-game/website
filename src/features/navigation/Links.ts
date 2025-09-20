import { Info } from "lucide-react";
import { z } from "zod";
import type { GenericLinkSchema, NavigationLink } from "./navigation.type";

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
    Landing: createLink("/", "project", undefined, false),
  },
  News: {
    News: createLink(`${PATHS.NEWS}`, "news", { Icon: Info }, true),
  },

  Project: {
    Tickets: createLink("/tickets", "ticket", { disabled: true }, false),
    Launcher: createLink("/launcher", "launcher", { disabled: true }, false),
    Configuration: createLink(
      "/configuration",
      "Configuration",
      { disabled: true },
      false,
    ),
    Changelog: createLink("/changelog", "changelog", { disabled: true }, false),
    Roadmap: createLink("/roadmap", "roadmap", { disabled: true }, false),
  },

  Lore: {
    History: createLink("/history", "history", { disabled: true }, false),
    Items: createLink("/items", "item", { disabled: true }, false),
    Fauna: createLink("/fauna", "fauna", { disabled: true }, false),
    Tutorials: createLink("/tutorials", "tutorial", { disabled: true }, false),
  },

  Community: {
    Discord: createLink("/discord", "discord", { disabled: true }, false),
    Github: createLink("/github", "github", { disabled: true }, false),
    Youtube: createLink("/youtube", "youtube", { disabled: true }, false),
    Forums: createLink("/forums", "forum", { disabled: true }, false),
    Wiki: createLink("/wiki", "wiki", { disabled: true }, false),
  },

  Support: {
    help: createLink("/help", "help", { disabled: true }, false),
    bugs: createLink("/bugs", "bug", { disabled: true }, false),
    contact: createLink("/contact", "contact", { disabled: true }, false),
    faq: createLink("/faq", "faq", { disabled: true }, false),
  },

  Legal: {
    terms: createLink("/terms", "terms", { disabled: true }, false),
    privacy: createLink("/privacy", "privacy", { disabled: true }, false),
    cookies: createLink("/cookies", "cookie", { disabled: true }, false),
    rgpd: createLink("/rgpd", "rgpd", { disabled: true }, false),
  },

  Maintenance: createLink("/maintenance", "maintenance", {
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
