import { SlashCommand } from './types/Command';
import { CoinFlip } from './commands/CoinFlip';
import { IndecisionFixer } from './commands/IndecisionFixer';
import { SaveBookmark } from './commands/SaveBookmark';
import { GetBookmark } from './commands/GetBookmark';
import { SaveQuote } from './commands/SaveQuote';

export const Commands: SlashCommand[] = [
  CoinFlip,
  IndecisionFixer,
  SaveBookmark,
  GetBookmark,
  SaveQuote
  // TODO: CreateSnippet
  // TODO: EditSnippet
];
