import { Client, MessageComponentInteraction } from 'discord.js';

export default interface MessageComponentHandler {
	handlerName: string;
	run: (client: Client, interaction: MessageComponentInteraction) => void
}
