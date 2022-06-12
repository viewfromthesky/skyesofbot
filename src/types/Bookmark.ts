export default interface Bookmark {
  bookmark_id: number;
  /** ID of the user the bookmark belongs to */
  user_id?: string;
  /** Identifiable name of the bookmark to display to the user during selection */
  bookmark_name: string;
  /** Any data that the bookmark represents */
  data: string;
}
