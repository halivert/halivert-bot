export function delay(ms) {
	return new Promise((resolve) => {
		return setTimeout(resolve, ms);
	});
}

export default { delay };
