// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ["./styles"],
    prependData: `
      @use "~@/styles/variables" as *;
      @use "~@/styles/mixins" as *;
      @use "~@/styles/utilities" as *;
    `,
  },
};

export default nextConfig;
