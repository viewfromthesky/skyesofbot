import { BaseCommandInteraction, Client, Constants } from 'discord.js';
import { SlashCommand } from '../types/Command';
import { openDbConnection } from '../utils/db';
import { getOperatorName } from '../utils/helpers';

const bookmarkNameMaxLength = 1024;
const bookmarkContentMaxLength = 2048;

export const SaveBookmark: SlashCommand = {
	name: 'savebookmark',
	description: 'Save something you might want to recall later',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'name',
			description: 'The name of your bookmark (make it relevant so it\'s easy to find later). 1024 character limit.',
			required: true,
			type: Constants.ApplicationCommandOptionTypes.STRING
		},
		{
			name: 'content',
			description: 'The thing you\'d like me to save. 2048 character limit.',
			required: true,
			type: Constants.ApplicationCommandOptionTypes.STRING
		}
	],
	run: async(client: Client, interaction: BaseCommandInteraction) => {
		const { options, user } = interaction;
		const bookmarkName = options.get('name')?.value as string || '';
		const bookmarkContent = options.get('content')?.value as string || '';

		// Ensure the user isn't going to hit the column data size limits before submitting
		if(bookmarkName.length <= bookmarkNameMaxLength && bookmarkContent.length <= bookmarkContentMaxLength) {
			const db = openDbConnection();

			// Find out if the user has less than 25 bookmarks first (apparently this is a limit Discord places on the select menu)
			const { c: numberOfBookmarks }: { c: number} = db.prepare('SELECT COUNT(*) AS c FROM bookmarks WHERE user_id = ?').get(user.id);

			if(numberOfBookmarks < 25) {
				const update = db.prepare('INSERT INTO bookmarks (user_id, bookmark_name, data) VALUES (?, ?, ?)').run(user.id, bookmarkName, bookmarkContent);

				if(update.changes && update.lastInsertRowid) {
					await interaction.reply({
						ephemeral: true,
						content: `Your bookmark "${bookmarkName}" has been saved. Find bookmarks again with \`/getbookmark\``
					});
				} else {
					await interaction.reply({
						ephemeral: true,
						content: `There was an error saving your bookmark. Contact ${getOperatorName(client)} as they may have broken something.`
					})
				}
			} else {
				await interaction.reply({
					ephemeral: true,
					content: '**Cannot add new bookmark**; you already have 25 bookmarks saved.\n\nUnfortunately Discord limits the number of options you can have in a select menu, so I will need a new interface to work this problem out. For now, you can delete a bookmark using the \`/getbookmark\` command.'
				})
			}

			db.close();
		} else {
			await interaction.reply({
				ephemeral: true,
				content: `Content too long, please reduce the length of either your bookmark name or content.\n\nBookmark name length: ${bookmarkName.length}/${bookmarkNameMaxLength} characters\nBookmark content length: ${bookmarkContent.length}/${bookmarkContentMaxLength} characters`
			})
		}
	}
}
