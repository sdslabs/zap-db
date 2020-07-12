import express from "express";
import logger from "morgan";
import bodyparser from "body-parser";
import cors from "cors";
import config from "./config";
import { validateToken, validateAdminToken } from "./middlewares";
import { Session } from "./lib/session";
import { Store } from "./lib/store";
import * as controller from "./controllers";
/**
 * Registers routes to the app instance
 * @param app Express application
 */
const registerRoutes = (app: express.Express, session: Session, store: Store): void => {
	app.get("/", validateToken(session, store), controller.getEntry()); 

	app.get("/:key", validateToken(session, store), controller.getEntry()); 

	app.post("/", validateToken(session, store), controller.writeIntoDB());

	app.patch("/", validateToken(session, store), controller.updateEntry());

	app.delete("/", validateToken(session, store), controller.deleteEntry());
	
	// Admin Routes
	app.get("/admin", validateAdminToken(), (_req, res) => {
		//session.addToken({ database: "test", scopes: ["owner"] });
		session.addToken({database: "test", scopes: ["read", "write", "delete"]});
		res.status(200).json({ message: "something" });
	});

	app.post("/admin", validateToken(session, store), controller.addToken(session));	
	
}; 

/**
 * Creates new express app to start the server
 */
export default (session: Session, store:Store): express.Express => {
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

	registerRoutes(app, session, store);

	return app;
};
