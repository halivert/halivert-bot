const Telegraf = require("telegraf");
const express = require("express");
const path = require("path");

const { Extra, session, Stage } = Telegraf;

const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "https://halivert-bot.herokuapp.com";

const handlers = ["channelPost"];
const commands = [];
const stages = ["halivertlink"];

const bot = new Telegraf(BOT_TOKEN);

const stage = new Stage();
stage.command("cancel", (ctx) => {
	if (ctx.session.stage) {
		ctx.session.stage = undefined;
		return ctx.scene.leave();
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

stage.register(require("./stages/welcomeTelegram"));

bot.on("sticker", (ctx) => ctx.reply("👍🏽"));

handlers.forEach((handler) => require(`./handlers/${handler}`)(bot));

commands.forEach((command) =>
	bot.command(command, require(`./commands/${command}`))
);

bot.command("start", (ctx) => ctx.scene.enter("welcomeTelegram"));

bot.on("message", (ctx) => {
	if (ctx.message.text && ctx.message.text.toLowerCase() === "hola") {
		ctx.scene.enter("welcomeTelegram");
	}
});

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
