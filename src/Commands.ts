import { SlashCommand } from './types/Command';
import { CoinFlip } from './commands/CoinFlip';
import { IndecisionFixer } from './commands/IndecisionFixer';
import { SaveBookmark } from './commands/SaveBookmark';
import { GetBookmark } from './commands/GetBookmark';
import { SaveQuote } from './commands/SaveQuote';
import GetRandomQuote from './commands/GetRandomQuote';

export const Commands: SlashCommand[] = [
  CoinFlip,
  IndecisionFixer,
  SaveBookmark,
  GetBookmark,
  SaveQuote,
  GetRandomQuote
  // TODO: CreateSnippet
  // TODO: EditSnippet
];
