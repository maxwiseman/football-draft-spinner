/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { withAxiom } from 'next-axiom';
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.espncdn.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withAxiom(config);