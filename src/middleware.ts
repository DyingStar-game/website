import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "i18n/routing";

export default async function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);
  return response;
}

export const config = {
  // matcher: [
  //   "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  // ],
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",

  runtime: "nodejs",
};
