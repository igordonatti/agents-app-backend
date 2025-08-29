export interface Transcription {
  id_transcription: string;
  role: string;
  message: string;
  conversation_id: string;
  start_time_unix_secs: number;
  call_duration_secs: number;
  User_Name: string;
  neo_user_id: number;
}
