const esbuild = require("esbuild");
const inlineImage = require("esbuild-plugin-inline-image");

esbuild
    .build({
        entryPoints: ["src/index.tsx"],
        outdir: "../public",
        bundle: true,
        plugins: [inlineImage()],
        target: "esnext",
    })
    .then(() => console.log("⚡ Build complete! ⚡"))
    .catch(() => process.exit(1));