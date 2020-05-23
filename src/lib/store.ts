import fs from "fs";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

/**
 * Store is basically the directory where all the JSON dbs
 * are stored
 */
export class Store {
	private path: string;

	constructor(path: string) {
		if (Store.pathIsFile(path)) {
			throw `cannot create database: ${path} is a file`;
		}

		if (Store.pathNotExist(path)) {
			Store.createDir(path);
		}

		this.path = path;
	}

	/**
	 * Returns the path to the database store.
	 */
	public getStorePath(): string {
		return this.path;
	}

	private static pathIsFile(path: string): boolean {
		return (
			fs.existsSync(path) && fs.lstatSync(path).isFile()
		);
	}

	private static pathNotExist(path: string): boolean {
		return !fs.existsSync(path);
	}

	private static createDir(path: string) {
		try {
			fs.mkdirSync(path, { recursive: true });
		} catch (err) {
			throw `Caught in error, ${err.code}`;
		}
	}

	/**
	 * Creates a new database.
	 * @param name Name of the database to create
	 */
	public createDB(name: string) {
		fs.open(`${this.path}/${name}.json`, "w", (err) => {
			if (err) throw err;
			let adapter = low(new FileSync(`${this.path}/${name}.json`));
			adapter.defaults({}).write();
		});
	}

	/**
	 * Returns a database instance.
	 * @param name Name of the database
	 */
	public getDB(name: string): Database {
		return new Database(this, name);
	}
}

/**
 * Database is the json database
 */
export class Database {
	private store: Store;
	private name: string;
	private adapter: low.LowdbSync<any>;

	constructor(store: Store, name: string) {
		if (Database.dbNotExist(store, name)) {
			throw `database does not exist with name: ${name}`;
		}

		this.store = store;
		this.name = name;
		this.adapter = low(new FileSync(`${store.getStorePath()}/${name}.json`));
	}

	/**
	 * Gets the store of the database.
	 */
	public getDBStore(): Store {
		return this.store;
	}

	/**
	 * Gets the name of the database.
	 */
	public getDBName(): string {
		return this.name;
	}

	private static dbNotExist(store: Store, name: string): boolean {
		const dbs = fs.readdirSync(store.getStorePath());
		if (dbs.filter(db => db === `${name}.json`).length > 0) return false;
		else return true;
	}

	/**
	 * Writes to the database.
	 * @param object Anthing
	 */
	public write(object: any) {
		this.adapter.defaults(object).write();
	}

	/**
	 * Get data from database.
	 * @param key Key to get from the database
	 */
	public get(key: string | void): object {
		if (key) {
			if (this.adapter.has(key).value())
				return this.adapter.get(key).cloneDeep().value();
			else throw `no such key exists: ${key}`;
		}
		else return this.adapter.read().value();
	}

	/**
	 * Update data into database.
	 * @param key Key to update
	 * @param object Updated object
	 */
	public update(key: string, object: any) {
		this.adapter.set(key, object).write();
	}
}
