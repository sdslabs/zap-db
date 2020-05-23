import express from "express";
import { Session } from "./lib/session";
import config from "./config";

const conf = config();

const mapMethodToScope: {[key: string]: string} = {
	"GET": "read",
	"POST": "write",
	"PATCH": "write",
	"DELETE": "delete",
};

/**
 * Middleware to validate token scopes for incoming request from user
 * @param session Session Instance
 */
export const ValidateToken = (session: Session): express.RequestHandler => {
	return (req: express.Request, _res: express.Response, next: express.NextFunction): void => {
		const auth_header = req.headers.authorization.split(" ");
		if (auth_header[0] === "Bearer") {
			const tkn = auth_header[1];
			const token = session.getToken(tkn);
			if(token.scopes.filter(scope => scope === "owner").length > 0) next();
			else {
				if(token.scopes.filter(scope => scope === mapMethodToScope[req.method]).length > 0) {
					next();
				}
				else throw "insufficient scopes";
			}
		}
		else throw "wrong token type";
	};
};


/**
 * Middleware to validate token for incoming request from admin
 */
export const ValidateAdminToken = (): express.RequestHandler => {
	return (req: express.Request, _res: express.Response, next: express.NextFunction): void => {
		const auth_header = req.headers.authorization.split(" ");
		if (auth_header[0] === "Bearer") {
			const tkn = req.headers.authorization.split(" ")[1];
			if(tkn === conf.password) next();
			else throw "incorrect admin password";
		}
		else throw "wrong token type";
	};
};
