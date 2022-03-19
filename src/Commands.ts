import { SlashCommand } from './types/Command';
import { CoinFlip } from './commands/CoinFlip';
import { IndecisionFixer } from './commands/IndecisionFixer';
import { SaveBookmark } from './commands/SaveBookmark';
import { GetBookmark } from './commands/GetBookmark';

export const Commands: SlashCommand[] = [
	CoinFlip,
	IndecisionFixer,
	SaveBookmark,
	GetBookmark
];
