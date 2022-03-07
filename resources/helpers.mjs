import path from "path";

export function delay(ms) {
	return new Promise((resolve) => {
		return setTimeout(resolve, ms);
	});
}

export const __dirname = path.resolve();

export default { delay, __dirname };
