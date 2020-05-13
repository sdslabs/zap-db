const Path = require("path");
const Bundler = require("parcel-bundler");
const { spawn } = require("child_process");

const entryFile = Path.join(__dirname, "../src/index.ts");

const commonOptions = {
	outDir: Path.join(__dirname, "../dist"),
	outFile: "index.js",
	cacheDir: Path.join(__dirname, "../.cache"),
	target: "node",
	bundleNodeModules: "true",
	hmr: false,
	sourceMaps: false,
	logLevel: 3,
};

const devOpts = {
	...commonOptions,
	watch: true,
	minify: false,
};

const prodOpts = {
	...commonOptions,
	watch: false,
	minify: true,
};

let proc;

const bundle = async (opts, startServer) => {
	const bundler = new Bundler(entryFile, opts);

	bundler.on("buildError", (error) => {
		throw error;
	});

	if (startServer) {
		bundler.on("buildEnd", () => {
			console.log(); // Leave extra line after build
			const out = Path.join(opts.outDir, opts.outFile);
			proc = spawn("node", [out], { stdio: "inherit" });
		});

		bundler.on("buildStart", () => {
			if (proc) {
				proc.kill("SIGINT");
			}
		});
	}

	await bundler.bundle();
};

const start = async () => {
	await bundle(prodOpts, true);
};

const watch = async () => {
	await bundle(devOpts, true);
};

const build = async () => {
	await bundle(prodOpts, false);
};

module.exports = { start, watch, build };
