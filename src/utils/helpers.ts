import { Client, GuildMember } from 'discord.js';
import Quote from '../types/Quote';

export function getMember(
  client: Client,
  memberId?: string
): GuildMember | undefined {
  if (!process.env.GUILD_ID || !memberId) {
    return undefined;
  }

  const { GUILD_ID: guildId } = process.env;
  const guild = client.guilds.cache.find((guild) => guild.id === guildId);

  if (guild) {
    const member = guild?.members.cache.find(
      (member) => member.id === memberId
    );

    if (member) {
      return member;
    }
  }

  return undefined;
}

/**
 * Return the only the name of a guild member. Returns server nickname if present, otherwise returns username.
 *
 * @param   {GuildMember} member - The member to get the name from.
 *
 * @returns {string|undefined}  - The name of the member, if they exist.
 */
export function getMemberName(member?: GuildMember): string | undefined {
  if (member?.nickname) {
    return member.nickname;
  } else if (member?.user.username) {
    return member.user.username;
  }

  return undefined;
}

export function getOperator(client: Client): GuildMember | undefined {
  if (!process.env.GUILD_ID || !process.env.OPERATOR_ID) {
    return undefined;
  }

  const { OPERATOR_ID: operatorId } = process.env;

  return getMember(client, operatorId);
}

/**
 * Return the name of the bot operator, using getMemberName.
 *
 * @param   {Client} client
 *
 * @returns {string}  - The name of the bot's operator, or 'an admin'.
 */
export function getOperatorName(client: Client): string {
  return getMemberName(getOperator(client)) || 'an admin';
}

export function buildQuote(quote: Quote): string {
  // this year representation _may_ need replacing with a proper date library...
  return `#${quote.quote_id}\n> ${quote.data}\n_- ${quote.quoted_person_name}${
    quote.quote_year ? `, ${quote.quote_year}` : ''
  }_`;
}
