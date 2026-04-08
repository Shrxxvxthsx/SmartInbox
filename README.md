
# SmartInboxENV

An OpenEnv-compatible reinforcement learning environment for intelligent email inbox management. Train agents to classify, prioritize, and respond to emails using LLMs (OpenAI API).

---

## Problem Description

Email overload is a significant productivity challenge. Users receive hundreds of emails daily with varying urgency, sentiment, and required actions. Manual triage is time-consuming and error-prone. **SmartInboxENV** models this as an RL problem where agents learn to:

- **Classify** emails by priority (urgent, normal, spam)
- **Analyze** sentiment (angry, happy, neutral)
- **Decide actions** (reply, escalate, ignore)
- **Draft responses** that match the email context and ground truth

The environment provides dense feedback through a grading system that rewards correct classification, appropriate actions, and quality responses.

---

## Real-World Relevance

- **Enterprise Email Management** - Help organizations reduce response time and improve customer satisfaction
- **Support Automation** - Prioritize urgent customer issues and escalate appropriately
- **Spam Detection** - Avoid wasting time or creating liability by replying to spam
- **Sentiment Analysis** - Detect angry customers for immediate escalation
- **Response Drafting** - Generate contextually appropriate replies

This environment bridges the gap between email triage and generative AI, enabling multi-step reasoning over partially observable information.

---

## Features

### 🔄 Multi-Step Episodes
- Episodes consist of 1-3 steps (randomized per episode)
- Agents learn sequential decision-making and state tracking
- Cumulative rewards incentivize optimal action sequences

### 😊 Sentiment Detection
Three sentiment types detected in incoming emails:
- **Happy** - Positive tone, thank you messages, appreciations
- **Neutral** - Standard business communications
- **Angry** - Complaints, urgent issues, escalations

### 📊 Priority Classification
Three priority levels:
- **Urgent** - Time-sensitive business requests, angry customers
- **Normal** - Standard communications, informational emails
- **Spam** - Unsolicited marketing, phishing attempts

### 🎯 Dense Rewards
Normalized [0, 1] rewards based on:
- Classification accuracy (30%)
- Response keyword matching quality (40%)
- Action appropriateness (30%)
- Penalties for critical errors (replying to spam, ignoring urgent emails)

---

## Observation Space
git clone https://huggingface.co/spaces/Shreevathsa00001/SmartInboxENV

Agents receive the following observations per step:

```python
{
    "email_text": str,           # Full email content
    "sender": str,               # Sender address/ID
    "sentiment": str,            # "angry" | "neutral" | "happy"
    "priority": str,             # "urgent" | "normal" | "spam"
    "history": List[str]         # Conversation context
}
```

Example:
```json
{
    "email_text": "Your invoice #12345 hasn't been corrected yet. This is frustrating!",
    "sender": "customer@client.com",
    "sentiment": "angry",
    "priority": "urgent",
    "history": ["Invoice dispute reported.", "Follow-up reminder sent."]
}
```

---

## Action Space

Agents produce actions with the following structure:

```python
{
    "classification": str,    # "urgent" | "normal" | "spam"
    "action_type": str,       # "reply" | "escalate" | "ignore"
    "response": str           # Drafted message (1-2 sentences)
}
```

### Action Types
- **reply**: Draft and send a direct response
- **escalate**: Forward to a human support representative
- **ignore**: Mark as read and archive

Example action:
```json
{
    "classification": "urgent",
    "action_type": "escalate",
    "response": "Your issue is urgent and requires immediate attention. I'm escalating this to our billing team for priority handling."
}
```

---

## Task Difficulty

### 🟢 Easy (Episodes: 100)
- **welcome** - Welcome onboarding emails, clear intent
- **security** - Security notifications, deterministic actions
- **Accuracy**: >95%

### 🟡 Medium (Episodes: 80-100)
- **meeting_reminder** - Meeting notifications with context
- **order_tracking** - Order notifications and shipping updates
- **spam_detection** - Marketing emails requiring ignoring
- **Accuracy**: 70-90%

### 🔴 Hard (Episodes: 50-60)
- **urgent_business_request** - Complex business requests, prioritization needed
- **angry_customer** - Upset customers requiring careful escalation and empathy
- **Accuracy**: <70%

---

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ (for frontend)
- OpenAI API key

### 1. Clone and Install

```bash
git clone <repository>
cd SmartInbox
npm install
pip install -r requirements.txt
```

### 2. Configure Environment

Create `.env.local`:
```bash
OPENAI_API_KEY=sk-...
API_BASE_URL=https://api.openai.com/v1  # Optional
MODEL_NAME=gpt-4o-mini
```

### 3. Run Frontend (Development)

```bash
npm run dev
# Opens at http://localhost:3000
```

### 4. Run Inference

```bash
# Single episode
python inference.py

# Multiple episodes
python inference.py --episodes 5
```

Output:
```
[START] Beginning SmartInbox inference episode
[STEP] Environment reset. Max steps: 2
[STEP] Step 1/2
[STEP] Action: reply | Classification: urgent | Reward: 0.85 | Done: False
[STEP] Step 2/2
[STEP] Action: escalate | Classification: urgent | Reward: 0.92 | Done: True
[END] Episode completed
[END] Total steps: 2
[END] Total reward: 1.77
[END] Average score: 0.88
```

---

## Docker Usage

### Build Image

```bash
docker build -t smartinbox:latest .
```

### Run Environment Server

```bash
docker run -p 8000:8000 \
  -e OPENAI_API_KEY=sk-... \
  -e MODEL_NAME=gpt-4o-mini \
  smartinbox:latest
```

### Run with Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  smartinbox:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - MODEL_NAME=gpt-4o-mini
      - API_BASE_URL=${API_BASE_URL}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Run:
```bash
docker-compose up
```

---

## Example Run

### Single Episode Inference

```bash
$ python inference.py

============================================================
Episode 1/1
============================================================

[START] Beginning SmartInbox inference episode
[STEP] Environment reset. Max steps: 3
[STEP] Step 1/3
[STEP] Action: reply | Classification: normal | Reward: 0.92 | Done: False
[STEP] Step 2/3
[STEP] Action: escalate | Classification: urgent | Reward: 0.88 | Done: False
[STEP] Step 3/3
[STEP] Action: ignore | Classification: spam | Reward: 0.95 | Done: True
[END] Episode completed
[END] Total steps: 3
[END] Total reward: 2.75
[END] Average score: 0.92

============================================================
FINAL RESULTS
============================================================
{
  "num_episodes": 1,
  "average_score": 0.92,
  "episodes": [
    {
      "success": true,
      "steps": 3,
      "total_reward": 2.75,
      "final_score": 0.92,
      "history": [...]
    }
  ]
}
```

### Multi-Episode Training

```bash
$ python inference.py --episodes 3

# Runs 3 episodes and reports average score
[END] Average score across 3 episodes: 0.87
```

---

## Project Structure

```
SmartInbox/
├── env/
│   ├── environment.py      # SmartInboxEnv implementation
│   ├── models.py           # Pydantic models (Action, Observation, Reward)
│   ├── grader.py           # Reward grading logic
│   └── tasks.py            # Task definitions (7 tasks)
├── src/
│   ├── App.tsx             # React frontend
│   ├── components/         # UI components
│   └── constants.ts        # Configuration
├── inference.py            # Inference runner with LLM integration
├── openenv.yaml            # OpenEnv environment specification
├── Dockerfile              # Container definition
├── package.json            # Node dependencies
├── pyproject.toml          # Python dependencies
└── README.md               # This file
```

---

## API Reference

### SmartInboxEnv

```python
from env.environment import SmartInboxEnv

env = SmartInboxEnv()

# Reset environment
observation = env.reset()

# Step through environment
observation, reward, done, info = env.step(action)

# Get current state
state = env.state()
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `MODEL_NAME` | Model to use (e.g., `gpt-4o-mini`) | Yes |
| `API_BASE_URL` | Custom API endpoint (optional) | No |

---

## Evaluation Metrics

- **Accuracy**: Percentage of correctly classified emails
- **F1 Score**: Balanced precision/recall across priority classes
- **Response Quality**: Keyword match ratio in drafted responses
- **Safety**: Absence of critical errors (spam replies, ignored urgent)

---

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a pull request

---

## License

MIT License - See LICENSE file for details

---

## References

- [OpenAI Python Client](https://github.com/openai/openai-python)
- [OpenEnv Framework](https://github.com/openenv/openenv-core)
- [Pydantic](https://docs.pydantic.dev/)
- [Vite + React](https://vitejs.dev/)
