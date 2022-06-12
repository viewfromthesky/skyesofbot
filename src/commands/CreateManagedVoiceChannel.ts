import {
  BaseCommandInteraction,
  Client,
  Constants,
  Permissions
} from 'discord.js';
import { SlashCommand } from '../types/Command';
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
    }
  ],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const { guild, options, user } = interaction;

    // Get all command options
    const channelName = (options.get('channel_name')?.value as string) || '';
    const userLimit = (options.get('user_limit')?.value as number) || 0;
    const { MANAGED_CHANNEL_CATEGORY_ID } = process.env;

    if (guild && channelName && MANAGED_CHANNEL_CATEGORY_ID) {
      try {
        const channel = await guild.channels.create(channelName, {
          type: 'GUILD_VOICE',
          bitrate: 96000,
          ...(userLimit ? { userLimit } : null),
          permissionOverwrites: [
            // {
            //   id: guild.roles.everyone,
            //   deny: [
            //     Permissions.FLAGS.MANAGE_CHANNELS,
            //     Permissions.FLAGS.MANAGE_ROLES,
            //     Permissions.FLAGS.MUTE_MEMBERS,
            //     Permissions.FLAGS.MOVE_MEMBERS
            //   ]
            // },
            {
              id: user,
              allow: [
                Permissions.FLAGS.MANAGE_CHANNELS,
                Permissions.FLAGS.MANAGE_ROLES,
                Permissions.FLAGS.MUTE_MEMBERS,
                Permissions.FLAGS.MOVE_MEMBERS
              ]
            }
          ]
        });

        await channel.setParent(MANAGED_CHANNEL_CATEGORY_ID);

        await interaction.reply({
          ephemeral: true,
          content: `The new channel "${channel.name}" has been created, with you as the manager.`
        });
      } catch (error) {
        console.log(
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
