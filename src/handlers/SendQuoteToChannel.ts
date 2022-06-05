import { Client, ButtonInteraction } from 'discord.js';
import { ButtonHandler } from '../types/MessageComponentHandler';
import { openDbConnection } from '../utils/db';
import Quote from '../types/Quote';
import { buildQuote, getOperatorName } from '../utils/helpers';

const SendQuoteToChannel: ButtonHandler = {
  handlerName: 'SendQuoteToChannel',
  run: async (client: Client, interaction: ButtonInteraction) => {
    const db = openDbConnection();

    const [, quoteId] = interaction.customId.split('-');
    const quote: Quote = db
      .prepare('SELECT * FROM quotes WHERE quote_id = ?')
      .get(quoteId);

    db.close();

    if (quote) {
      await interaction.reply({
        content: buildQuote(quote)
      });
    } else {
      // It's possible that the quote was deleted before it could be retrieved from the database
      await interaction.reply({
        ephemeral: true,
        content: `Quote #${quoteId} could not be found. Please ensure the quote still exists. Please contact ${getOperatorName(
          client
        )} if this problem persists.`
      });
    }
  }
};

export default SendQuoteToChannel;
