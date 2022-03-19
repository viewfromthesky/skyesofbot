import { BaseCommandInteraction, Client, Constants } from 'discord.js';
import { SlashCommand } from '../types/Command';
import { openDbConnection } from '../utils/db';

export const SaveBookmark: SlashCommand = {
	name: 'savebookmark',
	description: 'Save something you might want to recall later',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'name',
			description: 'The name of your bookmark (make it relevant so it\'s easy to find later)',
			required: true,
			type: Constants.ApplicationCommandOptionTypes.STRING
		},
		{
			name: 'thing',
			description: 'The thing you\'d like me to save',
			required: true,
			type: Constants.ApplicationCommandOptionTypes.STRING
		}
	],
	run: async(_: Client, interaction: BaseCommandInteraction) => {
		const { options, user } = interaction;
		const bookmarkName = options.get('name')?.value;
		const thingToSave = options.get('thing')?.value;

		const db = openDbConnection();
		const update = db.prepare('INSERT INTO bookmarks (user_id, bookmark_name, data) VALUES (?, ?, ?)').run(user.id, bookmarkName, thingToSave);

		console.log('update', update);

		db.close();

		if(update.changes && update.lastInsertRowid) {
			await interaction.reply({
				ephemeral: true,
				content: `Your bookmark "${bookmarkName}" has been saved. Find bookmarks again with /getbookmark`
			});
		} else {
			await interaction.reply({
				ephemeral: true,
				content: 'There was an error saving your bookmark. Contact [adminName] as they may have broken something.'
			})
		}
	}
}
