const { watch } = require("./parcel");

const main = async () => {
	await watch();
};

main().catch(err => {
	throw (err);
});
