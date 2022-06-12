export default interface Quote {
  quote_id: number;
  /** ID of the user who created the quote, used to allow deletion */
  creator_user_id: string;
  /** Name of the person being quoted */
  quoted_person_name: string;
  /** Identifiable name of the quote to remind users of the contents of the quote without displaying the full text */
  quote_name: string;
  /** The quote text */
  data: string;
  /** The year the quote was originally said/written */
  quote_year?: number;
}
