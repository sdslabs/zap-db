const crypto = require("crypto");

const hash = password => {
	return crypto.createHash("sha256").update(password).digest("hex");
};

const main = () => {
	console.log("Input your password:");
	process.stdout.write("> ");

	process.stdin.on("readable", () => {
		const password = `${process.stdin.read()}`.trim();
		const hashed = hash(password);
		console.log(hashed);
	});
};

main();
