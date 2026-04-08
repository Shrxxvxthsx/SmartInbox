
import { EmailThread, TaskDefinition } from './types';

export const EXAMPLE_THREADS: EmailThread[] = [
  {
    id: 'thread-1',
    priority: 'urgent',
    messages: [
      {
        id: 'msg-1',
        sender: 'ceo@company.com',
        subject: 'Urgent: Q1 Report Review',
        body: 'I need the Q1 report reviewed by EOD. This is critical for the board meeting.',
        timestamp: '2026-04-08T09:00:00Z',
        sentiment: 'neutral'
      },
      {
        id: 'msg-2',
        sender: 'ceo@company.com',
        subject: 'Re: Urgent: Q1 Report Review',
        body: 'Still waiting for your response. Is everything okay?',
        timestamp: '2026-04-08T11:00:00Z',
        sentiment: 'angry'
      }
    ]
  },
  {
    id: 'thread-2',
    priority: 'normal',
    messages: [
      {
        id: 'msg-3',
        sender: 'marketing@partner.com',
        subject: 'Collaboration Opportunity',
        body: 'Hi, we would love to discuss a potential marketing collaboration for the next quarter.',
        timestamp: '2026-04-08T10:30:00Z',
        sentiment: 'happy'
      }
    ]
  },
  {
    id: 'thread-3',
    priority: 'spam',
    messages: [
      {
        id: 'msg-4',
        sender: 'no-reply@win-big.net',
        subject: 'You won a $1000 Gift Card!',
        body: 'Click here to claim your prize. Limited time offer!',
        timestamp: '2026-04-08T08:15:00Z',
        sentiment: 'happy'
      }
    ]
  }
];

export const TASKS: TaskDefinition[] = [
  {
    id: 'task-easy',
    name: 'Basic Triage',
    difficulty: 'easy',
    description: 'Correctly categorize incoming emails into urgent, normal, or spam based on sender and content.',
    goal: 'Achieve 100% triage accuracy on a batch of 10 emails.',
    initial_state: [EXAMPLE_THREADS[2]]
  },
  {
    id: 'task-medium',
    name: 'Sentiment-Aware Response',
    difficulty: 'medium',
    description: 'Respond to a thread with the appropriate sentiment and priority. If the sender is angry, the response must be empathetic.',
    goal: 'Maintain a sentiment alignment score above 0.8.',
    initial_state: [EXAMPLE_THREADS[0]]
  },
  {
    id: 'task-hard',
    name: 'Multi-Step Thread Management',
    difficulty: 'hard',
    description: 'Manage a complex thread where the priority changes over time and the sender\'s sentiment fluctuates.',
    goal: 'Successfully resolve the thread within 3 steps with a cumulative reward > 5.0.',
    initial_state: [EXAMPLE_THREADS[0], EXAMPLE_THREADS[1]]
  }
];

export const REWARD_FUNCTION_DESC = `
R = (w1 * Accuracy) + (w2 * SentimentMatch) + (w3 * SpeedBonus) - (w4 * Penalty)

- Accuracy: +1.0 for correct triage, -1.0 for incorrect.
- SentimentMatch: +0.5 if response sentiment matches sender's emotional state (e.g., neutral for neutral, happy for happy, neutral/happy for angry).
- SpeedBonus: +0.2 * (1 / time_taken) for quick responses to urgent emails.
- Penalty: -2.0 for deleting urgent emails or archiving without response.
`;

export const OBSERVATION_SCHEMA = {
  type: "object",
  properties: {
    current_email: {
      type: "object",
      properties: {
        sender: { type: "string" },
        subject: { type: "string" },
        body: { type: "string" },
        sentiment: { enum: ["angry", "neutral", "happy"] }
      }
    },
    history: {
      type: "array",
      items: { "$ref": "#/properties/current_email" }
    },
    thread_priority: { enum: ["urgent", "normal", "spam"] },
    inbox_count: { type: "integer" }
  }
};

export const ACTION_SCHEMA = {
  type: "object",
  properties: {
    type: { enum: ["triage", "reply", "archive", "delete"] },
    priority_assignment: { enum: ["urgent", "normal", "spam"] },
    response_sentiment: { enum: ["angry", "neutral", "happy"] }
  },
  required: ["type"]
};
