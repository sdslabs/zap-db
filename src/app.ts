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

	//Admin Routes

	//Ouputs token details
	app.get("/admin", validateAdminToken(), controller.getTokens(session));

	//Creates a new database and outputs a new owner token
	app.post("/admin", validateAdminToken(), controller.createDB(session, store)); 

	//Deletes the entire database
	app.delete("/admin", validateAdminToken(), controller.deleteDB(session, store)); 

	//Gets the entire database
	app.get("/", validateToken(session, store), controller.getEntry());
	
	//Creates an entry in a database
	app.post("/", validateToken(session, store), controller.createEntry());

	//Updates an entry in the database
	app.patch("/", validateToken(session, store), controller.updateEntry()); 

	//Gets a particular entry from a database
	app.get("/:key", validateToken(session, store), controller.getEntry());

	//Deletes a particular entry in a database
	app.delete("/:key", validateToken(session, store), controller.deleteEntry());

	//Creates a token
	app.post("/token/createToken", validateToken(session, store), controller.addToken(session)); 

	//Updates a token's scopes
	app.patch("/token/updateToken", validateToken(session, store), controller.updateToken(session));

	//Revokes a token
	app.delete("/token/revokeToken", validateToken(session, store), controller.revokeToken(session));
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
