// Pre-bundle script to warm up the cache before exports
// Run this with: npm run prebundle

const { bundle } = require("@remotion/bundler");
const path = require("path");
const fs = require("fs");
const os = require("os");

const CACHE_DIR = path.join(os.tmpdir(), "flowcut-bundle-cache");
const CACHE_INFO_FILE = path.join(CACHE_DIR, "bundle-info.json");

function getSourceHash() {
  const remotionDir = path.join(process.cwd(), "remotion");
  let hash = "";

  function hashDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        hashDir(fullPath);
      } else if (
        entry.name.endsWith(".tsx") ||
        entry.name.endsWith(".ts") ||
        entry.name.endsWith(".css")
      ) {
        const stat = fs.statSync(fullPath);
        hash += `${fullPath}:${stat.mtimeMs}|`;
      }
    }
  }

  hashDir(remotionDir);
  return hash;
}

function saveBundleCache(bundleLocation) {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  const cacheInfo = {
    bundleLocation,
    sourceHash: getSourceHash(),
    createdAt: Date.now(),
  };

  fs.writeFileSync(CACHE_INFO_FILE, JSON.stringify(cacheInfo, null, 2));
}

async function prebundle() {
  console.log("🚀 Pre-bundling Remotion project for faster exports...\n");

  const startTime = Date.now();
  const entryPoint = path.join(process.cwd(), "remotion", "Root.tsx");

  console.log(`📦 Entry point: ${entryPoint}`);
  console.log("⏳ This may take a moment on the first run...\n");

  try {
    const bundleLocation = await bundle({
      entryPoint,
      webpackOverride: (config) => config,
      enableCaching: true,
    });

    saveBundleCache(bundleLocation);

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ Bundle created at: ${bundleLocation}`);
    console.log(`⚡ Time taken: ${duration}s`);
    console.log(`💾 Cache saved to: ${CACHE_INFO_FILE}`);
    console.log("\n🎉 Future exports will be MUCH faster!");
  } catch (error) {
    console.error("\n❌ Pre-bundling failed:", error.message);
    process.exit(1);
  }
}

prebundle();
