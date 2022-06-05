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
import { getOperatorName } from '../utils/helpers';

const GetQuote: SlashCommand = {
  name: 'getquote',
  description: "Get a quote using it's numeric ID.",
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'quote_id',
      description: "The numeric ID of the quote you'd like to print.",
      required: false,
      type: Constants.ApplicationCommandOptionTypes.INTEGER
    }
  ],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const { options, user } = interaction;
    const quoteId = (options.get('quote_id')?.value as number) || 0;
    let quote: Quote | undefined;

    if (quoteId) {
      const db = openDbConnection();
      quote = db
        .prepare('SELECT * FROM quotes WHERE quote_id = ?')
        .get(quoteId);

      db.close();
    } else {
      const db = openDbConnection();
      const allQuotes: Quote[] = db.prepare('SELECT * FROM quotes').all();

      if (allQuotes.length) {
        quote = allQuotes[Math.ceil(Math.random() * (allQuotes.length - 1))];
      } else {
        await interaction.reply({
          ephemeral: true,
          content:
            'There are no quotes available to select from. Try adding a new one with `/savequote`'
        });
      }
    }

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
      await interaction.reply({
        ephemeral: true,
        content: `No quote was selected. If you think this is an error, contact ${getOperatorName(
          client
        )}.`
      })
    }
  }
};

export default GetQuote;
