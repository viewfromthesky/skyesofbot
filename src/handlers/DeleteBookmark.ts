import { Client, ButtonInteraction } from 'discord.js';
import { ButtonHandler } from '../types/MessageComponentHandler';
import { openDbConnection } from '../utils/db';

export const DeleteBookmark: ButtonHandler = {
	handlerName: 'DeleteBookmark',
	run: async(_: Client, interaction: ButtonInteraction) => {
		const db = openDbConnection();

		const [, bookmarkId] = interaction.customId.split('-');
		const bookmark: { bookmark_name: string } = db
			.prepare('SELECT bookmark_name FROM bookmarks WHERE bookmark_id = ?')
			.get(bookmarkId);

		// In case the user attempts to use the delete button for a missing bookmark
		if(bookmark)
		{
			const update = db
				.prepare('DELETE FROM bookmarks WHERE bookmark_id = ?')
				.run(bookmarkId);

			if(update.changes > 0) {
				await interaction.reply({
					content: `Your bookmark "${bookmark.bookmark_name} has been deleted.`
				});
			}
		} else {
			// TODO: Update with admin user name (add ADMIN_ID to .env)
			await interaction.reply({
				content: 'There was an issue deleting your bookmark; please try again later or contact [adminName] for help.'
			});
		}

		db.close();
	}
}
