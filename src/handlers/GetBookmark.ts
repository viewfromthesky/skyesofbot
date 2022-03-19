import { Client, MessageComponentInteraction } from 'discord.js';
import MessageComponentHandler from '../types/MessageComponentHandler';

export const GetBookmark: MessageComponentHandler = {
	handlerName: 'GetBookmark',
	run: async(_: Client, interaction: MessageComponentInteraction) => {
		await interaction.deferReply();

		await interaction.followUp({
			ephemeral: true,
			content: (interaction as any).values[0]
		})
	}
};
