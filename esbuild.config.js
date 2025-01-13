import * as esbuild from "esbuild";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { readFileSync, writeFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const template = readFileSync("./src/index.html", "utf8");

const commonConfig = {
	entryPoints: ["./src/index.ts"],
	bundle: true,
	outdir: "dist",
	sourcemap: true,
	target: ["es2020"],
	loader: {
		".html": "copy",
		".png": "file",
		".jpeg": "file",
	},
};

const args = process.argv.slice(2);
const isServe = args.includes("--serve");
const isWatch = args.includes("--watch");
const isBuild = args.includes("--build");

if (isServe) {
	let ctx = await esbuild.context({
		...commonConfig,
		plugins: [
			{
				name: "html-plugin",
				setup(build) {
					build.onEnd(() => {
						writeFileSync("./dist/index.html", template);
					});
				},
			},
			{
				name: "assets-plugin",
				setup(build) {
					build.onEnd(async () => {
						try {
							await esbuild.build({
								entryPoints: ["assets/**/*"],
								outdir: "dist/assets",
                assetNames: "[dir]/[name]",
								loader: {
									".png": "file",
									".jpg": "file",
									".gif": "file",
									".svg": "file",
									".mp3": "file",
									".wav": "file",
									".ogg": "file",
								},
								allowOverwrite: true,
								metafile: false,
                keepNames: true,
							});
						} catch (e) {
							console.error("Error copying assets:", e);
						}
					});
				},
			},
		],
	});
	let { host, port } = ctx.serve({
		servedir: "dist",
		host: "localhost",
		port: 3000,
	});
  await ctx.watch({});
	console.log(`Development Server Running at http://${host}:${port}`);
} else if (isWatch) {
	let ctx = await esbuild.context(commonConfig);
	await ctx.watch();
	console.log("Watching for changes...");
} else if (isBuild) {
	await esbuild.build({
		...commonConfig,
		minify: true,
	});
	console.log("Build complete");
}
