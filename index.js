const Telegraf = require("telegraf");
const express = require("express");
const path = require("path");

const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 5000;
const BOT_PORT = process.env.BOT_PORT || 3000;
const URL = process.env.URL || "https://halivert-bot.herokuapp.com";

const bot = new Telegraf(BOT_TOKEN);
bot.start(ctx => ctx.reply("Welcome"));
bot.help(ctx => ctx.reply("Send me a sticker"));
bot.on("sticker", ctx => ctx.reply("👍"));
bot.hears("hi", ctx => ctx.reply("Hey there"));

bot.command("oldschool", ctx => ctx.reply("Hello"));
bot.command("modern", ({ reply }) => reply("Yo"));
bot.command("hipster", Telegraf.reply("λ"));

const unless = function(path, middleware) {
	return function(req, res, next) {
		if (path === req.path) {
			return next();
		} else {
			return middleware(req, res, next);
		}
	};
};

// express()
// 	.use(express.static(path.join(__dirname, "public")))
// 	.listen(PORT);

bot.launch({
	webhook: {
		domain: URL,
		port: BOT_PORT
	}
});

