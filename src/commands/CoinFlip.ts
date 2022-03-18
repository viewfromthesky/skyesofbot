import { BaseCommandInteraction, Client } from 'discord.js';
import { SlashCommand } from '../Command';

export const CoinFlip: SlashCommand = {
	name: 'coinflip',
	description: 'Flips a coin',
	type: 'CHAT_INPUT',
	run: async (_: Client, interaction: BaseCommandInteraction) => {
		let content: string | undefined = undefined;
		const flip: number = Math.random();

		console.log('flip:', flip);

		if (flip > 0.48 && flip < 0.52) {
			content = '<:kekw:763824609082343485> It landed on it\'s side!';
		}

		if(!content) {
			const booleanResult = Boolean(Math.round(flip));

			if(booleanResult) {
				content = `${String.fromCodePoint(0x1fa99)} Heads`;
			}
			else {
				content = `${String.fromCodePoint(0x1fa99)} Tails`;
			}
		}

		await interaction.followUp({
			ephemeral: true,
			content
		})
	}
}
