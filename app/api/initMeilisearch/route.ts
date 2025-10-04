import { updateProjectIssues } from "@feat/api/github/hooks/indexedProjectIssues";
import { env } from "@lib/env/server";
import { route } from "@lib/zod-route";
import { NextResponse } from "next/server";
import z from "zod";

//TODO: Il faudrais faire sorte que meilisearch s'initialise tout seul au build de l'app si l'index est vide
export const POST = route
  .query(
    z.object({
      secret: z.string(),
    }),
  )
  .handler(async (_, { query }) => {
    if (query.secret !== env.GH_WEBHOOK_SECRET)
      return NextResponse.json({ message: "Invalid Access" }, { status: 403 });

    await updateProjectIssues();

    return NextResponse.json({ message: "DB loaded" }, { status: 200 });
  });
