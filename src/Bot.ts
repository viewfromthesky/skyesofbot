require('dotenv').config();
import { Client } from 'discord.js';
import ready from './listeners/ready';
import interactionCreate from './listeners/interactionCreate';

console.log('Bot is starting...');

const token: string | undefined = process.env.BOT_TOKEN;
const client = new Client({
	intents: []
});

ready(client);
interactionCreate(client);

client.login(token);
