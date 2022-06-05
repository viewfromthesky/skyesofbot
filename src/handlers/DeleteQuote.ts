import { Client, ButtonInteraction } from 'discord.js';
import { ButtonHandler } from '../types/MessageComponentHandler';
import { openDbConnection } from '../utils/db';
import { getOperatorName, getMember, getMemberName } from '../utils/helpers';
import Quote from '../types/Quote';

const DeleteQuote: ButtonHandler = {
  handlerName: 'DeleteQuote',
  run: async (client: Client, interaction: ButtonInteraction) => {
    const db = openDbConnection();

    const [, quoteId, userId] = interaction.customId.split('-');
    const quote: Quote = db
      .prepare('SELECT * FROM quotes WHERE quote_id = ?')
      .get(quoteId);
    const { OPERATOR_ID } = process.env;

    console.log({
      userId,
      OPERATOR_ID
    });

    if (quote) {
      // check first that this quote was created by the requesting user
      if (
        userId &&
        (userId === quote.creator_user_id || userId === OPERATOR_ID)
      ) {
        const update = db
          .prepare(
            'DELETE FROM quotes WHERE quote_id = ? AND creator_user_id = ?'
          )
          .run(quoteId, userId);

        if (update.changes) {
          await interaction.reply({
            ephemeral: true,
            content: `Quote #${quoteId} has been successfully deleted.`
          });
        } else {
          // Something went wrong, let an operator know
          await interaction.reply({
            ephemeral: true,
            content: `Something went wrong when trying to delete quote #${quoteId}. Please let ${getOperatorName(
              client
            )} know, as something may be broken.`
          });
        }
      } else {
        const authorName = getMemberName(
          getMember(client, quote.creator_user_id)
        );
        // This user does not have permission to delete
        await interaction.reply({
          ephemeral: true,
          content: `You do not have permission to delete quote #${quoteId}. Please either contact the quote author ${
            authorName ? `(${authorName}) ` : ''
          }or ${getOperatorName(client)} in order to delete this quote.`
        });
      }
    } else {
      // The quote no longer exists
      await interaction.reply({
        ephemeral: true,
        content: `Quote #${quoteId} could not be deleted because it no longer exists.`
      });
    }
  }
};

export default DeleteQuote;
