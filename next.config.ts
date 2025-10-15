import createJiti from "jiti";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { fileURLToPath } from "node:url";

const jiti = createJiti(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin();

jiti("./src/lib/env/server.ts");
jiti("./src/lib/env/client.ts");

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  typedRoutes: true,
  images: {
    imageSizes: [32, 64, 96, 128],
    deviceSizes: [640, 768, 1024, 1280, 1536],
  },
  output: "standalone",
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
};

export default withNextIntl(nextConfig);
