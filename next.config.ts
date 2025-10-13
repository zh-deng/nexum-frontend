// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ["./styles"],
    prependData: `
      @import "~@/styles/variables";
      @import "~@/styles/mixins";
      @import "~@/styles/utilities";
    `,
  },
};

export default nextConfig;
