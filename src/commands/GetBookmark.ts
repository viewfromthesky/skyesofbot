import { BaseCommandInteraction, Client, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { SlashCommand } from '../types/Command';
import { openDbConnection } from '../utils/db';
import Bookmark from '../types/Bookmark';

export const GetBookmark: SlashCommand = {
	name: 'getbookmark',
	description: 'Find a bookmark you saved',
	type: 'CHAT_INPUT',
	run: async(_: Client, interaction: BaseCommandInteraction) => {
		const { user: { id: userId } } = interaction;
		const db = openDbConnection();
		const bookmarks: Bookmark[] = db
			.prepare('SELECT bookmark_id, bookmark_name, data FROM bookmarks WHERE user_id = ?')
			.all(userId);

		await interaction.reply({
			ephemeral: true,
			content: 'You\'ve saved the following bookmarks:',
			components: [
				new MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
							.setCustomId('GetBookmark')
							.setPlaceholder('Pick a bookmark')
							.addOptions(bookmarks
								.map((bookmark) =>
									({
										label: bookmark.bookmark_name,
										description: bookmark.data,
										value: `${bookmark.bookmark_id}`
									})
								)
							)
					)
			]
		})
	}
}
