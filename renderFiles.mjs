import Mustache from "mustache";
import path from "path";
import fs from "fs";
import glob from "glob";

const __dirname = path.resolve();

export default (data = {}) => {
	const publicPath = path.join(__dirname, "public");
	const viewsPath = path.join(__dirname, "views");

	const publicFiles = glob.sync(path.join(publicPath, "**/*.html"));
	const viewFiles = glob.sync(path.join(viewsPath, "**/*.html"));

	publicFiles.forEach((file) => {
		fs.rmSync(file);
	});

	viewFiles.forEach((view) => {
		const content = Mustache.render(fs.readFileSync(view, "utf-8"), data);

		fs.writeFileSync(
			path.join(publicPath, path.basename(view)),
			content,
			"utf-8"
		);
	});
};
