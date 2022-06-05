export default interface Quote {
  quote_id: number;
  creator_user_id: string;
  quoted_person_name: string;
  quote_name: string;
  data: string;
  quote_year?: number;
}
