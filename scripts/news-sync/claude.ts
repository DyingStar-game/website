import { execFile } from "child_process";
import { promisify } from "util";
import { z } from "zod";

const execFileAsync = promisify(execFile);

// Index-aligned: FR_TAGS[i] translates to EN_TAGS[i]
export const FR_TAGS = [
  "Informations du projet",
  "play test",
  "vote communautaire",
  "Changelog",
  "Discord",
  "DNDS",
  "godot",
  "développement",
] as const;

export const EN_TAGS = [
  "Project information",
  "play test",
  "community vote",
  "Changelog",
  "Discord",
  "LDSN",
  "godot",
  "development",
] as const;

export const MAX_TAGS = 5;

const LocalizedNewsSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  slug: z.string(),
  body: z.string(),
});

export const GeneratedNewsSchema = z.object({
  fr: LocalizedNewsSchema.extend({ titleIcon: z.string() }),
  en: LocalizedNewsSchema.extend({ authorRoles: z.array(z.string()) }),
});

export type GeneratedNews = z.infer<typeof GeneratedNewsSchema>;

export type ClaudeInput = {
  author: string;
  authorRolesFr: string[];
  date: string;
  bodyImages: string[];
  rawMarkdown: string;
};

const tagPairs = FR_TAGS.map((fr, index) => `- "${fr}" → "${EN_TAGS[index]}"`);

const SYSTEM_PROMPT = `Tu es l'éditeur du site web de DyingStar, un MMO spatial open source développé par une communauté bénévole (moteur Godot). On te fournit un post brut publié dans le salon Discord #news, écrit en français par un membre de l'équipe. Tu dois produire l'article du site en français puis sa traduction anglaise.

## Tâche A — article français (\`fr\`)

- Nettoie le texte en markdown prêt pour le site : titres \`##\` (jamais \`#\`), listes à puces, gras, liens \`[texte](url)\`. Les URLs YouTube restent nues, seules sur leur ligne.
- Retire la syntaxe propre à Discord : \`:emoji:\` personnalisés, mentions de salons \`<#id>\`, \`@everyone\`. Les emojis unicode peuvent rester.
- Garde le ton, le vocabulaire et la structure de l'auteur. N'invente rien, ne résume rien, ne supprime aucune information. Corrige uniquement l'orthographe et la ponctuation évidentes.
- Les lignes d'images \`![...](/assets/images/news/...)\` doivent être reprises **telles quelles**, à la même position dans le texte.
- \`title\` : court, sans point final. Si le post est une édition des « Dernières Nouvelles de DyingStar », le titre est « DNDS NNN » (numéro sur trois chiffres si l'auteur en donne un).
- \`titleIcon\` : un seul emoji représentatif.
- \`description\` : une phrase, 160 caractères maximum, sans markdown.
- \`tags\` : entre 1 et ${MAX_TAGS} tags choisis dans la liste ci-dessous. Tu peux proposer un nouveau tag uniquement si aucun ne convient.
- \`slug\` : kebab-case ASCII sans accent, 60 caractères maximum, sans date, en français.

## Tâche B — traduction anglaise (\`en\`)

- Traduction naturelle et fluide en anglais (pas mot à mot), même structure, mêmes images aux mêmes positions.
- \`tags\` : les équivalents anglais des tags français (voir la table) ; un nouveau tag est traduit.
- \`slug\` : kebab-case ASCII en anglais.
- \`authorRoles\` : traduction anglaise des rôles français fournis (tableau vide si aucun rôle).
- Convention : « DNDS » (Dernières Nouvelles de DyingStar) devient « LDSN » (Latest DyingStar News) dans le titre, le corps et les tags.

## Tags

${tagPairs.join("\n")}

Réponds uniquement avec l'objet JSON demandé.`;

const buildUserMessage = (input: ClaudeInput): string => {
  const images =
    input.bodyImages.length > 0
      ? input.bodyImages.map((image) => `- ${image}`).join("\n")
      : "(aucune)";
  const roles =
    input.authorRolesFr.length > 0 ? input.authorRolesFr.join(", ") : "(aucun)";

  return `Auteur : ${input.author}
Rôles (FR) : ${roles}
Date : ${input.date}
Images présentes dans le corps :
${images}

Post Discord brut :

<post>
${input.rawMarkdown}
</post>`;
};

// Output of `claude -p --output-format json`
const ClaudeResultSchema = z.object({
  is_error: z.boolean(),
  result: z.string().optional(),
  structured_output: z.unknown().optional(),
});

/**
 * Runs Claude Code in headless mode (`claude -p`), covered by the user's
 * subscription, with a JSON schema so the answer comes back structured.
 */
export const generateNews = async (
  input: ClaudeInput,
): Promise<GeneratedNews> => {
  // `claude` validates against draft-07 and rejects the `$schema` URI zod adds
  const { $schema: _ignored, ...jsonSchema } =
    z.toJSONSchema(GeneratedNewsSchema);
  const schema = JSON.stringify(jsonSchema);
  const args = [
    "-p",
    "--output-format",
    "json",
    "--tools",
    "",
    "--no-session-persistence",
    "--system-prompt",
    SYSTEM_PROMPT,
    "--json-schema",
    schema,
  ];

  const child = execFileAsync("claude", args, {
    maxBuffer: 16 * 1024 * 1024,
  });
  child.child.stdin?.end(buildUserMessage(input));

  let stdout: string;
  try {
    ({ stdout } = await child);
  } catch (error) {
    const details =
      error instanceof Error && "stderr" in error
        ? String(error.stderr).trim()
        : String(error);
    throw new Error(`claude -p failed: ${details}`, { cause: error });
  }

  const result = ClaudeResultSchema.parse(JSON.parse(stdout));
  if (result.is_error) {
    throw new Error(
      `claude -p returned an error: ${result.result ?? "unknown"}`,
    );
  }
  const parsed = GeneratedNewsSchema.safeParse(result.structured_output);
  if (!parsed.success) {
    throw new Error(
      `claude -p returned an unexpected structure: ${parsed.error.message}`,
    );
  }
  return parsed.data;
};
