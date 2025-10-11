import { routing } from "@i18n/routing";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

const middleware = async (request: NextRequest) => {
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);
  return response;
};

export default middleware;

export const config = {
  // matcher: [
  //   "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  // ],
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",

  runtime: "nodejs",
};
