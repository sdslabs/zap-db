import express from "express";
import { Store } from "./lib/store";
import { Session } from "./lib/session";

// export const getDB = (): express.RequestHandler => {
// 	return (req: express.Request, res: express.Response): void => { 
//         res.json(res.locals.database.get());
        
//         };
// };

export const getEntry = (): express.RequestHandler => {
	return (req: express.Request, res: express.Response): void => { 
                const key: string = req.params.key;
                if(!req.params.key){
                res.json(res.locals.database.get());
                } else {
                if(res.locals.database.get(key)){
                        res.json(res.locals.database.get(key)); 
                } else throw "invalid key";}
        };
};

export const writeIntoDB = (): express.RequestHandler => {
	return (req: express.Request, res: express.Response): void => {
        res.send(200).locals.database.write(req.body);
	};
};

export const updateEntry = (): express.RequestHandler => {
	return (req: express.Request, res: express.Response): void => {
                let key: string = req.params.key;
                for(let x in req.body){
                        if(res.locals.database.get(x)){
                                res.locals.database.update(x,req.body[x]);
                        }
                }
        //res.send(201).locals.database.update(key,req.body);
        //res.send(200).json({message : "updated"});
        //res.json(res.locals.database.get("name"));
	};
};

export const deleteEntry = (): express.RequestHandler => {
        return (req: express.Request, res: express.Response): void => {
                
        };
};

export const addToken = (session: Session): express.RequestHandler => {
        return (req: express.Request, res: express.Response): void => {
                session.addToken(req.body);
                res.status(200).json({ message: "token generated"});
        };
};