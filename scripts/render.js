// This script runs outside of webpack bundling
// It's invoked by the API route using child_process.spawn

const { bundle } = require("@remotion/bundler");
const {
  renderMedia,
  selectComposition,
  ensureBrowser,
} = require("@remotion/renderer");
const path = require("path");
const fs = require("fs");
const os = require("os");

// Cache configuration
const CACHE_DIR = path.join(os.tmpdir(), "flowcut-bundle-cache");
const CACHE_INFO_FILE = path.join(CACHE_DIR, "bundle-info.json");

// Get a hash of source files to detect changes
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

// Get cached bundle location if valid
function getCachedBundle() {
  try {
    if (!fs.existsSync(CACHE_INFO_FILE)) {
      return null;
    }

    const cacheInfo = JSON.parse(fs.readFileSync(CACHE_INFO_FILE, "utf-8"));
    const currentHash = getSourceHash();

    // Check if source files have changed
    if (cacheInfo.sourceHash !== currentHash) {
      console.error("[Render] Source files changed, cache invalidated");
      return null;
    }

    // Check if bundle directory still exists
    if (!fs.existsSync(cacheInfo.bundleLocation)) {
      console.error("[Render] Cached bundle directory missing");
      return null;
    }

    console.error("[Render] Using cached bundle!");
    return cacheInfo.bundleLocation;
  } catch (error) {
    console.error("[Render] Error reading cache:", error.message);
    return null;
  }
}

// Save bundle location to cache
function saveBundleCache(bundleLocation) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    const cacheInfo = {
      bundleLocation,
      sourceHash: getSourceHash(),
      createdAt: Date.now(),
    };

    fs.writeFileSync(CACHE_INFO_FILE, JSON.stringify(cacheInfo, null, 2));
    console.error("[Render] Bundle cached for future renders");
  } catch (error) {
    console.error("[Render] Error saving cache:", error.message);
  }
}

async function render() {
  // Read input from stdin
  let inputData = "";
  for await (const chunk of process.stdin) {
    inputData += chunk;
  }

  let params;
  try {
    params = JSON.parse(inputData);
  } catch (e) {
    console.log(
      JSON.stringify({
        success: false,
        error: "Invalid JSON input: " + e.message,
      })
    );
    process.exit(1);
  }

  const {
    templateId,
    duration,
    props,
    width,
    height,
    fps = 30,
    outputPath,
  } = params;

  if (!templateId || !outputPath) {
    console.log(
      JSON.stringify({
        success: false,
        error: "Missing required parameters: templateId or outputPath",
      })
    );
    process.exit(1);
  }

  try {
    console.error(`[Render] Starting render for template: ${templateId}`);
    console.error(
      `[Render] Dimensions: ${width}x${height}, Duration: ${duration} frames, FPS: ${fps}`
    );
    console.error(`[Render] Output path: ${outputPath}`);

    // Ensure browser is available (will download if needed)
    console.error("[Render] Ensuring browser is available...");
    await ensureBrowser({
      onBrowserDownload: (progress) => {
        if (progress.downloaded === progress.totalSize) {
          console.error("[Render] Browser download complete!");
        } else {
          console.error(
            `[Render] Downloading browser: ${Math.round(
              (progress.downloaded / progress.totalSize) * 100
            )}%`
          );
        }
      },
    });
    console.error("[Render] Browser is ready!");

    // Try to get cached bundle first
    let bundleLocation = getCachedBundle();

    if (!bundleLocation) {
      // Bundle the Remotion project
      console.error(
        "[Render] Bundling Remotion project (this may take a moment)..."
      );
      const entryPoint = path.join(process.cwd(), "remotion", "Root.tsx");
      console.error(`[Render] Entry point: ${entryPoint}`);

      bundleLocation = await bundle({
        entryPoint,
        webpackOverride: (config) => config,
        // Enable caching for faster subsequent builds
        enableCaching: true,
      });

      // Save to cache for future renders
      saveBundleCache(bundleLocation);
      console.error(`[Render] Bundle created at: ${bundleLocation}`);
    }

    // Get composition
    console.error("[Render] Selecting composition...");
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: templateId,
      inputProps: props,
    });
    console.error(`[Render] Composition selected: ${composition.id}`);

    // Render video with dynamic dimensions
    // Use concurrency to leverage multiple CPU cores for faster rendering
    const cpuCount = require("os").cpus().length;
    const concurrency = Math.max(1, Math.floor(cpuCount * 0.75)); // Use 75% of cores
    console.error(
      `[Render] Using ${concurrency} threads (of ${cpuCount} available cores)`
    );
    console.error("[Render] Rendering video...");
    await renderMedia({
      composition: {
        ...composition,
        durationInFrames: duration,
        width: width || composition.width,
        height: height || composition.height,
        fps: fps || composition.fps,
      },
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: props,
      concurrency,
      onProgress: ({ progress }) => {
        console.error(`[Render] Progress: ${Math.round(progress * 100)}%`);
      },
    });

    console.error("[Render] Video rendered successfully!");
    console.log(JSON.stringify({ success: true, outputPath }));
    process.exit(0);
  } catch (error) {
    console.error("[Render] Error:", error.message);
    console.error("[Render] Stack:", error.stack);
    console.log(JSON.stringify({ success: false, error: error.message }));
    process.exit(1);
  }
}

render();
