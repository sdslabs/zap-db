import config from "../config.json";

/**
 * Represents the application config
 */
export interface Config {
	// Whether to run in debug mode
	debug: boolean,

	// Port to run the application on
	port: number,

	// JSON file to store the tokens in
	session: string,

	// sha256 of the password for admin
	password: string,

	// Path where the database store lies
	store: string,
}

/**
 * Returns the application config from default path, i.e.,
 * the `<root>/config.json`
 */
export default () => {
	const appConfig: Config = {
		debug: config.debug || false,
		port: config.port || 3000,
		session: config.session,
		password: config.password,
		store: config.store,
	};

	return appConfig;
};
