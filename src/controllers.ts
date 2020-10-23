import express from "express";
import { Store, Database } from "./lib/store";
import { Session, Token } from "./lib/session";


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
                                res.locals.database.update(key,req.body[key]);
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
        return (req: express.Request, res: express.Response): void => {
                res.json(session.getTokens()).status(200);
        };
};

export const addToken = (session: Session, store: Store): express.RequestHandler => {
        return (req: express.Request, res: express.Response): void => {
                
                if(res.locals.scope === "owner"){
                        if(req.body.scopes!= "owner"){
                                session.addToken(req.body, res.locals.scope);
                                res.status(200).json({ message: "token generated"});
                        }
                        else throw "There can be only one owner token";
                }
                else throw "insufficient scope";
                
        };
};

export const revokeToken = (session: Session): express.RequestHandler => {
        return (req: express.Request, res: express.Response): void => {
                if(res.locals.scope === "owner") {
                        session.revokeToken(req.body["token"], 0);
                        res.json({ message: "token revoked"}).status(200);
                }
        };
};

export const updateToken = (session: Session): express.RequestHandler => {
        return (req: express.Request, res: express.Response): void => {
                if(res.locals.scope === "owner"){
                        session.updateToken(req.body.data, req.body.token);
                        res.json({ message : "token updated" }).status(200);
                }
        };
};

export const createDB = (session: Session, store: Store): express.RequestHandler => {
        return (req: express.Request, res: express.Response): void => {
                const database: string = req.body.database;
                const data: any = {
                        "database": database,
                        "scopes": ["owner"]
                };  
                store.createDB(database);
                session.addToken(data);
                res.status(200).json({ message: "Database generated"});
        };
};

export const deleteDB = (store: Store, session: Session): express.RequestHandler => {
        return (req: express.Request, res: express.Response): void => {
                
                //store.deleteDB(req.body["database"]);
                session.revokeToken(req.body["database"]);
                
                
                res.json({message: "Database deleted"}).status(200);
        };
};
