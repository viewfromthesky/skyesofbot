import { BaseCommandInteraction, Client, Constants } from 'discord.js';
import { SlashCommand } from '../types/Command';
import { openDbConnection } from '../utils/db';
import Quote from '../types/Quote';
import { getOperatorName, getMemberName, getMember } from '../utils/helpers';

const DeleteQuote: SlashCommand = {
  name: 'deletequote',
  description: 'Delete a quote you wrote.',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'quote_id',
      description: 'The numeric ID of the quote you want to delete.',
      required: true,
      type: Constants.ApplicationCommandOptionTypes.INTEGER
    }
  ],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const { options, user } = interaction;
    const quoteId = (options.get('quote_id')?.value as number) || 0;

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

        if (update.changes) {
          await interaction.reply({
            ephemeral: true,
            content: `Quote #${quoteId} "${quote.quote_name}" has been successfully removed.`
          });
        } else {
          await interaction.reply({
            ephemeral: true,
            content: `There was an error deleting your quote. Contact ${getOperatorName(
              client
            )} as they may have broken something.`
          });
        }
      } else {
        // Check again to see whether or not a quote exists, regardless of author
        const quoteNoAuthor = db
          .prepare('SELECT * FROM quotes WHERE quote_id = ?')
          .get(quoteId);

        if (quoteNoAuthor) {
          await interaction.reply({
            ephemeral: true,
            content: `While quote #${quoteId} exists, you do not have permission to delete it. Please contact the author of the quote (${getMemberName(
              getMember(client, user.id)
            )})
            or ${getOperatorName(client)} to have it deleted.`
          });
        } else {
          await interaction.reply({
            ephemeral: true,
            content:
              'There is no quote with this ID. Please try a different quote ID to delete.'
          });
        }
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
