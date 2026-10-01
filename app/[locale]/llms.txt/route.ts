import { generateLlmsTxt } from "@feat/llms/llmsManager";
import { route } from "@lib/zodRoute";

export const GET = route.handler(async (_, { params }) => {
  const llmsTxt = await generateLlmsTxt(params.locale);

  return new Response(llmsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
});
