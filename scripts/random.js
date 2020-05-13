const generateRandomString = length => {
	let result = "";
	// Intentionally left out characters that might need escaping (\ and ")
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()-_=+[{]};',./?<>";

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return result;
};

const main = () => {
	const lengthSecret = 64;
	const secret = generateRandomString(lengthSecret);
	console.log(secret);
};

main();
