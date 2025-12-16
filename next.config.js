/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Mark these packages as external - they will be loaded from node_modules at runtime
    // instead of being bundled by webpack
    serverComponentsExternalPackages: [
      "@remotion/bundler",
      "@remotion/renderer",
      "@remotion/cli",
      "@remotion/compositor-linux-arm64-gnu",
      "@remotion/compositor-linux-arm64-musl",
      "@remotion/compositor-linux-x64-gnu",
      "@remotion/compositor-linux-x64-musl",
      "@remotion/compositor-darwin-arm64",
      "@remotion/compositor-darwin-x64",
      "@remotion/compositor-win32-x64-msvc",
      "esbuild",
      "esbuild-wasm",
    ],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle these modules on the server
      config.externals = [
        ...config.externals,
        "@remotion/bundler",
        "@remotion/renderer",
        "esbuild",
        /^@remotion\/.*/,
        /^esbuild.*/,
      ];
    }

    // Ignore .d.ts files
    config.module.rules.push({
      test: /\.d\.ts$/,
      loader: "ignore-loader",
    });

    return config;
  },
};

module.exports = nextConfig;
