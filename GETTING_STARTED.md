# SmartInboxENV - Getting Started Guide

## Overview

SmartInboxENV is a complete RL environment with:
- **React Frontend** - Interactive UI for email management training
- **Express.js Backend** - API server bridging frontend and Python
- **Python Environment** - RL environment with email tasks
- **Authentication** - Login system with demo accounts

---

## Prerequisites

- **Node.js** 18+ (for frontend and backend)
- **Python** 3.10+ (for environment)
- **npm** 9+ (package manager)

---

## Installation

### 1. Install Frontend Dependencies

```bash
npm install
```

This installs all required packages including:
- React 19
- Vite 6
- Express.js
- JWT authentication
- Tailwind CSS
- TypeScript

### 2. Optional: Python Dependencies

If running inference without the backend:

```bash
pip install -r requirements.txt
```

Or install individual packages:

```bash
pip install openai>=1.0.0 pydantic>=2.0.0 pyyaml>=6.0 numpy>=1.24.0 python-dotenv>=1.0.0
```

---

## Configuration

### 1. Create `.env.local` in project root

```bash
# Backend
PORT=5000
JWT_SECRET=your-secret-key-change-in-production

# OpenAI (for inference)
OPENAI_API_KEY=sk-...
MODEL_NAME=gpt-4o-mini
API_BASE_URL=https://api.openai.com/v1  # Optional
```

---

## Running the Application

### Option 1: Full Stack (Recommended)

Run both backend and frontend simultaneously:

```bash
npm run dev:all
```

This opens:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

### Option 2: Frontend Only

```bash
npm run dev
```

Opens frontend at http://localhost:3000

### Option 3: Backend Only

```bash
npm run dev:server
```

Backend runs at http://localhost:5000

### Option 4: Python Inference Only

```bash
# Single episode
python inference.py

# Multiple episodes
python inference.py --episodes 5
```

---

## Docker Deployment

### Build Image

```bash
docker build -t smartinbox:latest .
```

### Run Container

```bash
docker run -p 8000:8000 \
  -e OPENAI_API_KEY=sk-... \
  -e MODEL_NAME=gpt-4o-mini \
  smartinbox:latest
```

### Docker Compose

```bash
docker-compose up
```

---

## Usage

### Login

**Demo Credentials:**
```
Email: demo@smartinbox.com
Password: demo123
```

Or try other demo account:
```
Email: test@smartinbox.com
Password: test123
```

### Interactive Playground

1. Click "Playground" in the navigation
2. Click "New Episode"
3. You'll receive a random email to handle
4. Choose:
   - Priority classification (urgent/normal/spam)
   - Action type (reply/escalate/ignore)
   - Draft a response
5. Submit to see reward feedback
6. Continue through multi-step episodes

### View Tasks

Click "Tasks" to see all available training tasks:
- Easy: Welcome, Security (>95% accuracy)
- Medium: Meetings, Orders, Spam (70-90% accuracy)
- Hard: Urgent, Angry Customer (<70% accuracy)

### RL Specifications

Click "RL Specs" to view:
- Environment structure
- Observation space definition
- Action space specification
- Reward calculation
- Evaluation metrics

---

## Project Structure

```
SmartInboxENV/
├── src/
│   ├── components/
│   │   ├── Login.tsx              # Authentication UI
│   │   ├── Playground.tsx         # Interactive environment testing
│   │   ├── Playground2.tsx        # Advanced playground with API
│   │   ├── RLSpec.tsx             # Environment specs
│   │   ├── TaskCard.tsx           # Task definition cards
│   ├── lib/
│   │   ├── api.ts                 # API client for backend
│   │   ├── utils.ts               # Utility functions
│   ├── App.tsx                    # Main app with auth
│   ├── main.tsx                   # React entry point
│   ├── types.ts                   # TypeScript types
│   ├── constants.ts               # Task definitions
│   └── index.css                  # Global styles
├── env/
│   ├── environment.py             # SmartInboxEnv class
│   ├── models.py                  # Pydantic models
│   ├── grader.py                  # Reward calculation
│   ├── tasks.py                   # Task definitions
├── server.ts                      # Express.js backend
├── env_bridge.py                  # Python↔Node.js bridge
├── inference.py                   # Standalone inference runner
├── openenv.yaml                   # Environment config
├── Dockerfile                     # Container definition
├── package.json                   # Node dependencies and scripts
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite configuration
└── README.md                      # This file
```

---

## API Endpoints

### Authentication

```
POST   /api/auth/login             # Login with email/password
GET    /api/auth/profile           # Get user profile
POST   /api/auth/logout            # Logout
```

### Environment

```
POST   /api/env/reset              # Reset environment for new episode
POST   /api/env/step               # Execute action in environment
GET    /api/env/state              # Get current state
GET    /api/env/observation        # Get current observation
```

### Tasks

```
GET    /api/tasks                  # List all tasks
GET    /api/tasks/:taskId          # Get task details
```

### Episodes

```
POST   /api/episodes               # Start new episode
GET    /api/episodes/:episodeId    # Get episode details
POST   /api/episodes/:episodeId    # Update episode with step result
```

### Inference

```
POST   /api/inference/run          # Run inference (multi-episode)
GET    /api/inference/:inferenceId # Get inference results
```

### Health

```
GET    /api/health                 # Server health check
```

---

## Environment Variables

### Frontend (.env.local)

```
# Backend server URL
VITE_API_URL=http://localhost:5000/api

# Optional: Custom environment
VITE_ENV=development
```

### Backend (server.ts)

```
PORT=5000
JWT_SECRET=your-secret-key

# Python integration
PYTHON_PATH=/usr/bin/python3
```

### Python (inference.py)

```
OPENAI_API_KEY=sk-...
MODEL_NAME=gpt-4o-mini
API_BASE_URL=https://api.openai.com/v1
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process on port 5000
lsof -i :5000
# Kill it
kill -9 <PID>
```

### Backend Connection Error

Ensure backend is running:

```bash
npm run dev:server
```

### Python Module Not Found

Install dependencies:

```bash
pip install -e .
```

### Login Not Working

- Clear browser localStorage: Developer Tools → Application → Local Storage
- Check backend is running: `npm run dev:server`
- Verify JWT_SECRET in .env.local

### CORS Errors

Backend should be running with CORS enabled. Check server.ts has:

```typescript
app.use(cors());
```

---

## Development

### Building

```bash
npm run build
```

Outputs to `dist/` directory.

### Type Checking

```bash
npm run lint
```

### Cleaning Build

```bash
npm run clean
```

---

## Performance Tips

- **Backend**: Runs on port 5000 (separate from Vite dev server)
- **Frontend**: Hot reload enabled for development
- **Python**: Inference runs in subprocess (non-blocking)

---

## Production Deployment

### 1. Build Frontend

```bash
npm run build
```

### 2. Build Docker Image

```bash
docker build -t smartinbox:latest .
```

### 3. Deploy Container

```bash
docker run -p 8000:8000 \
  -e JWT_SECRET=prod-secret \
  -e OPENAI_API_KEY=sk-... \
  -e NODE_ENV=production \
  smartinbox:latest
```

---

## Next Steps

1. **Try the Demo** - Login and explore the interactive playground
2. **Read the Specs** - Understand the environment structure
3. **Train an Agent** - Use the API to build your own agent
4. **Deploy** - Use Docker to deploy your system

---

## Support

For issues or questions:
1. Check the README.md
2. Review API documentation in server.ts
3. Inspect browser console (F12)
4. Check server logs (npm run dev:server)

---

## License

MIT - See LICENSE file for details
