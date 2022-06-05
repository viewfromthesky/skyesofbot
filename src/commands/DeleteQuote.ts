import { BaseCommandInteraction, Client, Constants } from 'discord.js';
import { SlashCommand } from '../types/Command';
import { openDbConnection } from '../utils/db';
import Quote from '../types/Quote';
import { getOperatorName } from '../utils/helpers';

const DeleteQuote: SlashCommand = {
  name: 'deletequote',
  description: 'Delete a quote you wrote.',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'quote_id',
      description: 'The numeric ID of the quote you want to delete.',
      required: true,
      type: Constants.ApplicationCommandOptionTypes.NUMBER
    }
  ],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const { options, user } = interaction;
    const quoteId = (options.get('id')?.value as number) || 0;

    // 0 is not valid
    if (quoteId) {
      const db = openDbConnection();
      const quote: Quote = db
        .prepare(
          'SELECT * FROM quotes WHERE quote_id = ? AND creator_user_id = ?'
        )
        .get(quoteId, user.id);

      if (quote) {
        const update = db
          .prepare(
            'DELETE FROM quotes WHERE quote_id = ? AND creator_user_id = ?'
          )
          .run(quoteId, user.id);

        if (update.changes && update.lastInsertRowid) {
          await interaction.reply({
            ephemeral: true,
            content: `Your quote "${quote.quote_name}" (ID ${quoteId}) has been successfully removed.`
          });
        }
      } else {
        await interaction.reply({
          ephemeral: true,
          content: `There is no quote with this ID available to delete. This could be either that no quote exists or you do not have permission to delete because you did not create it. If you want this quote removed, either find out who wrote it, or contact ${getOperatorName(
            client
          )} to continue.`
        });
      }

      db.close();
    } else {
      await interaction.reply({
        ephemeral: true,
        content: `Your quote ID is not valid (received "${quoteId}"). Quote IDs are numeric, and non zero.`
      });
    }
  }
};

export default DeleteQuote;
