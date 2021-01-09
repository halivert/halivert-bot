const URL = require("url-parse");

const { BaseScene, Extra } = require("telegraf");
const { delay } = require("../resources/helpers");

const sceneName = "welcomeTelegram";

const scene = new BaseScene(sceneName);

scene.enter(async (ctx) => {
	ctx.session.stage = sceneName;
	await ctx.reply("Bienvenido/a a Telegram");

	await ctx.replyWithSticker(
		"CAACAgIAAxkBAAIBQl_4-E_VOxCPued721-sMPdzp0CxAALgCAACCLcZApPkOeu87BosHgQ"
		// Vato extendiendo los brazos
	);

	await ctx.replyWithChatAction("typing");
	await delay(1500);
	await ctx.reply("Esto de aquí 👆🏽 es un sticker");

	await ctx.reply(
		'Al tocarlo, aparecerá el "pack de stickers" que puedes agregar junto con este, existen muchos de ellos'
	);

	ctx.reply("Agregalos y envíame uno, anda...\n(O /cancel)");
	ctx.session.step = 1;
});

scene.on("sticker", async (ctx) => {
	if (ctx.session.step === 1) {
		ctx.reply(
			"Vientos, así se hace. Ahora una pregunta, ¿Estás en pc o móvil?",
			Extra.markup((m) =>
				m.inlineKeyboard([
					m.callbackButton("PC", "pcNext"),
					m.callbackButton("Móvil", "mobileNext"),
				])
			)
		);
	} else {
		ctx.reply("Sí sí... ya te ví, sabes mandar stickers, a lo que sigue... :v");
	}

	ctx.session.step = 2;
});

scene.action("mobileNext", async (ctx) => {
	ctx.session.device = "mobile";

	ctx.answerCbQuery();
	await ctx.reply("De acuerdo, ahora videomensajes");
	await ctx.reply(
		"Ahí donde está el micrófono para las notas de voz toca una vez"
	);
	await delay(3000);
	await ctx.reply("¿Ya? cambió a una cámara, ¿verdad?");
	await ctx.reply("Ahora envíame un videomensaje por favor 🙏🏽");

	ctx.session.step = 3;
});

const bye = async (ctx) => {
	await ctx.reply(
		"Intenta escribiendo `@inlineGamesBot` en un mensaje con alguien más",
		Extra.markdown()
	);

	await ctx.reply(
		"Y hasta aquí llega esto, si quieres jugar con alguien puedes hacerlo con mi programador @halivert\n" +
			"También puedes darle sugerencias y decirle si algo salió mal, gracias por platicar"
	);

	ctx.reply("👋🏽");

	ctx.scene.leave();
};

scene.action("pcNext", async (ctx) => {
	ctx.session.device = "pc";

	ctx.answerCbQuery();
	await ctx.reply(
		"Ok, entonces nos saltamos los videomensajes, pero... ¿sabías que puedes llamar a otros bots (cómo yo, pero mejores), para jugar?"
	);

	await bye(ctx);
	ctx.session.step = 4;
});

scene.on("video_note", async (ctx) => {
	if (ctx.session.step === 3) {
		let text = "";
		if (ctx.session.device === "mobile") {
			text = "Así se hace";
		} else {
			text = "¿Qué? ¿Cómo hiciste eso? :O\n En cualquier caso...";
		}

		await ctx.reply(text);
		await ctx.reply(
			"¿Sabías que puedes llamar a otros bots (cómo yo, pero mejores), para jugar?"
		);
		await bye(ctx);
	} else {
		ctx.reply("¿Otro videomensaje? :\\");
	}

	ctx.session.step = 4;
});

scene.on("message", async (ctx) => {
	if (!ctx.message.from.is_bot)
		await ctx.reply(
			"Voy a ignorar todo lo que digas :v continúa con el tutorial..."
		);
});

// scene.on("text", (ctx) => {
// });

module.exports = scene;
