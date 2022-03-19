import { BaseCommandInteraction, Client, Constants } from 'discord.js';
import { SlashCommand } from '../Command';

export const IndecisionFixer: SlashCommand = {
	name: 'fixindecision',
	description: 'Helps fix indecisive moments',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'things',
			description: 'Comma-delimited string (by default) of things to choose from',
			required: true,
			type: Constants.ApplicationCommandOptionTypes.STRING,
		},
		{
			name: 'delimiter',
			description: 'Character(s) used to separate your things you can\'t decide on',
			required: false,
			type: Constants.ApplicationCommandOptionTypes.STRING
		}
	],
	run: async(_: Client, interaction: BaseCommandInteraction) => {
		const { options } = interaction;
		const interactionOptionsString = options.get('things')?.value as string || '';
		const delimiter = options.get('delimiter')?.value || ',';

		const interactionOptions = interactionOptionsString.split(new RegExp(`${delimiter}\\s?`));

		if(interactionOptions.length === 1) {
			await interaction.followUp({
				ephemeral: true,
				content: 'You only sent me one option...'
			})
		} else {
			const selectionIndex = Math.floor(Math.random() * interactionOptions.length);
			const selection = interactionOptions[selectionIndex];

			await interaction.followUp({
				ephemeral: true,
				content: `I think you should pick... "${selection}"`
			});
		}
	}
};
