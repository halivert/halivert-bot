const Telegraf = require("telegraf");
const express = require("express");
const path = require("path");

const Extra = require("telegraf/extra");

const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const { leave } = Stage;

const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "https://halivert-bot.herokuapp.com";

const handlers = ["channelPost"];
const commands = [];
const stages = ["halivertlink"];

const bot = new Telegraf(BOT_TOKEN);

const stage = new Stage();
stage.command("cancel", (ctx) => {
	leave();
	if (ctx.session.stage) {
		ctx.session.stage = undefined;
		return ctx.reply(
			"¡Cancelado!",
			Extra.markup((m) => m.removeKeyboard())
		);
	}

	return ctx.reply(
		"No estaba haciendo nada...",
		Extra.markup((m) => m.removeKeyboard())
	);
});

bot.use(session());
bot.use(stage.middleware());

stages.forEach((stageName) => {
	stage.register(require(`./stages/${stageName}`));
	bot.command(stageName, (ctx) => ctx.scene.enter(stageName));
});

bot.on("sticker", (ctx) => ctx.reply("👍🏽"));

handlers.forEach((handler) => require(`./handlers/${handler}`)(bot));

commands.forEach((command) =>
	bot.command(command, require(`./commands/${command}`))
);

const app = express();

if (process.env.APP_ENV === "local") bot.launch();
else {
	bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
	app.use(bot.webhookCallback(`/bot${BOT_TOKEN}`));
}

app
	.use(express.static(path.join(__dirname, "public")))
	.use(function(req, res) {
		res.status(404);
		res.sendFile(path.join(__dirname, "public/404.html"));
	})
	.listen(PORT);
