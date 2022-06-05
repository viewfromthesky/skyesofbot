import { SlashCommand } from './types/Command';
import { CoinFlip } from './commands/CoinFlip';
import { IndecisionFixer } from './commands/IndecisionFixer';
import { SaveBookmark } from './commands/SaveBookmark';
import { GetBookmark } from './commands/GetBookmark';
import { SaveQuote } from './commands/SaveQuote';
import SendRandomQuote from './commands/SendRandomQuote';
// import DeleteQuote from './commands/DeleteQuote';
import GetQuote from './commands/GetQuote';

export const Commands: SlashCommand[] = [
  CoinFlip,
  IndecisionFixer,
  SaveBookmark,
  GetBookmark,
  SaveQuote,
  SendRandomQuote,
  // DeleteQuote,
  GetQuote
  // TODO: CreateSnippet
  // TODO: EditSnippet
];
