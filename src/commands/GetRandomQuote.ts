import { BaseCommandInteraction, Client } from 'discord.js';
import { SlashCommand } from '../types/Command';
import { openDbConnection } from '../utils/db';
import Quote from '../types/Quote';
import { getOperatorName, buildQuote } from '../utils/helpers';

const GetRandomQuote: SlashCommand = {
  name: 'getrandomquote',
  description:
    'Print a random quote that someone has saved. It could be absolutely anything...',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const db = openDbConnection();
    const { c: numOfQuotes }: { c: number } = db
      .prepare('SELECT COUNT(*) as c FROM quotes')
      .get();

    const randomQuoteId = Math.ceil(Math.random() * numOfQuotes);
    const randomQuote: Quote = db
      .prepare('SELECT * FROM quotes WHERE quote_id = ?')
      .get(randomQuoteId);

    console.log({ numOfQuotes, randomQuoteId, randomQuote });

    if (randomQuote) {
      await interaction.reply({
        ephemeral: false,
        content: buildQuote(randomQuote)
      });
    } else {
      await interaction.reply({
        ephemeral: true,
        content: `There was an error returning a random quote. This could be because there are no quotes available, or a bad quote ID was chosen. Contact ${getOperatorName(
          client
        )} as it's possible that something is broken.`
      });
    }
  }
};

export default GetRandomQuote;
