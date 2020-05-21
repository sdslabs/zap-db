import { Session } from "./lib/session";
import config from "./config";

const conf = config();
const session = new Session(conf.session);

const mapMethodToScope: any = {
	"GET": "read",
	"POST": "write",
	"PATCH": "write",
	"DELETE": "delete",
};

/**
 * Middleware to validate token scopes for incoming request from user
 * @param _req Request object
 * @param res Response object
 * @param next Next callback
 */
export function ValidateToken(_req: any, res: any, next: Function) {
	const tkn = _req.headers.authorization.split(" ")[1];
	const token = session.getToken(tkn);
	if(token.scopes.filter(scope => scope === "owner").length > 0) next();
	else {
		if(token.scopes.filter(scope => scope === mapMethodToScope[_req.method]).length > 0) {
			next();
		}
		else throw "insufficient scopes";
	}
}

/**
 * Middleware to validate token for incoming request from admin
 * @param _req Request object
 * @param res Response object
 * @param next Next callback
 */
export function ValidateAdminToken(_req: any, res: any, next: Function) {
	const tkn = _req.headers.authorization.split(" ")[1];
	if(tkn === conf.password) next();
	else throw "incorrect admin password";
}