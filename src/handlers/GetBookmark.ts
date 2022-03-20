import {
  Client,
  MessageActionRow,
  MessageButton,
  SelectMenuInteraction
} from 'discord.js';
import { SelectMenuHandler } from '../types/MessageComponentHandler';
import { openDbConnection } from '../utils/db';
import Bookmark from '../types/Bookmark';

export const GetBookmark: SelectMenuHandler = {
  handlerName: 'GetBookmark',
  run: async (_: Client, interaction: SelectMenuInteraction) => {
    const db = openDbConnection();

    const [bookmarkId] = interaction.values;
    const bookmark: Bookmark = db
      .prepare(
        'SELECT bookmark_name, data FROM bookmarks WHERE bookmark_id = ?'
      )
      .get(bookmarkId);

    db.close();

    await interaction.reply({
      ephemeral: true,
      content: `You selected "${bookmark.bookmark_name}". What would you like to do?\n\nContent: ${bookmark.data}`,
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId(`SendBookmarkToChannel-${bookmarkId}`)
            .setLabel('Send to channel')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId(`DeleteBookmark-${bookmarkId}`)
            .setLabel('Delete bookmark')
            .setStyle('DANGER')
        )
      ]
    });
  }
};
