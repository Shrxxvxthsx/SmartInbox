
export type Priority = 'urgent' | 'normal' | 'spam';
export type Sentiment = 'angry' | 'neutral' | 'happy';

export interface EmailMessage {
  id: string;
  sender: string;
  subject: string;
  body: string;
  timestamp: string;
  sentiment: Sentiment;
}

export interface EmailThread {
  id: string;
  messages: EmailMessage[];
  priority: Priority;
}

export interface ObservationSpace {
  current_email: EmailMessage;
  history: EmailMessage[];
  thread_priority: Priority;
  inbox_count: number;
  time_since_last_reply: number; // in minutes
}

export interface ActionSpace {
  type: 'triage' | 'reply' | 'archive' | 'delete';
  priority_assignment?: Priority;
  response_sentiment?: Sentiment;
  response_template_id?: string;
}

export interface RewardResult {
  score: number;
  breakdown: {
    accuracy: number;
    sentiment_match: number;
    speed_bonus: number;
    penalty: number;
  };
  message: string;
}

export interface TaskDefinition {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  goal: string;
  initial_state: EmailThread[];
}
