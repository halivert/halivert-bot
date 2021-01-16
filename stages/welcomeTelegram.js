const { BaseScene, Extra } = require("telegraf");
const { delay } = require("../resources/helpers");

const sceneName = "welcomeTelegram";

const scene = new BaseScene(sceneName);

const typing = async (ctx, ms) => {
	await ctx.replyWithChatAction("typing");
	await delay(ms || 1250);
};

const steps = [
	// Paso 0
	async (ctx) => {
		await ctx.replyWithSticker(
			// Vato extendiendo los brazos
			"CAACAgIAAxkBAAIBQl_4-E_VOxCPued721-sMPdzp0CxAALgCAACCLcZApPkOeu87BosHgQ"
		);

		await ctx.reply("Esto de aquí 👆🏽 es un *sticker*", Extra.markdown());

		await typing(ctx);
		await ctx.reply(
			'Al tocarlo, aparecerá el "pack de stickers" que puedes agregar junto ' +
				"con este, existen muchos de ellos"
		);

		ctx.reply("Agregalos y envíame uno, anda...");

		ctx.session.step = 1;
	},
	// Paso 1
	async (ctx) => {
		ctx.reply(
			"¿Estás en pc o móvil?",
			Extra.markup((m) =>
				m.inlineKeyboard([
					m.callbackButton("PC", "pcNext"),
					m.callbackButton("Móvil", "mobileNext"),
				])
			)
		);

		ctx.session.step = 2;
	},
	// Paso 2
	async (ctx) => {
		await ctx.reply("De acuerdo, ahora *videomensajes*", Extra.markdown());
		await ctx.reply(
			"Ahí donde está el micrófono para las notas de voz toca una vez"
		);

		await typing(ctx, 3000);
		await ctx.reply("¿Ya? cambió a una cámara, ¿verdad?");
		ctx.reply("Ahora envíame un videomensaje por favor 🙏🏽");

		ctx.session.step = 3;
	},
	// Paso 3
	async (ctx) => {
		await ctx.reply("¿Sabías que puedes *editar mensajes*?", Extra.markdown());

		ctx.reply("Mira, escribe algo...");

		ctx.session.step = 4;
	},
	// Paso 4
	async (ctx) => {
		if (ctx.from && ctx.from.username) {
			await ctx.reply(
				"Pero ya tienes nombre de usuario... creo que vas " +
					"en el siguiente paso..."
			);

			return steps[5](ctx);
		}

		await ctx.reply(
			"Deberías utilizar un *nombre de usuario* para que las " +
				"personas puedan identificarte sin necesidad de tener tu celular",
			Extra.markdown()
		);

		ctx.reply(
			"En ajustes aparece la opción de nombre de usuario, ve a ponerlo ;) y " +
				"cuando vuelvas escribe /listo"
		);

		ctx.session.step = 5;
	},
	// Paso 5
	async (ctx) => {
		ctx.reply(
			"*Fijar mensajes*\n" +
				`Esta función sirve para tener los mensajes más importantes hasta ` +
				`arriba. Mira ${ctx.session.action} en un mensaje y selecciona ` +
				"*fijar mensaje* y marca la casilla, para poder darme cuenta",
			Extra.markdown()
		);

		ctx.session.step = 6;
	},
	// Step 6
	async (ctx) => {
		await ctx.reply(
			"También puedes *eliminar mensajes* " +
				"Y no aparecerá un molesto: _Este mensaje ha sido eliminado_ " +
				"¿Quién haría algo así de horrible?... 🙄",
			Extra.markdown()
		);

		await typing(ctx);
		ctx.reply(
			`Inténtalo, ${ctx.session.action} en un mensaje y selecciona eliminar ` +
				"mensaje _(Cuando estés en un chat con una persona real, tendrás que " +
				"marcar la casilla para eliminar el mensaje también para esa persona)_",
			Extra.markdown().markup((m) =>
				m.inlineKeyboard([m.callbackButton("Listo", "onStep6")])
			)
		);

		ctx.session.step = 7;
	},
	// Paso 7
	async (ctx) => {
		await ctx.reply(
			"*Programar mensajes* y *Enviar en silencio*",
			Extra.markdown()
		);

		let action =
			ctx.session.device === "mobile"
				? "mantén presionado"
				: "da click secundario en";

		await typing(ctx);
		ctx.reply(
			`Escribe algo y no lo envíes aún, cuando termines ${action} el botón ` +
				"de enviar y saldrán estas dos opciones; vamos, programa un mensaje " +
				"y envía otro en silencio en este chat"
		);

		ctx.session.step = 8;
	},
];

scene.enter(async (ctx) => {
	let user = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
	ctx.telegram.sendMessage(process.env.ADMIN_ID, `Me habla ${user}`);

	ctx.session.stage = sceneName;
	ctx.session.step = 0;

	await ctx.reply("Bienvenido/a a Telegram");

	await steps[0](ctx);

	await ctx.reply(
		"_O... Si ya has avanzado, escribe /step y el paso en el que vas e.g._",
		Extra.markdown()
	);

	ctx.reply("/step 4");
});

const bye = async (ctx) => {
	await typing(ctx);
	await ctx.reply(
		"Y hasta aquí llega esto\n" +
			`${ctx.session.step} pasos para iniciar en Telegram\n` +
			"Puedes enviarme sugerencias a @halivert y también decirme si algo " +
			"salió mal. Gracias por platicar"
	);

	await ctx.reply("👋🏽");

	let channel =
		ctx.session.device === "mobile"
			? "https://t.me/AndroidThemes"
			: "https://t.me/themes";

	ctx.reply(`P.D. checa este canal de temas ${channel}`);

	return ctx.scene.leave();
};

scene.on("sticker", async (ctx) => {
	if (ctx.session.step < 1) return;

	if (ctx.session.step > 1) {
		return ctx.reply(
			"Sí sí... ya te ví, sabes mandar stickers, a lo que sigue... :v"
		);
	}

	await ctx.reply("Vientos, así se hace. Ahora una pregunta");

	await steps[1](ctx);
});

scene.action("mobileNext", async (ctx) => {
	ctx.answerCbQuery();

	if (!ctx.session.device) {
		ctx.session.device = "mobile";
		ctx.session.action = "toca";

		if (ctx.session.step < steps.length) await steps[ctx.session.step](ctx);
	}
});

scene.action("pcNext", async (ctx) => {
	ctx.answerCbQuery();

	if (!ctx.session.device) {
		ctx.session.device = "pc";
		ctx.session.action = "da click secundario";

		if (ctx.session.step === 2) {
			await ctx.reply("Ok, entonces nos saltamos los videomensajes, pero...");
			ctx.session.step = 3;
		}

		if (ctx.session.step < steps.length) await steps[ctx.session.step](ctx);
	}
});

scene.action("onStep6", async (ctx) => {
	ctx.answerCbQuery();

	if (ctx.session.step === 7) {
		await ctx.reply(
			"Vale vale, ahora hay otras dos cosas que pueden modificar " +
				"los mensajes que envías"
		);

		await steps[7](ctx);
	}
});

scene.on("video_note", async (ctx) => {
	if (ctx.session.step < 3) return;

	if (ctx.session.step > 3) {
		return ctx.reply("¿Otro videomensaje? :\\");
	}

	let text = "";
	if (ctx.session.device === "mobile") {
		text = "Así se hace";
	} else {
		text = "¿Qué? ¿Cómo hiciste eso? :O\n En cualquier caso...";
	}

	await ctx.reply(text);

	await steps[3](ctx);
});

scene.on("edited_message", async (ctx) => {
	if (ctx.session.step !== 4) return;

	await ctx.reply("Perfecto, que más... 🤔\n¡Ya sé! 💡");

	if (ctx.from && !ctx.from.username) {
		await steps[4](ctx);
	} else {
		await ctx.reply(
			"¡Oh! Te iba a decir que eligieras un nombre de usuario pero ya lo " +
				"tienes, muy bien, entonces sigue"
		);

		await typing(ctx, 2000);
		await steps[5](ctx);
	}
});

scene.command("listo", async (ctx) => {
	if (ctx.session.step < 5) return;

	if (ctx.session.step > 5) {
		return ctx.reply("Ya me habías dicho 🙄");
	}

	if (ctx.from.username) {
		await ctx.reply(`Muy bien ${ctx.from.username} 👍🏽`);

		await typing(ctx, 2000);
		await ctx.reply(
			"Otras funciones que me gustan de Telegram es que puedes " +
				"fijar mensajes en un chat"
		);
	} else {
		await ctx.reply(
			"¿De verdad lo hiciste? hum... 🤔 pero bueno... continuemos"
		);
	}

	return await steps[5](ctx);
});

scene.on("pinned_message", async (ctx) => {
	if (ctx.session.step !== 6) return;

	await ctx.reply("Excelente 😌");

	return await steps[6](ctx);
});

scene.command("step", async (ctx) => {
	ctx.session.device = undefined;
	ctx.session.step = 0;

	if (ctx.message && ctx.message.text) {
		let second = ctx.message.text.split(" ")[1];
		let secondNumber = parseInt(second, 10);

		if (isNaN(secondNumber)) {
			return ctx.reply(
				`¿Te parece que \`${second || ""}\` es un número? 😠`,
				Extra.markdown()
			);
		}

		if (secondNumber >= steps.length) {
			return ctx.reply("Espera un momento... ¿enserio ese paso existe? 🧐");
		}

		ctx.session.step = secondNumber;

		if (secondNumber === steps.length) {
			await ctx.reply(
				"¡Ups!, todavía no he acabado ese paso 😅, pero vuelve pronto"
			);

			return ctx.scene.leave();
		}

		if (secondNumber > 1) {
			return await ctx.reply(
				"Por favor recuerdame, ¿estás en pc o móvil?",
				Extra.markup((m) =>
					m.inlineKeyboard([
						m.callbackButton("PC", "pcNext"),
						m.callbackButton("Móvil", "mobileNext"),
					])
				)
			);
		}

		return await steps[secondNumber](ctx);
	}
});

scene.on("message", async (ctx) => {
	if (ctx.session.step === 4) {
		await ctx.reply(
			`Muy bien, ahora ${ctx.session.action} en el mensaje que escribiste`
		);

		await typing(ctx);
		return ctx.reply(
			"Aparecerá un menú y una de las opciones es *editar*\nAhora edita el " +
				"mensaje",
			Extra.markdown()
		);
	}

	if (ctx.session.step === 8) {
		await ctx.reply(
			"Voy a suponer que lo enviaste en silencio (no lo puedo saber 🤨) así " +
				"que, ¡qué bien!"
		);

		return bye(ctx);
	}

	if (!ctx.from.is_bot) {
		await ctx.reply(
			"Voy a ignorar todo lo que digas :v continúa con el tutorial..."
		);

		await steps[ctx.session.step - 1](ctx);
	}
});

scene.leave(async (ctx) => {
	let step = Math.floor(ctx.session.step);

	ctx.session = {};

	if (step !== steps.length) {
		if (step > 1) {
			await ctx.reply(
				"Vale, vale, pero recuerda que vas en el paso: " + (step - 1)
			);
		} else {
			await ctx.reply("Cancelado");
		}

		ctx.reply("👋🏽");
	}
});

module.exports = scene;
