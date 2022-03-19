import { BaseCommandInteraction, Client, Interaction, MessageComponentInteraction } from 'discord.js';
import { Commands } from '../Commands';
import { MessageComponentHandlers } from '../MessageComponentHandlers';

export default (client: Client): void => {
	client.on('interactionCreate', async(interaction: Interaction) => {
		if(interaction.isCommand() || interaction.isContextMenu()) {
			await handleSlashCommand(client, interaction);
		}
		else if(interaction.isSelectMenu())
		{
			await handleSelectMenu(client, interaction);
		}
	});
}

const handleSlashCommand = async (client: Client, interaction: BaseCommandInteraction): Promise<void> => {
	const slashCommand = Commands.find(c => c.name === interaction.commandName);

	if(!slashCommand) {
		await interaction.deferReply();

		interaction.followUp({ content: 'Command not found, try /help for a list of commands' });

		return;
	}

	// await interaction.deferReply();
	slashCommand.run(client, interaction);
};

const handleSelectMenu = async (client: Client, interaction: MessageComponentInteraction): Promise<void> => {
	const componentHandler = MessageComponentHandlers.find(m => m.handlerName === interaction.customId);

	if(!componentHandler) {
		await interaction.deferReply();

		interaction.followUp({ content: `Interaction handler "${interaction.customId}" not found, contact [adminName] because they probably broke something`})

		return;
	}

	componentHandler.run(client, interaction);
};
