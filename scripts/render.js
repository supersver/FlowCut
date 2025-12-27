// This script runs outside of webpack bundling
// It's invoked by the API route using child_process.spawn
// Uses Remotion CLI for more stable rendering

const { execSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

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

    // Write props to a temp file for the CLI to read
    const propsPath = path.join(
      os.tmpdir(),
      `flowcut-props-${Date.now()}.json`
    );
    fs.writeFileSync(propsPath, JSON.stringify(props || {}));
    console.error(`[Render] Props written to: ${propsPath}`);

    // Use Remotion CLI for rendering - more stable than programmatic API
    const entryPoint = path.join(process.cwd(), "remotion", "Root.tsx");

    // Build the CLI command - wrap paths with spaces in quotes
    const args = [
      "remotion",
      "render",
      `"${entryPoint}"`,
      templateId,
      `"${outputPath}"`,
      "--props",
      `"${propsPath}"`,
      "--width",
      String(width || 1080),
      "--height",
      String(height || 1920),
      "--frames",
      `0-${duration - 1}`,
      "--fps",
      String(fps),
      "--codec",
      "h264",
      "--concurrency",
      "2",
      "--timeout",
      "180000",
      "--log",
      "verbose",
      "--overwrite",
    ];

    console.error(`[Render] Running: npx ${args.join(" ")}`);

    // Run the CLI command
    const renderProcess = spawn("npx", args, {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    });

    let lastProgress = 0;

    renderProcess.stdout.on("data", (data) => {
      const output = data.toString();
      console.error(`[Render CLI] ${output}`);

      // Parse progress from output
      const progressMatch = output.match(/(\d+)%/);
      if (progressMatch) {
        const progress = parseInt(progressMatch[1]);
        if (progress !== lastProgress) {
          lastProgress = progress;
          console.error(`[Render] Progress: ${progress}%`);
        }
      }
    });

    renderProcess.stderr.on("data", (data) => {
      const output = data.toString();
      console.error(`[Render CLI] ${output}`);

      // Parse progress from stderr too
      const progressMatch = output.match(/(\d+)%/);
      if (progressMatch) {
        const progress = parseInt(progressMatch[1]);
        if (progress !== lastProgress) {
          lastProgress = progress;
          console.error(`[Render] Progress: ${progress}%`);
        }
      }
    });

    await new Promise((resolve, reject) => {
      renderProcess.on("close", (code) => {
        // Clean up props file
        try {
          fs.unlinkSync(propsPath);
        } catch (e) {
          // Ignore cleanup errors
        }

        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Render process exited with code ${code}`));
        }
      });

      renderProcess.on("error", (err) => {
        reject(err);
      });
    });

    // Verify output file exists
    if (!fs.existsSync(outputPath)) {
      throw new Error("Output file was not created");
    }

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
