const Markup = require("telegraf/markup");
const URL = require("url-parse");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const { leave } = Stage;

const scene = new Scene("halivertlink");
scene.enter(ctx => {
	ctx.reply("Envíame la url");
});

// scene.command("cancel", ctx => leave());

scene.on("text", ctx => {
	var url;
	const userMessage = ctx.message;
	if (userMessage.entities && userMessage.entities.length === 1) {
		const entity = userMessage.entities[0];
		if (entity.type === "url") {
			let start = entity.offset;
			let end = entity.offset + entity.length;
			url = new URL(userMessage.text.substring(start, end), true);
		}
	}

	if (!url) ctx.reply("¿Seguro que es una url?");

	ctx.reply(`https://t.me/iv?url=${encodeURI(url)}&rhash=ff503d2109b312`);
});

module.exports = scene;
