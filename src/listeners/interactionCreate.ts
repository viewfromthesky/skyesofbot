import { BaseCommandInteraction, ButtonInteraction, Client, Interaction, SelectMenuInteraction } from 'discord.js';
import { Commands } from '../Commands';
import { SelectMenuHandlers, ButtonHandlers } from '../MessageComponentHandlers';

export default (client: Client): void => {
	client.on('interactionCreate', async(interaction: Interaction) => {
		if(interaction.isCommand() || interaction.isContextMenu()) {
			await handleSlashCommand(client, interaction);
		}
		else if(interaction.isSelectMenu())
		{
			await handleSelectMenu(client, interaction);
		}
		else if(interaction.isButton())
		{
			await handleButton(client, interaction);
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

	slashCommand.run(client, interaction);
};

const handleSelectMenu = async (client: Client, interaction: SelectMenuInteraction): Promise<void> => {
	const componentHandler = SelectMenuHandlers.find(m => m.handlerName === interaction.customId);

	if(!componentHandler) {
		await interaction.deferReply();

		interaction.followUp({ content: `Interaction handler "${interaction.customId}" not found, contact [adminName] because they probably broke something`})

		return;
	}

	componentHandler.run(client, interaction);
};

const handleButton = async (client: Client, interaction: ButtonInteraction): Promise<void> => {
	const [interactionId] = interaction.customId.split('-');
	const componentHandler = ButtonHandlers.find(b => b.handlerName === interactionId);

	if(!componentHandler) {
		await interaction.deferReply();

		interaction.followUp({ content: `Interaction handler "${interaction.customId}" not found, contact [adminName] because they probably broke something`});

		return;
	}

	componentHandler.run(client, interaction);
};
