const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "flowcut-test-"));
const outputPath = path.join(tempDir, "output.mp4");

const params = {
  templateId: "template4",
  duration: 750,
  props: {
    recipientName: "Test User",
    phoneName: "iPhone 15",
  },
  width: 1080,
  height: 1920,
  fps: 30,
  outputPath,
};

console.log("Starting test render for template4...");
console.log("Output path:", outputPath);
console.log("Params:", JSON.stringify(params, null, 2));

const renderProcess = spawn(
  "node",
  [path.join(__dirname, "scripts", "render.js")],
  {
    cwd: __dirname,
    stdio: ["pipe", "pipe", "pipe"],
  }
);

renderProcess.stdin.write(JSON.stringify(params));
renderProcess.stdin.end();

let stdout = "";
let stderr = "";

renderProcess.stdout.on("data", (data) => {
  stdout += data.toString();
  console.log("[STDOUT]:", data.toString());
});

renderProcess.stderr.on("data", (data) => {
  stderr += data.toString();
  console.log("[STDERR]:", data.toString());
});

renderProcess.on("close", (code) => {
  console.log("\n=== RENDER COMPLETE ===");
  console.log("Exit code:", code);
  console.log("Final stdout:", stdout);
  if (stderr) {
    console.log("Final stderr:", stderr);
  }

  // Check if output file was created
  if (fs.existsSync(outputPath)) {
    const stat = fs.statSync(outputPath);
    console.log("Output file size:", stat.size, "bytes");
  } else {
    console.log("Output file was NOT created");
  }

  // Cleanup
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {}
});

renderProcess.on("error", (err) => {
  console.error("Process error:", err);
});
