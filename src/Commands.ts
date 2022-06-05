import { SlashCommand } from './types/Command';
import { CoinFlip } from './commands/CoinFlip';
import { IndecisionFixer } from './commands/IndecisionFixer';
import { SaveBookmark } from './commands/SaveBookmark';
import { GetBookmark } from './commands/GetBookmark';
import { SaveQuote } from './commands/SaveQuote';
import GetRandomQuote from './commands/GetRandomQuote';
import DeleteQuote from './commands/DeleteQuote';

export const Commands: SlashCommand[] = [
  CoinFlip,
  IndecisionFixer,
  SaveBookmark,
  GetBookmark,
  SaveQuote,
  GetRandomQuote,
  DeleteQuote
  // TODO: CreateSnippet
  // TODO: EditSnippet
];
