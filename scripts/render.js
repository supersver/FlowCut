// This script runs outside of webpack bundling
// It's invoked by the API route using child_process.spawn

const { bundle } = require("@remotion/bundler");
const { renderMedia, selectComposition } = require("@remotion/renderer");
const path = require("path");
const fs = require("fs");

async function render() {
  // Read input from stdin
  let inputData = "";
  for await (const chunk of process.stdin) {
    inputData += chunk;
  }

  const { templateId, duration, props, width, height, outputPath } =
    JSON.parse(inputData);

  try {
    console.error("Bundling Remotion project...");

    // Bundle the Remotion project
    const bundleLocation = await bundle({
      entryPoint: path.join(process.cwd(), "remotion", "Root.tsx"),
      webpackOverride: (config) => config,
    });

    console.error("Selecting composition...");

    // Get composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: templateId,
      inputProps: props,
    });

    console.error("Rendering video...");

    // Render video with dynamic dimensions
    await renderMedia({
      composition: {
        ...composition,
        durationInFrames: duration,
        width,
        height,
      },
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: props,
    });

    console.log(JSON.stringify({ success: true, outputPath }));
  } catch (error) {
    console.log(JSON.stringify({ success: false, error: error.message }));
    process.exit(1);
  }
}

render();
