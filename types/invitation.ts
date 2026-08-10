export type InvitationEvent =
  | 'page_opened'
  | 'yes_clicked'
  | 'no_clicked'
  | 'yes_confirmed'
  | 'day_selected'
  | 'time_selected'
  | 'food_selected'
  | 'final_confirmed';

export interface DateInvitation {
  id: string;
  session_id: string;
  accepted: boolean;
  selected_day: string | null;
  selected_time: string | null;
  food_choice: string | null;
  final_confirmed: boolean;
  no_attempts: number;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}
