import express from "express";
import logger from "morgan";
import bodyparser from "body-parser";
import cors from "cors";
import config from "./config";

/**
 * Registers routes to the app instance
 * @param app Express application
 */
const registerRoutes = (app: express.Express): void => {
	app.get("/", (_req, res) => {
		res.status(200).json({ message: "hello world" });
	});
};

/**
 * Creates new express app to start the server
 */
export default (): express.Express => {
	const app = express();
	const conf = config();

	if (conf.debug) {
		app.use(logger("dev"));
	} else {
		app.use(logger("tiny"));
	}

	app.use(bodyparser.json());
	app.use(bodyparser.urlencoded({ extended: true }));
	app.use(cors());

	registerRoutes(app);

	return app;
};
