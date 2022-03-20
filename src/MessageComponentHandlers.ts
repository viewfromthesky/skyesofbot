import {
  SelectMenuHandler,
  ButtonHandler
} from './types/MessageComponentHandler';
import { GetBookmark } from './handlers/GetBookmark';
import { SendBookmarkToChannel } from './handlers/SendBookmarkToChannel';
import { DeleteBookmark } from './handlers/DeleteBookmark';

export const SelectMenuHandlers: SelectMenuHandler[] = [GetBookmark];

export const ButtonHandlers: ButtonHandler[] = [
  SendBookmarkToChannel,
  DeleteBookmark
];
