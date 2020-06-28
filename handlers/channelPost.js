const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const URL = require("url-parse");

const convertUrl = url => {
	const newUrl = new URL(url, true);

	if (!newUrl) return undefined;

	return `https://t.me/iv?url=${encodeURIComponent(
		newUrl
	)}&rhash=ff503d2109b312`;
};

module.exports = bot => {
	bot.on("channel_post", ctx => {
		let url;
		const channelPost = ctx.channelPost;
		const chatId = channelPost.chat.id;
		const messageId = channelPost.message_id;
		let resultMessage = undefined;
		if (channelPost.entities) {
			resultMessage = channelPost.entities.reduce((resultMessage, entity) => {
				if (entity.type === "url") {
					let start = entity.offset;
					let end = entity.offset + entity.length;
					url = new URL(channelPost.text.substring(start, end), true);
					if (!url) return resultMessage;
					if (url.hostname !== "halivert.dev") return resultMessage;

					return resultMessage.replace(url.href, convertUrl(url.href));
				}
			}, channelPost.text);
		}

		if (resultMessage && resultMessage !== channelPost.text)
			ctx.telegram.editMessageText(chatId, messageId, null, resultMessage);
	});
};
