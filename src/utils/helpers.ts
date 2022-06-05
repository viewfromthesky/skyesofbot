import { Client, GuildMember } from 'discord.js';
import Quote from '../types/Quote';

export function getOperator(client: Client): GuildMember | undefined {
  if (!process.env.GUILD_ID || !process.env.OPERATOR_ID) {
    return undefined;
  }

  const { GUILD_ID: guildId, OPERATOR_ID: operatorId } = process.env;
  const guild = client.guilds.cache.find((guild) => guild.id === guildId);

  if (guild) {
    const operator = guild?.members.cache.find(
      (member) => member.id === operatorId
    );

    if (operator) {
      return operator;
    }
  }

  return undefined;
}

export function getOperatorName(client: Client): string {
  const operator = getOperator(client);

  if (operator?.nickname) {
    return operator.nickname;
  } else if (operator?.user.username) {
    return operator.user.username;
  }

  return 'an admin';
}

export function buildQuote(quote: Quote): string {
  return `"${quote.data}"\n- ${quote.quote_name}, ${quote.quote_date}`;
}
