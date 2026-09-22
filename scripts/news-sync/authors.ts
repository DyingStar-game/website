export type AuthorInfo = {
  author: string;
  roles: { fr: string[]; en: string[] };
};

// Key = Discord user id (Discord settings → Advanced → Developer Mode,
// then right-click a user → Copy User ID).
export const AUTHORS: Record<string, AuthorInfo> = {
  "456525763215228948": {
    author: "ddurieux",
    roles: { fr: ["Fondateur du projet"], en: ["Project founder"] },
  },
};

export const resolveAuthor = (
  discordUserId: string,
  fallbackName: string,
): AuthorInfo =>
  AUTHORS[discordUserId] ?? { author: fallbackName, roles: { fr: [], en: [] } };
