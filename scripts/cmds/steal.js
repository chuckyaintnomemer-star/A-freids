module.exports = {
	config: {
		name: "steal",
		version: "1.0",
		author: "Lonely",
		countDown: 5,
		role: 0,
		shortDescription: "Steal a replied message",
		longDescription: "Reply to someone's message and the bot will copy and resend it",
		category: "fun",
		guide: {
			en: "{pn} (reply to a message)"
		}
	},

	onStart: async function ({ api, event }) {
		try {
			if (!event.messageReply) {
				return api.sendMessage("❌ Please reply to a message to steal it.", event.threadID, event.messageID);
			}

			const msg = event.messageReply;

			// If message has attachment
			if (msg.attachments && msg.attachments.length > 0) {
				const attachment = msg.attachments.map(att => att.url);
				return api.sendMessage({
					body: msg.body || "📥 Stolen message:",
					attachment: await Promise.all(
						attachment.map(url => global.utils.getStreamFromURL(url))
					)
				}, event.threadID);
			}

			// If only text
			return api.sendMessage(msg.body || "📥 Stolen message.", event.threadID);

		} catch (err) {
			api.sendMessage("❌ Failed to steal message.", event.threadID, event.messageID);
			console.log(err);
		}
	}
};