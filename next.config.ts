import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["fs", "path", "readline"],
};

export default nextConfig;
