import { Client, ButtonInteraction } from 'discord.js';
import { ButtonHandler } from '../types/MessageComponentHandler';
import { openDbConnection } from '../utils/db';

export const SendBookmarkToChannel: ButtonHandler = {
	handlerName: 'SendBookmarkToChannel',
	run: async(_: Client, interaction: ButtonInteraction) => {
		const db = openDbConnection();

		const [, bookmarkId] = interaction.customId.split('-');
		const bookmarkData: { data: string } = db
			.prepare('SELECT data FROM bookmarks WHERE bookmark_id = ?')
			.get(bookmarkId);

		await interaction.reply({
			content: bookmarkData.data
		});
	}
};
