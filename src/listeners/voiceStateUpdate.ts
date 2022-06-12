import { Client, VoiceState } from 'discord.js';
import { openDbConnection } from '../utils/db';

export default async (client: Client) => {
  client.on(
    'voiceStateUpdate',
    async (oldState: VoiceState, newState: VoiceState) => {
      // As long as the user was leaving the channel
      if (oldState.channelId && newState.channelId !== oldState.channelId) {
        // Check to see if this channel is temporary
        const db = openDbConnection();
        const { channelId } = oldState;

        const channelIsTemporary = db
          .prepare(
            'SELECT 1 FROM temporary_voice_channels WHERE channel_id = ?'
          )
          .get(channelId);

        if (channelIsTemporary) {
          const channel = await client.channels.fetch(channelId);

          if (channel) {
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
