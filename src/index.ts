import app from "./app";
import config from "./config";
import { Store } from "./lib/store";
import { Session } from "./lib/session";

/**
 * Main function to run when starting the application
 */
const main = () => {
	const conf = config();
	const store = new Store(conf.store);
	const session = new Session(conf.session);

	app(session, store).listen(conf.port, () => {
		console.log(`Server started at http://0.0.0.0:${conf.port}`);
	});
};

main();
