import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  typedRoutes: true,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
