import crypto from "crypto";
import config from "./config";
import express from "express";
import { Store } from "./lib/store";
import { Session, Scopes } from "./lib/session";

const conf = config();

const mapMethodToScope: {[key: string]: string} = {
	"GET": Scopes.Read,
	"POST": Scopes.Write,
	"PATCH": Scopes.Write,
	"DELETE": Scopes.Delete,
};

/**
 * Middleware to validate token scopes for incoming request from user
 * @param session Session Instance
 */
export const validateToken = (session: Session, store: Store): express.RequestHandler => {
	return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
		if(req.headers.authorization === undefined )
		{ throw "invalid authorization: no authorization header found";}

		const authHeader = req.headers.authorization.split(" ");
		if (authHeader[0] === "Bearer") {
			const tkn = authHeader[1];
			const token = session.getToken(tkn);
			res.locals.token = token;
			if(token.scopes.filter(scope => scope === Scopes.Owner).length > 0) { 
				res.locals.database = store.getDB(token.database);
				next();
			}
			else {
				if(token.scopes.filter(scope => scope === mapMethodToScope[req.method]).length > 0) {
					res.locals.database = store.getDB(token.database);
					next();
				}
				else throw "insufficient scopes";
			}
		}
		else throw "incorrect token type";
		
	};
};


/**
 * Middleware to validate token for incoming request from admin
 */
export const validateAdminToken = (): express.RequestHandler => {
	return (req: express.Request, _res: express.Response, next: express.NextFunction): void => {
		if(req.headers.authorization === undefined )
		{ throw "invalid authorization: no authorization header found";}

		const authHeader = req.headers.authorization.split(" ");
		if (authHeader[0] === "Basic") {
			const pwdObj = Buffer.from(authHeader[1], "base64").toString("ascii").split(":");
			if (pwdObj[0] === "admin" && crypto.createHash("sha256").update(pwdObj[1]).digest("hex") === conf.password) next();
			else throw "wrong user or password";
		}
		else throw "incorrect token type";
	};
};
