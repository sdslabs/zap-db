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
export interface TokenData {
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
	public addToken(data: TokenData): string {
		const token: string = Session.generateToken();
		this.map[token] = this.tokenFromData(data);
		this.writeMapToPath();
		return token;
	}

	/**
	 * Deletes token from the session.
	 * @param token Token to be revoked.
	 */
	public revokeToken(token: string): void {
		delete this.map[token];
		this.writeMapToPath();
	}

	/**
	 * Extracts all the tokens related to a database
	 * @param database Database name to fetch tokens for
	 */
	public tokensFromDatabase(database: string): string[]{
		const allTokens: any =  JSON.parse(fs.readFileSync(this.path, {
			encoding: "utf8",
			flag: "r"
		}));
		let tokens: string[] = [];
		for (let token in allTokens) {
			if (allTokens[token].database === database) tokens.push(token);
		}
		return tokens;
	}

	/**
	 * Updates token related to a database
	 * @param token Token for a database
	 * @param scopes New scopes for the token
	 */
	public updateToken(token: string, scopes: string[]) : void {
		let tokenData: Token = this.getToken(token);
		tokenData.scopes = scopes as Scopes[];
		this.map[token] = this.tokenFromData(tokenData);
		this.writeMapToPath();
		
	}

	// Returns all tokens
	public getTokens(): TokenMap {
		return this.map;
	}
}
