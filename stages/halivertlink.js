const Markup = require("telegraf/markup");
const URL = require("url-parse");
const Scene = require("telegraf/scenes/base");

const sceneName = "halivertlink";

const scene = new Scene(sceneName);
scene.enter(ctx => {
	ctx.session.stage = sceneName;
	ctx.reply("Envíame la url");
});

scene.command("cancel", ctx => ctx.scene.leave());

scene.on("text", ctx => {
	let url;
	const userMessage = ctx.message;
	if (userMessage.entities && userMessage.entities.length === 1) {
		const entity = userMessage.entities[0];
		if (entity.type === "url") {
			url = new URL(userMessage.text, true);
		}
	}

	if (!url) return ctx.reply("¿Seguro que es una url?");

	ctx.reply(
		`https://t.me/iv?url=${encodeURIComponent(url.href)}&rhash=ff503d2109b312`
	);
	ctx.session.stage = undefined;
	return ctx.scene.leave();
});

module.exports = scene;
