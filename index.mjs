import dotenv from "dotenv";
import { Telegraf, Markup, Scenes, session } from "telegraf";
import express from "express";
import path from "path";
import renderFiles from "./renderFiles.mjs";
import { __dirname } from "./resources/helpers.mjs";

const { Stage } = Scenes;

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || "https://halivert-bot.herokuapp.com";

const handlers = ["channelPost.mjs"];
const commands = [];
const stages = ["halivertlink.mjs"];

const bot = new Telegraf(BOT_TOKEN);

const stage = new Stage();
stage.command("cancel", (ctx) => {
	if (ctx.session?.stage) {
		ctx.session.stage = undefined;
		return ctx.scene.leave();
	}

	return ctx.reply("No estaba haciendo nada...", Markup.removeKeyboard());
});

bot.use(session());
bot.use(stage.middleware());

stages.forEach(async (stageName) => {
	stage.register((await import(`./stages/${stageName}`)).default);
	bot.command(stageName, (ctx) => ctx.scene.enter(stageName));
});

(async () => {
	stage.register((await import("./stages/welcomeTelegram.mjs")).default);
})();

bot.on("sticker", (ctx) => ctx.reply("👍🏽"));

handlers.forEach(async (handler) =>
	(await import(`./handlers/${handler}`)).default(bot)
);

commands.forEach(async (command) =>
	bot.command(command, await import(`./commands/${command}`))
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

renderFiles({
	bot: await bot.telegram.getMe(),
});

app
	.use(express.static(path.join(__dirname, "public")))
	.use(function (req, res) {
		res.status(404);
		res.sendFile(path.join(__dirname, "public/404.html"));
	})
	.listen(PORT, () => console.log(`Listening on ${PORT}`));
