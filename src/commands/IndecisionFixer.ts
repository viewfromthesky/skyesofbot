import { BaseCommandInteraction, Client, Constants } from 'discord.js';
import { SlashCommand } from '../types/Command';

export const IndecisionFixer: SlashCommand = {
  name: 'fixindecision',
  description: 'Helps fix indecisive moments',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'things',
      description:
        'Comma-delimited string (by default) of things to choose from (e.g. "banana, apple, orange")',
      required: true,
      type: Constants.ApplicationCommandOptionTypes.STRING
    },
    {
      name: 'delimiter',
      description:
        "Character(s) used to separate your things you can't decide on",
      required: false,
      type: Constants.ApplicationCommandOptionTypes.STRING
    }
  ],
  run: async (_: Client, interaction: BaseCommandInteraction) => {
    await interaction.deferReply();

    const { options } = interaction;
    const interactionOptionsString =
      (options.get('things')?.value as string) || '';
    const delimiter = options.get('delimiter')?.value || ',';

    const interactionOptions = interactionOptionsString.split(
      new RegExp(`\\s?${delimiter}\\s?`)
    );

    if (interactionOptions.length === 1) {
      await interaction.followUp({
        ephemeral: true,
        content: 'You only sent me one option...'
      });
    } else {
      const selection =
        interactionOptions[
          Math.floor(Math.random() * interactionOptions.length)
        ];

      await interaction.followUp({
        ephemeral: true,
        content: `I think you should pick... "${selection}"`
      });
    }
  }
};
