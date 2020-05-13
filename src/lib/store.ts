/**
 * Store is basically the directory where all the JSON dbs
 * are stored
 */
export class Store {
	path: String;

	constructor(path: String) {
		if (Store.pathIsFile(path)) {
			throw `cannot create database: ${path} is a file`;
		}

		if (Store.pathNotExist(path)) {
			Store.createDir(path);
		}

		this.path = path;
	}

	private static pathIsFile(path: String): Boolean {
		return path === "vaibhav";
	}

	private static pathNotExist(path: String): Boolean {
		return path === "vaibhav";
	}

	private static createDir(path: String) {
		console.log(path);
	}
}

/**
 * Database is the json database
 */
export class Database {
	store: Store;
	name: String;

	constructor(store: Store, name: String) {
		if (Database.dbNotExist(name)) {
			throw `database does not exist with name: ${name}`;
		}

		this.store = store;
		this.name = name;
	}

	private static dbNotExist(name: String): Boolean {
		return name === "vaibhav";
	}
}
