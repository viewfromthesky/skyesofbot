import { BaseCommandInteraction, Client, Constants } from 'discord.js';
import { SlashCommand } from '../types/Command';
import { openDbConnection } from '../utils/db';
import { getOperatorName } from '../utils/helpers';

const quoteIdentifierMaxLength = 1024;
const quotedNameMaxLength = 1024;
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
      // },
      // {
      //   name: 'date',
      //   description:
      //     "The original date of the statement you're quoting. Current date/time is used if no input given.",
      //   required: false,
      //   type: Constants.ApplicationCommandOptionTypes.STRING
    }
  ],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const { options, user } = interaction;
    const quoteIdentifier = (options.get('name')?.value as string) || '';
    const quotedName =
      (options.get('quoted_person_name')?.value as string) || '';
    const quoteContent = (options.get('quote')?.value as string) || '';
    // date not currently in use, logic should bypass it
    const quoteDate = (options.get('date')?.value as string) || '';

    // Basic validation
    if (
      quotedName.length <= quotedNameMaxLength &&
      quoteIdentifier.length <= quoteIdentifierMaxLength &&
      quoteContent.length <= quoteContentMaxLength
    ) {
      const db = openDbConnection();
      const query = quoteDate
        ? 'INSERT INTO quotes (creator_user_id, quote_date, quoted_person_name, quote_name, data) VALUES (?, ?, ?, ?, ?)'
        : 'INSERT INTO quotes (creator_user_id, quoted_person_name, quote_name, data) VALUES (?, ?, ?, ?)';
      const quoteArguments = [
        user.id,
        ...(quoteDate && [quoteDate]),
        quotedName,
        quoteIdentifier,
        quoteContent
      ];

      const update = db.prepare(query).run(quoteArguments);

      if (update.changes && update.lastInsertRowid) {
        await interaction.reply({
          ephemeral: true,
          content: `Quote #${update.lastInsertRowid} "${quoteIdentifier}" has been saved. Find quotes again with \`/getquote\` or \`/getrandomquote\``
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
        content: `Content too long, please reduce the length of your quote's identifier, content or the name of the quoted person. Quote identifier length: ${quoteIdentifier.length}/${quoteIdentifierMaxLength} characters\nQuoted person's name length: ${quotedName.length}/${quotedNameMaxLength} characters\nQuote content length ${quoteContent.length}/${quoteContentMaxLength} characters`
      });
    }
  }
};
