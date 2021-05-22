import express from "express";
import { Store } from "./lib/store";
import { Session, Token, Scopes, TokenData } from "./lib/session";


export const getEntry = (): express.RequestHandler => {
	return (req: express.Request, res: express.Response): void => { 
		const key: string | void = req.params.key;
		res.json(res.locals.database.get(key)).status(200);
	};
};

export const createEntry = (): express.RequestHandler => {
	return (req: express.Request, res: express.Response): void => {
		res.locals.database.write(req.body);
		res.json({message: "Entry successfully made"}).send(200);
	};
};

export const updateEntry = (): express.RequestHandler => {
	return (req: express.Request, res: express.Response): void => {
		for(let key in req.body){
			if(res.locals.database.get(key)){
				res.locals.database.update(key, req.body[key]);
			}
		}
		res.json({message: "Entry successfully updated"}).send(200);
	};
};

export const deleteEntry = (): express.RequestHandler => {
	return (req: express.Request, res: express.Response): void => {
		res.locals.database.delete(req.params.key);
		res.json({ message: "Entry deleted" }).status(200);
	};
};

export const getTokens = (session: Session): express.RequestHandler => {
	return (_req: express.Request, res: express.Response): void => {
		res.json(session.getTokens()).status(200);
	};
};

export const addToken = (session: Session): express.RequestHandler => {
	return (req: express.Request, res: express.Response): void => {
		const authToken: Token = res.locals.token;
		if(authToken.scopes.includes(Scopes.Owner)){
			const scopes: string[] = JSON.parse(req.body.scopes);
			if(!scopes.includes(Scopes.Owner)){
				const data: TokenData = {
					"database": res.locals.database.name,
					"scopes": scopes,
				};
				console.log(data);
				const token = session.addToken(data);
				res.status(200).json({ message: "token generated", token});
			}
			else throw "There can be only one owner token";
		}
		else throw "insufficient scope";
	};
};

export const revokeToken = (session: Session): express.RequestHandler => {
	return (req: express.Request, res: express.Response): void => {
		const authToken: Token = res.locals.token;
		if(authToken.scopes.includes(Scopes.Owner)){
			session.revokeToken(req.body.token);
			res.json({ message: "token revoked"}).status(200);
		} else {
			throw "insufficient permissions";
		}
	};
};

export const updateToken = (session: Session): express.RequestHandler => {
	return (req: express.Request, res: express.Response): void => {
		const authToken: Token = res.locals.token;
		if(authToken.scopes.includes(Scopes.Owner)){
			session.updateToken(req.body.token, JSON.parse(req.body.scopes));
			res.json({ message : "token updated" }).status(200);
		} else {
			throw "insufficient permissions";
		}
	};
};

export const createDB = (session: Session, store: Store): express.RequestHandler => {
	return (req: express.Request, res: express.Response): void => {
		const database: string = req.body.database;
		const data: TokenData = {
			"database": database,
			"scopes": [ Scopes.Owner ]
		};  
		store.createDB(database);
		const token: string = session.addToken(data);
		res.status(200).json({ message: "Database generated", token: token });
	};
};

export const deleteDB = (session: Session, store: Store): express.RequestHandler => {
	return (req: express.Request, res: express.Response): void => {
		const database: string = req.body.database;
		store.deleteDB(req.body.database);
		const tokens = session.tokensFromDatabase(database);
		tokens.forEach((token) => {
			session.revokeToken(token);
		});
		res.json({message: "Database deleted"}).status(200);
	};
};
