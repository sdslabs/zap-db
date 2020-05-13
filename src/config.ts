import config from "../config.json";

/**
 * Represents the application config
 */
export interface Config {
	// Whether to run in debug mode
	debug: Boolean,

	// Port to run the application on
	port: Number,

	// Secret of the app to sign tokens with
	secret: String,

	// sha256 of the password for admin
	password: String,

	// Path where the database store lies
	store: String,
}

/**
 * Returns the application config from default path, i.e.,
 * the `<root>/config.json`
 */
export default () => {
	const appConfig: Config = {
		debug: config.debug || false,
		port: config.port || 3000,
		secret: config.secret,
		password: config.password,
		store: config.store,
	};

	return appConfig;
};
