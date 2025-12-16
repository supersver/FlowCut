// This script runs outside of webpack bundling
// It's invoked by the API route using child_process.spawn

const { bundle } = require("@remotion/bundler");
const { renderMedia, selectComposition } = require("@remotion/renderer");
const path = require("path");

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

  const { templateId, duration, props, width, height, outputPath } = params;

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
      `[Render] Dimensions: ${width}x${height}, Duration: ${duration} frames`
    );
    console.error(`[Render] Output path: ${outputPath}`);

    // Bundle the Remotion project
    console.error("[Render] Bundling Remotion project...");
    const entryPoint = path.join(process.cwd(), "remotion", "Root.tsx");
    console.error(`[Render] Entry point: ${entryPoint}`);

    const bundleLocation = await bundle({
      entryPoint,
      webpackOverride: (config) => config,
    });
    console.error(`[Render] Bundle created at: ${bundleLocation}`);

    // Get composition
    console.error("[Render] Selecting composition...");
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: templateId,
      inputProps: props,
    });
    console.error(`[Render] Composition selected: ${composition.id}`);

    // Render video with dynamic dimensions
    console.error("[Render] Rendering video...");
    await renderMedia({
      composition: {
        ...composition,
        durationInFrames: duration,
        width: width || composition.width,
        height: height || composition.height,
      },
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps: props,
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
