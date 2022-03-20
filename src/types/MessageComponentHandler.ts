import { Client, SelectMenuInteraction, ButtonInteraction } from 'discord.js';

interface MessageComponentHandler {
  handlerName: string;
}

export interface ButtonHandler extends MessageComponentHandler {
  run: (client: Client, interaction: ButtonInteraction) => void;
}

export interface SelectMenuHandler extends MessageComponentHandler {
  run: (client: Client, interaction: SelectMenuInteraction) => void;
}
