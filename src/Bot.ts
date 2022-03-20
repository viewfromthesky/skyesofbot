import dotenv = require('dotenv');
import { Client } from 'discord.js';
import { runMigrations } from './utils/db';
import ready from './listeners/ready';
import interactionCreate from './listeners/interactionCreate';

dotenv.config();

console.log('Bot is starting...');

runMigrations();

const token: string | undefined = process.env.BOT_TOKEN;
const client = new Client({
  intents: []
});

ready(client);
interactionCreate(client);

client.login(token);
