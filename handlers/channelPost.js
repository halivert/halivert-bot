const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const URL = require("url-parse");

module.exports = bot => {
	bot.on("channel_post", async ctx => {
		var url;
		const channelPost = ctx.channelPost;
		const chatId = channelPost.chat.id;
		const messageId = channelPost.message_id;
		if (channelPost.entities && channelPost.entities.length === 1) {
			const entity = channelPost.entities[0];
			if (entity.type === "url") {
				url = new URL(ctx.channelPost.text, true);
			}
		}

		if (!url) return;
		if (url.hostname !== "t.me") return;
		if (url.pathname !== "/iv") return;

		const buttonUrl = url.query.url + "#comments";

		const keyboard = Markup.inlineKeyboard([
			Markup.loginButton("Comments", buttonUrl)
		]);

		ctx.telegram.editMessageReplyMarkup(
			chatId,
			messageId,
			null,
			keyboard
		);

		// if (ctx.channelPost.text.toLowerCase() === `@${ctx.me}`.toLowerCase()) {
		// 	const { title, username } = ctx.chat;

		// 	const reply = await ctx.reply(
		// 		`Success. This message will automatically be deleted in 5 seconds.`
		// 	);
		// 	ctx.deleteMessage();

		// 	setTimeout(() => {
		// 		ctx.deleteMessage(reply.message_id);
		// 	}, 5000);
		// }
	});
};
