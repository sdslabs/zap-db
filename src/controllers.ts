import express from "express";
import { Store } from "./lib/store";
import { stringify } from "querystring";


export const getDB = (store: Store,): express.RequestHandler => {
	return (req: express.Request, res: express.Response, next: express.NextFunction): void => { 
        res.json(res.locals.database.get());
        
        };
};

export const getEntry = (store: Store,): express.RequestHandler => {
	return (req: express.Request, res: express.Response, next: express.NextFunction): void => { 
                const key: string = req.params.id;
                
                if(res.locals.database.get(key)){
                        res.json(res.locals.database.get(key)); 
                } else throw "invalid key";
        };
};

export const writeIntoDB = (store: Store): express.RequestHandler => {
	return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
        //console.log(req.body);
        //let id: string = Date.now().toString();
        const entry = {
                [Date.now().toString()] : req.body
        };
        //console.log(entry);
        res.send(201).locals.database.write(entry);
	};
};

export const updateEntry = (store: Store): express.RequestHandler => {
	return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                let id: string = req.params.id;
        res.send(201).locals.database.update(id,req.body);
        //res.send(201).json({message : "updated"});
        //res.json(res.locals.database.get("name"));
	};
};

export const deleteEntry = (store: Store): express.RequestHandler => {
        return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
                
        };
};