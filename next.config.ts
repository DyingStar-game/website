import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// import createJiti from "jiti";
// import { fileURLToPath } from "node:url";

// const jiti = createJiti(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin();

// jiti("./src/lib/env/server.ts");
// jiti("./src/lib/env/client.ts");

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
  // transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};

export default withNextIntl(nextConfig);
