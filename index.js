const Telegraf = require("telegraf");
const express = require("express");
const path = require("path");

const handlers = ["channelPost"];

const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "https://halivert-bot.herokuapp.com";

const bot = new Telegraf(BOT_TOKEN, {
	channelMode: false
});

bot.start(ctx => ctx.reply("Welcome"));
bot.help(ctx => ctx.reply("Send me a sticker"));
bot.on("sticker", ctx => ctx.reply("👍"));
bot.hears("hi", ctx => ctx.reply("Hey there"));

handlers.forEach(handler => require(`./handlers/${handler}`)(bot));

bot.command("oldschool", ctx => ctx.reply("Hello"));
bot.command("modern", ({ reply }) => reply("Yo"));
bot.command("hipster", Telegraf.reply("λ"));

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

// bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);

// express()
// 	.use(bot.webhookCallback(`/bot${BOT_TOKEN}`))
// 	.use(express.static(path.join(__dirname, "public")))
// 	.use(function(req, res) {
// 		res.status(404);
// 		res.sendFile(path.join(__dirname, "public/404.html"));
// 	})
// 	.listen(PORT);
