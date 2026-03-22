const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const mode = process.argv[2];
const extraArgs = process.argv.slice(3);
const cwd = process.cwd();

const DIST_DIRS = {
  dev: ".next-dev",
  build: ".next-build",
  start: ".next-build"
};

function removeDir(target) {
  fs.rmSync(path.join(cwd, target), { recursive: true, force: true });
}

if (!mode) {
  console.error("Missing mode. Use: dev | build | start | clean");
  process.exit(1);
}

if (mode === "clean") {
  [".next", ".next-dev", ".next-build"].forEach(removeDir);
  process.exit(0);
}

const distDir = DIST_DIRS[mode];

if (!distDir) {
  console.error(`Unsupported mode: ${mode}`);
  process.exit(1);
}

if (mode === "dev" || mode === "build") {
  removeDir(distDir);
}

const nextBin = require.resolve("next/dist/bin/next");
const result = spawnSync(process.execPath, [nextBin, mode, ...extraArgs], {
  cwd,
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_DIST_DIR: distDir
  }
});

process.exit(result.status ?? 1);
