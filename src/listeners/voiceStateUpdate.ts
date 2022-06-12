import { Client, VoiceState, VoiceChannel } from 'discord.js';
import { openDbConnection } from '../utils/db';

export default async (client: Client) => {
  client.on(
    'voiceStateUpdate',
    async (oldState: VoiceState, newState: VoiceState) => {
      // As long as the user was leaving the channel
      if (oldState.channelId && newState.channelId !== oldState.channelId) {
        const db = openDbConnection();
        const { channelId } = oldState;

        const channelIsTemporary = db
          .prepare(
            'SELECT 1 FROM temporary_voice_channels WHERE channel_id = ?'
          )
          .get(channelId);

        if (channelIsTemporary) {
          const channel = await client.channels.fetch(channelId);

          // If the voice channel still exists and there are no members remaining, delete it
          if (
            channel &&
            channel.isVoice &&
            (channel as VoiceChannel).members.size === 0
          ) {
            channel.delete('Temporary channel now closing.');

            db.prepare(
              'DELETE FROM temporary_voice_channels WHERE channel_id = ?'
            ).run(channelId);
          }
        }

        db.close();
      }
    }
  );
};
