const { build } = require("./parcel");

const main = async () => {
	await build();
};

main().catch(err => {
	throw (err);
});
