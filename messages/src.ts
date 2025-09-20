import { writeFileSync } from "fs";

const messages = {
  en: {
    common: {
      soon: "Soon",
      roadmap: "Roadmap",
      contact: "Contact",
      Configuration: "Configuration",
      changelog: "Changelog",
      history: "History",
      fauna: "Fauna",
      discord: "Discord",
      github: "GitHub",
      youtube: "YouTube",
      forum: "Forum",
      wiki: "Wiki",
      privacy: "Privacy",
      terms: "Terms",
      version: "Version {version}",
      copyright: "<link>©</link> {year} {title}. All rights reserved.",
      lore: "Lore",
      playNow: "Play Now",
      help: "Help",
      faq: "FAQ",
      gdpr: "GDPR",
      unknown: "Unknown",
      project: "Project",
      news: "News",
      launcher: "Launcher",
      community: "Community",
    },
    plurals: {
      cookie: "{count, plural, one {Cookie} other {Cookies}}",
      server: "{count, plural, one {Server} other {Servers}}",
      tutorial: "{count, plural, one {Tutorial} other {Tutorials}}",
      bug: "{count, plural, one {Bug} other {Bugs}}",
      item: "{count, plural, one {Item} other {Items}}",
      ticket: "{count, plural, one {Ticket} other {Tickets}}",
    },
  },
  fr: {
    common: {
      soon: "Bientôt",
      roadmap: "Roadmap",
      contact: "Contact",
      Configuration: "Configuration",
      changelog: "Changelog",
      history: "Histoire",
      fauna: "Faune",
      discord: "Discord",
      github: "GitHub",
      youtube: "YouTube",
      forum: "Forum",
      wiki: "Wiki",
      privacy: "Confidentialité",
      terms: "Conditions",
      version: "Version {version}",
      copyright: "<link>©</link> {year} {title}. Tous droits réservés.",
      lore: "Histoire",
      playNow: "Jouer maintenant",
      help: "Aide",
      faq: "FAQ",
      gdpr: "RGPD",
      unknown: "Inconnu",
      project: "Projet",
      news: "Actualités",
      launcher: "Launcher",
      community: "Communauté",
    },
    plurals: {
      cookie: "{count, plural, one {Cookie} other {Cookies}}",
      server: "{count, plural, one {Serveur} other {Serveurs}}",
      tutorial: "{count, plural, one {Tutoriel} other {Tutoriels}}",
      bug: "{count, plural, one {Bug} other {Bugs}}",
      item: "{count, plural, one {Objet} other {Objets}}",
      ticket: "{count, plural, one {Ticket} other {Tickets}}",
    },
  },
};

/**
 * Utility to generate the messages json files.
 * Mostly for the development phase and before having a proper i18n management system.
 * Run `tsx messages/src.ts` to generate the files.
 * @author Khoéos
 */
const generate = () => {
  writeFileSync(
    "./en.json",
    JSON.stringify({ ...messages.en.common, ...messages.en.plurals }, null, 2),
    {
      flag: "w",
    },
  );
  writeFileSync(
    "./fr.json",
    JSON.stringify(
      {
        ...messages.en.common,
        ...messages.en.plurals,
        ...messages.fr.common,
        ...messages.fr.plurals,
      },
      null,
      2,
    ),
    { flag: "w" },
  );
};
generate();
