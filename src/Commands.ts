import { SlashCommand } from './Command';
import { CoinFlip } from './commands/CoinFlip';
import { IndecisionFixer } from './commands/IndecisionFixer';

export const Commands: SlashCommand[] = [
	CoinFlip,
	IndecisionFixer
];
