import {
  BaseCommandInteraction,
  Client,
  Constants,
  MessageActionRow,
  MessageButton
} from 'discord.js';
import { SlashCommand } from '../types/Command';
import { openDbConnection } from '../utils/db';
import Quote from '../types/Quote';

const GetQuote: SlashCommand = {
  name: 'getquote',
  description: "Get a quote using it's numeric ID.",
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'quote_id',
      description: "The numeric ID of the quote you'd like to print.",
      required: true,
      type: Constants.ApplicationCommandOptionTypes.INTEGER
    }
  ],
  run: async (_: Client, interaction: BaseCommandInteraction) => {
    const { options, user } = interaction;
    const quoteId = (options.get('quote_id')?.value as number) || 0;

    if (quoteId) {
      const db = openDbConnection();
      const quote: Quote = db
        .prepare('SELECT * FROM quotes WHERE quote_id = ?')
        .get(quoteId);

      if (quote) {
        await interaction.reply({
          ephemeral: true,
          content: `You've selected quote #${quoteId}, "${quote.quote_name}"`,
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId(`SendQuoteToChannel-${quoteId}`)
                .setLabel('Send to channel')
                .setStyle('PRIMARY'),
              new MessageButton()
                .setCustomId(`DeleteQuote-${quoteId}-${user.id}`)
                .setLabel('Delete quote')
                .setStyle('DANGER')
            )
          ]
        });
      } else {
        // No quote was found with this ID
        await interaction.reply({
          ephemeral: true,
          content: 'No quote exists with this ID. Please try another ID.'
        });
      }

      db.close();
    } else {
      // The quote ID is invalid
      await interaction.reply({
        ephemeral: true,
        content:
          'This ID is invalid. Quote IDs are numeric, please ensure you enter a number.'
      });
    }
  }
};

export default GetQuote;
