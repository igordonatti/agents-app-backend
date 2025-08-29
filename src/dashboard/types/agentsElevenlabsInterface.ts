export class AgentsElevenLabs {
  agent_id: string;
  name: string;
  created_at: string;
  conversations: Conversations[];
}

export class Conversations {
  conversation_id: string;
  agent_id: string;
  agent_name: string;
  message_count: number;
  created_at: string;
  start_time_unix_secs: number;
  call_duration_secs: number;
  call_successful: string;
  status: string;
  neo_user_id: number;
  User_Name: string;
}

export class Transcriptions {
  id_transcription: string;
  role: string;
  message: string;
  conversation_id: string;
  start_time_unix_secs: number;
  call_duration_secs: number;
  User_Name: string;
  neo_user_id: number;
}
