import fs from "fs";
import crypto from "crypto";

/**
 * Scopes are the valid scopes for creating a token.
 */
export enum Scopes {
	Owner = "owner",
	Read = "read",
	Write = "write",
	Delete = "delete",
}

/**
 * Token contains the data related to a token.
 */
export interface Token {
	database: string;
	scopes: Scopes[];
}

/**
 * TokenData is the interface of the data that can be used by
 * JSONs to create a Token from.
 */
interface TokenData {
	database: string,
	scopes: string[],
}

interface TokenMap {
	[key: string]: Token,
}

interface TokenDataMap {
	[key: string]: TokenData, 
}

/**
 * Session class handles the interface with tokens and their management
*/
export class Session {
	private map: TokenMap;
	private path: string;
	private scopesMap: Map<string, Scopes>;

	constructor(path: string) {
		this.map = {};
		this.path = path;
		this.scopesMap = new Map<string, Scopes>();

		this.fillScopesMap();

		if (!fs.existsSync(path)) {
			this.writeMapToPath();
			// Since there is no data to read from the map
			return;
		}

		const data: string = fs.readFileSync(this.path, {
			encoding: "utf8",
			flag: "r"
		});
		const dataMap: TokenDataMap = JSON.parse(data);
		for (let token in dataMap) {
			this.map[token] = this.tokenFromData(dataMap[token]);
		}
	}

	private fillScopesMap(): void {
		this.scopesMap.set(Scopes.Owner, Scopes.Owner);
		this.scopesMap.set(Scopes.Read, Scopes.Read);
		this.scopesMap.set(Scopes.Write, Scopes.Write);
		this.scopesMap.set(Scopes.Delete, Scopes.Delete);
	}

	private scopesFromStrings(s: string[]): Scopes[] {
		const scopes: Scopes[] = [];

		for (let str of s) {
			if (this.scopesMap.has(str)) {
				scopes.push(this.scopesMap.get(str));
			}
		}

		return scopes;
	}

	private tokenFromData(data: TokenData): Token {
		const database: string = data.database;
		const scopes: Scopes[] = this.scopesFromStrings(data.scopes);
		return { database, scopes };
	}

	private writeMapToPath(): void {
		const fd = fs.openSync(this.path, "w");
		fs.writeSync(fd, JSON.stringify(this.map));
	}

	private static generateToken(): string {
		let result = "";
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()-_=+[{]};',./?<>\\\"";

		for (let i = 0; i < 64; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}

		// Return the sha256 of the random token generated
		return crypto.createHash("sha256").update(result).digest("hex");
	}

	/**
	 * Gets the roken information
	 * @param token String of the token from which the info is to
	 * be retreived
	 */
	public getToken(token: string): Token | undefined {
		const tkn = this.map[token];
		if (!tkn) {
			return undefined;
		}
		// we don't want to the reference to original token hence
		// a copy is returned
		return { ...tkn };
	}

	/**
	 * Adds new token to the database.
	 * @param data Information related to the database.
	 */
	public addToken(data: TokenData, checkOwner?: string): string {
		if(checkOwner === "owner"){
			const token: string = Session.generateToken();
			this.map[token] = this.tokenFromData(data);
			this.writeMapToPath();
			return token;
		}
		
	}

	public revokeToken(data: string, check?: any): void {
		if(check===1){
			delete this.map[data];
		}
		else{
			//Stores session.json into an temp object to extract the token (keys of the object)
			let temp: Object = this.tokenFromDatabase();
			let x: string[] = Object.keys(temp);
			for(let a of x){
				if(this.map[a]["database"] == undefined)
				{throw "database does not exist";}

				if(this.map[a]["database"] === data){
					delete this.map[a];
				}
				
				
			}
		}
		this.writeMapToPath();
	}

	//Extracts all the tokens related to a database
	public tokenFromDatabase(): Object{
		return JSON.parse(fs.readFileSync(this.path, {
			encoding: "utf8",
			flag: "r"
		}));
	}

	public updateToken(data: TokenData, token: string) : void {
		this.map[token] = this.tokenFromData(data);
		console.log(this.map[token]);
		this.writeMapToPath();
		
	}

	public getTokens(): TokenMap {
		return this.map;
	}
}
