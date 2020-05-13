import app from "./app";
import config from "./config";

/**
 * Main function to run when starting the application
 */
const main = () => {
	const conf = config();

	app().listen(conf.port, () => {
		console.log(`Server started at http://0.0.0.0:${conf.port}`);
	});
};

main();
