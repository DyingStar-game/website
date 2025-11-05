import { LINKS } from "@feat/navigation/Links";
import { DEFAULT_LOCALE } from "@i18n/config";
import { env } from "@lib/env/server";
import { routing } from "i18n/routing";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const maintenanceEnd = env.MAINTENANCE_END && new Date(env.MAINTENANCE_END);

export default function middleware(request: NextRequest) {
  const excludeMaintenance = [
    "/api",
    "/_next/static",
    "/_next/image",
    "/favicon",
    "/apple-icon",
    "/icon",
    "/sitemap.xml",
    "/manifest",
    "/robots.txt",
    "/assets",
    LINKS.Maintenance.href(),
  ];

  const { pathname } = request.nextUrl;
  const isExcluded = excludeMaintenance.some((route) =>
    pathname.startsWith(route),
  );

  const now = new Date();

  // Redirect to maintenance page
  if (!isExcluded && maintenanceEnd && now < maintenanceEnd) {
    const url = request.nextUrl.clone();
    const localeMatch = url.pathname.match(/^\/([a-zA-Z]{2})(\/|$)/);
    const localePrefix = localeMatch
      ? `/${localeMatch[1]}`
      : `/${DEFAULT_LOCALE}`;

    url.pathname = `${localePrefix}${LINKS.Maintenance.href()}`;
    return NextResponse.rewrite(url);
  }

  return createMiddleware(routing)(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|apple-icon.png|icon|sitemap.xml|manifest|robots.txt|assets).*)",
  ],
  runtime: "nodejs",
};
