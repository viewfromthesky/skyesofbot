import { SlashCommand } from './types/Command';
import { CoinFlip } from './commands/CoinFlip';
import { IndecisionFixer } from './commands/IndecisionFixer';
import { SaveBookmark } from './commands/SaveBookmark';
import { GetBookmark } from './commands/GetBookmark';
import { SaveQuote } from './commands/SaveQuote';
import SendRandomQuote from './commands/SendRandomQuote';
// import DeleteQuote from './commands/DeleteQuote';
import GetQuote from './commands/GetQuote';
import CreateManagedVoiceChannel from './commands/CreateManagedVoiceChannel';

export const Commands: SlashCommand[] = [
  CoinFlip,
  IndecisionFixer,
  SaveBookmark,
  GetBookmark,
  SaveQuote,
  SendRandomQuote,
  GetQuote,
  CreateManagedVoiceChannel
  // TODO: CreateSnippet
  // TODO: EditSnippet
];
