import { Client } from 'discord.js';
import { Commands } from '../Commands';

export default (client: Client): void => {
	client.on('ready', async () => {
		if (!client.user || !client.application) return;

		// If a GUILD_ID is supplied, this is a test server
		if(process.env.GUILD_ID) {
			const guild = client.guilds.cache.get(process.env.GUILD_ID);

			if(guild) {
				await guild.commands.set(Commands);
			}
		} else {
			await client.application.commands.set(Commands);
		}

		console.log(`${client.user.username} is online!`);
	});
}
