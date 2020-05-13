const { start } = require("./parcel");

const main = async () => {
	await start();
};

main().catch(err => {
	throw (err);
});
