import {
  BaseCommandInteraction,
  Client,
  Constants,
  Permissions,
  PermissionResolvable
} from 'discord.js';
import { SlashCommand } from '../types/Command';
import { openDbConnection } from '../utils/db';
import { getOperatorName } from '../utils/helpers';

export const CreateManagedVoiceChannel: SlashCommand = {
  name: 'createvoice',
  description:
    'Create a new voice channel inside a managed category where only you can manage the settings.',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'channel_name',
      description: 'The name of your channel.',
      required: true,
      type: Constants.ApplicationCommandOptionTypes.STRING
    },
    {
      name: 'user_limit',
      description:
        'The maximum number of users who can connect to the channel.',
      required: false,
      type: Constants.ApplicationCommandOptionTypes.INTEGER
    },
    {
      name: 'temporary',
      description:
        'Enable to have this channel delete itself when all users leave.',
      required: false,
      type: Constants.ApplicationCommandOptionTypes.BOOLEAN
    },
    {
      name: 'private_by_default',
      description:
        'Enable to hide the channel from everyone by default. Set visibility settings manually after.',
      required: false,
      type: Constants.ApplicationCommandOptionTypes.BOOLEAN
    }
  ],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const { guild, options, user } = interaction;

    // Get all command options
    const channelName = (options.get('channel_name')?.value as string) || '';
    const userLimit = (options.get('user_limit')?.value as number) || 0;
    const temporary = (options.get('temporary')?.value as boolean) || false;
    const privateByDefault =
      (options.get('private_by_default')?.value as boolean) || false;
    const { MANAGED_CHANNEL_CATEGORY_ID, SECURITY_ROLE_ID } = process.env;

    if (guild && user && channelName && MANAGED_CHANNEL_CATEGORY_ID) {
      try {
        const channel = await guild.channels.create(channelName, {
          type: 'GUILD_VOICE',
          bitrate: 96000,
          ...(userLimit ? { userLimit } : null)
        });

        // If this is intended to be a temporary channel, save it's ID into the temporary_voice_channels table
        if (temporary) {
          const db = openDbConnection();
          const update = db
            .prepare(
              'INSERT INTO temporary_voice_channels (channel_id) VALUES (?)'
            )
            .run(channel.id);

          if (!update.changes || !update.lastInsertRowid) {
            await interaction.reply({
              ephemeral: true,
              content:
                'There was a problem when creating the association for this channel as temporary. It will not be deleted automatically when all users have left.'
            });
          }

          db.close();
        }

        await channel.setParent(MANAGED_CHANNEL_CATEGORY_ID);
        // Sync permissions with the parent category first
        // The parent could include some extra setup
        await channel.lockPermissions();

        await channel.permissionOverwrites.edit(guild.roles.everyone, {
          VIEW_CHANNEL: !privateByDefault,
          MANAGE_CHANNELS: false,
          MANAGE_ROLES: false,
          MUTE_MEMBERS: false,
          MOVE_MEMBERS: false
        });

        if (SECURITY_ROLE_ID) {
          const securityRole = await guild.roles.fetch(SECURITY_ROLE_ID);

          if (securityRole) {
            await channel.permissionOverwrites.edit(securityRole, {
              VIEW_CHANNEL: !privateByDefault
            });
          }
        }

        await channel.permissionOverwrites.create(user, {
          VIEW_CHANNEL: true,
          MANAGE_CHANNELS: true,
          MANAGE_ROLES: true,
          MUTE_MEMBERS: true,
          MOVE_MEMBERS: true
        });

        await interaction.reply({
          ephemeral: true,
          content: `The new channel "${channel.name}" has been created, with you as the manager.`
        });
      } catch (error) {
        console.error(
          'Channel creation failed:',
          {
            channelName,
            userLimit,
            MANAGED_CHANNEL_CATEGORY_ID
          },
          {
            error
          }
        );
        await interaction.reply({
          ephemeral: true,
          content: `There was a problem creating this channel; the channel may be available but it may not be set up correctly: \`\`\`${error}\`\`\``
        });
      }
    } else {
      await interaction.reply({
        ephemeral: true,
        content: `A parameter is missing from the required input. This is likely a problem with the bot setup. Give ${getOperatorName(
          client
        )} a shout to check the config.`
      });
    }
  }
};

export default CreateManagedVoiceChannel;
