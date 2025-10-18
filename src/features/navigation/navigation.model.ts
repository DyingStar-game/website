import {
  EmptyLinkParamsSchema,
  NewsLinkParamsSchema,
} from "@feat/navigation/Links";
import type { LucideIcon } from "lucide-react";
import { z } from "zod";

//#region Base Types

export type NavigationGroup = {
  title: string;
  links: NavigationLink[];
};

//#endregion Base Types

//#region Common Schema Parts

/**
 * Schéma de base commun pour tous les liens de navigation (sans href)
 */
const BaseNavigationLinkSchema = z
  .object({
    Icon: z.custom<LucideIcon>().optional(),
    label: z.string(),
    hidden: z.boolean().optional(),
    disabled: z.boolean().optional(),
  })
  .strict();

//#endregion Common Schema Parts

//#region Non Generated Schemas (Links with dynamic href function)

const NavigationLinkSchema = BaseNavigationLinkSchema.extend({
  href: z.function({
    input: [z.union([EmptyLinkParamsSchema, NewsLinkParamsSchema]).optional()],
    output: z.string(),
  }),
});

/**
 * Schéma pour une collection de liens de navigation
 */
const NavigationLinksSchema = z.array(NavigationLinkSchema);

/**
 * Schéma récursif pour les liens génériques
 */
const GenericLinkSchema: z.ZodType = z.lazy(() =>
  z.record(
    z.string(),
    z.union([NavigationLinkSchema, z.lazy(() => GenericLinkSchema)]),
  ),
);

/**
 * Schéma pour un groupe de liens de navigation
 */
const NavigationLinksGroup = z.object({
  title: z.string(),
  links: NavigationLinksSchema,
});

/**
 * Schéma pour une collection de groupes de liens de navigation
 */
const NavigationLinksGroups = z.array(NavigationLinksGroup);

//#endregion Non Generated Schemas

//#region Generated Schemas (Links with static href string)

/**
 * Type pour un groupe de navigation généré
 */
export type GeneratedNavigationGroup = {
  title: string;
  links: GeneratedNavigationLink[];
};

/**
 * Schéma pour un lien de navigation avec href statique (chaîne)
 */
const GeneratedNavigationLinkSchema = BaseNavigationLinkSchema.extend({
  href: z.string(),
});

/**
 * Schéma pour une collection de liens de navigation générés
 */
const GeneratedNavigationLinksSchema = z.array(GeneratedNavigationLinkSchema);

/**
 * Schéma récursif pour les liens génériques générés
 */
const GeneratedGenericLinkSchema: z.ZodType = z.lazy(() =>
  z.record(
    z.string(),
    z.union([
      GeneratedNavigationLinkSchema,
      z.lazy(() => GeneratedGenericLinkSchema),
    ]),
  ),
);

/**
 * Schéma pour un groupe de liens de navigation générés
 */
const GeneratedNavigationLinksGroup = z.object({
  title: z.string(),
  links: GeneratedNavigationLinksSchema,
});

/**
 * Schéma pour une collection de groupes de liens de navigation générés
 */
const GeneratedNavigationLinksGroups = z.array(GeneratedNavigationLinksGroup);

//#endregion Generated Schemas

//#region Type Exports

// Types pour les liens non générés (avec href fonction)
export type NavigationLink = z.infer<typeof NavigationLinkSchema>;
export type NavigationLinks = z.infer<typeof NavigationLinksSchema>;
export type GenericLinkSchema = z.infer<typeof GenericLinkSchema>;
export type NavigationLinksGroup = z.infer<typeof NavigationLinksGroup>;
export type NavigationLinksGroups = z.infer<typeof NavigationLinksGroups>;

// Types pour les liens générés (avec href chaîne)
export type GeneratedNavigationLink = z.infer<
  typeof GeneratedNavigationLinkSchema
>;
export type GeneratedNavigationLinks = z.infer<
  typeof GeneratedNavigationLinksSchema
>;
export type GeneratedGenericLinkSchema = z.infer<
  typeof GeneratedGenericLinkSchema
>;
export type GeneratedNavigationLinksGroup = z.infer<
  typeof GeneratedNavigationLinksGroup
>;
export type GeneratedNavigationLinksGroups = z.infer<
  typeof GeneratedNavigationLinksGroups
>;

//#endregion Type Exports

//#region Schema Exports

export {
  // Base Schema
  BaseNavigationLinkSchema,
  GeneratedGenericLinkSchema,
  // Generated Schemas
  GeneratedNavigationLinkSchema,
  GeneratedNavigationLinksGroup,
  GeneratedNavigationLinksGroups,
  GeneratedNavigationLinksSchema,
  GenericLinkSchema,
  // Non-Generated Schemas
  NavigationLinkSchema,
  NavigationLinksGroup,
  NavigationLinksGroups,
  NavigationLinksSchema,
};

//#endregion Schema Exports
