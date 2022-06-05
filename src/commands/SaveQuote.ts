import { BaseCommandInteraction, Client, Constants } from 'discord.js';
import { SlashCommand } from '../types/Command';
import { openDbConnection } from '../utils/db';
import { getOperatorName } from '../utils/helpers';

const quoteNameMaxLength = 1024;
const quotedPersonNameMaxLength = 1024;
const quoteContentMaxLength = 2048;

export const SaveQuote: SlashCommand = {
  name: 'savequote',
  description: 'Save something someone said that you want to remember',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'name',
      description:
        'A name for your quote, to easily recall it later. 1024 character limit.',
      required: true,
      type: Constants.ApplicationCommandOptionTypes.STRING
    },
    {
      name: 'quoted_person_name',
      description: "The name of the person you're quoting",
      required: true,
      type: Constants.ApplicationCommandOptionTypes.STRING
    },
    {
      name: 'quote',
      description: "Your quote's content",
      required: true,
      type: Constants.ApplicationCommandOptionTypes.STRING
    },
    {
      name: 'quote_year',
      description:
        "The origin year of the statement you're quoting. Blank if not given.",
      required: false,
      type: Constants.ApplicationCommandOptionTypes.INTEGER,
      minValue: 1,
      maxValue: 3000
    }
  ],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const { options, user } = interaction;
    const quoteName = (options.get('name')?.value as string) || '';
    const quotedName =
      (options.get('quoted_person_name')?.value as string) || '';
    const quoteContent = (options.get('quote')?.value as string) || '';
    const quoteYear = (options.get('quote_year')?.value as string) || '';

    // Basic validation
    if (
      quotedName.length <= quotedPersonNameMaxLength &&
      quoteName.length <= quoteNameMaxLength &&
      quoteContent.length <= quoteContentMaxLength
    ) {
      const db = openDbConnection();
      const query = quoteYear
        ? 'INSERT INTO quotes (creator_user_id, quote_year, quoted_person_name, quote_name, data) VALUES (?, ?, ?, ?, ?)'
        : 'INSERT INTO quotes (creator_user_id, quoted_person_name, quote_name, data) VALUES (?, ?, ?, ?)';
      const quoteArguments = [
        user.id,
        ...(quoteYear && [quoteYear]),
        quotedName,
        quoteName,
        quoteContent
      ];

      const update = db.prepare(query).run(quoteArguments);

      if (update.changes && update.lastInsertRowid) {
        await interaction.reply({
          ephemeral: true,
          content: `Quote #${update.lastInsertRowid} "${quoteName}" has been saved. Find quotes again with \`/getquote\` or \`/getrandomquote\``
        });
      } else {
        await interaction.reply({
          ephemeral: true,
          content: `There was an error saving your quote. Contact ${getOperatorName(
            client
          )} as they may have broken something.`
        });
      }

      db.close();
    } else {
      await interaction.reply({
        ephemeral: true,
        content: `Content too long, please reduce the length of your quote's identifier, content or the name of the quoted person. Quote identifier length: ${quoteName.length}/${quoteNameMaxLength} characters\nQuoted person's name length: ${quotedName.length}/${quotedPersonNameMaxLength} characters\nQuote content length ${quoteContent.length}/${quoteContentMaxLength} characters`
      });
    }
  }
};
