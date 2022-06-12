import dotenv = require('dotenv');
import { Client, Intents } from 'discord.js';
import { runMigrations } from './utils/db';
import ready from './listeners/ready';
import interactionCreate from './listeners/interactionCreate';
import voiceStateUpdate from './listeners/voiceStateUpdate';

dotenv.config();

console.log('Bot is starting...');

runMigrations();

const token: string | undefined = process.env.BOT_TOKEN;
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES]
});

ready(client);
interactionCreate(client);
voiceStateUpdate(client);

client.login(token);
