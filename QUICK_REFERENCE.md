# SmartInboxENV - Quick Reference

## 🚀 Start Here

```bash
# Install & Run (all-in-one)
npm install
npm run dev:all

# Open browser
http://localhost:3000

# Demo login
Email: demo@smartinbox.com
Password: demo123
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main React app with auth |
| `src/components/Login.tsx` | Login UI component |
| `src/lib/api.ts` | Frontend → Backend API client |
| `server.ts` | Express.js backend server |
| `env_bridge.py` | Backend → Python environment bridge |
| `env/environment.py` | RL environment implementation |
| `openenv.yaml` | Environment configuration |

---

## 🔌 API Endpoints

### Auth
```
POST /api/auth/login
  → { email, password }
  ← { token, user }

POST /api/auth/logout
```

### Environment
```
POST /api/env/reset
  ← { observation, max_steps, step_count }

POST /api/env/step
  → { action: { classification, action_type, response } }
  ← { observation, reward, done, info }

GET /api/env/state
  ← { current state }
```

### Tasks & Episodes
```
GET /api/tasks
  ← [{ id, name, difficulty, description }]

POST /api/episodes
  → { taskId }
  ← { episodeId, taskId, userId, steps, completed }

POST /api/inference/run
  → { numEpisodes }
  ← { results, average_score }
```

---

## 🎮 User Flow

```
Login Screen
    ↓ (demo@smartinbox.com / demo123)
Dashboard with Tabs
    ↓
Navigate to "Playground"
    ↓
Click "Start Episode"
    ↓
Environment Reset → Observation Received
    ↓
Select: Priority + Action Type + Response
    ↓
Submit Action
    ↓
Get Reward + Next Observation
    ↓
Repeat until Done
    ↓
Episode Summary (Total Reward, Steps)
```

---

## 🛠️ Development Commands

```bash
# Frontend only (port 3000)
npm run dev

# Backend only (port 5000)
npm run dev:server

# Both simultaneously (recommended)
npm run dev:all

# Build for production
npm run build

# Type checking
npm run lint

# Clean build
npm run clean

# Python inference only
python inference.py --episodes 5
```

---

## 📦 Dependencies

### Frontend (npm)
- React 19
- Vite 6
- TypeScript
- Tailwind CSS
- Motion (animations)
- Lucide React (icons)

### Backend (npm)
- Express.js
- JWT (jsonwebtoken)
- CORS

### Python (pip)
- OpenAI
- Pydantic
- PyYAML
- NumPy
- python-dotenv

---

## 🔐 Configuration

### .env.local

```env
# Backend
PORT=5000
JWT_SECRET=dev-secret-key

# Frontend
VITE_API_URL=http://localhost:5000/api

# Inference (optional)
OPENAI_API_KEY=sk-...
MODEL_NAME=gpt-4o-mini
```

---

## 🧪 Testing

### Browser DevTools
```
F12 → Network → See API calls
F12 → Console → Check errors
F12 → Application → Local Storage (auth tokens)
```

### API Testing (curl)

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@smartinbox.com","password":"demo123"}'

# Get token, then use:
curl -X GET http://localhost:5000/api/env/state \
  -H "Authorization: Bearer YOUR_TOKEN"

# Reset
curl -X POST http://localhost:5000/api/env/reset \
  -H "Authorization: Bearer YOUR_TOKEN"

# Step
curl -X POST http://localhost:5000/api/env/step \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": {
      "classification": "urgent",
      "action_type": "reply",
      "response": "I will handle this right away."
    }
  }'
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | `lsof -i :5000` → `kill -9 <PID>` |
| Login fails | Clear localStorage → DevTools → Application |
| Backend won't connect | Ensure `npm run dev:server` running |
| CORS errors | Check CORS enabled in server.ts |
| Python not found | `pip install -r requirements.txt` |

---

## 📊 Environment Structure

### Observation
```json
{
  "email_text": "string",
  "sender": "string",
  "sentiment": "angry|neutral|happy",
  "priority": "urgent|normal|spam",
  "history": ["string"]
}
```

### Action
```json
{
  "classification": "urgent|normal|spam",
  "action_type": "reply|escalate|ignore",
  "response": "string"
}
```

### Reward
```
score: float [0.0 - 1.0]
breakdown: {
  classification_correct: bool,
  response_keyword_score: float,
  action_correct: bool,
  penalty: float
}
```

---

## 🎯 Tasks

| Difficulty | Task | Episodes | Accuracy |
|-----------|------|----------|----------|
| 🟢 Easy | Welcome Email | 100 | >95% |
| 🟢 Easy | Security Notification | 100 | >95% |
| 🟡 Normal | Meeting Reminder | 80 | 70-90% |
| 🟡 Normal | Order Tracking | 80 | 70-90% |
| 🟡 Normal | Spam Detection | 100 | 70-90% |
| 🟠 Medium | Urgent Business | 60 | <70% |
| 🔴 Hard | Angry Customer | 50 | <70% |

---

## 📚 Documentation

| File | Content |
|------|---------|
| `README.md` | Complete project overview |
| `GETTING_STARTED.md` | Step-by-step setup |
| `INTEGRATION_SUMMARY.md` | Architecture & design |
| `openenv.yaml` | Environment specification |
| `this file` | Quick reference |

---

## 🚀 Deployment Checklist

- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add `OPENAI_API_KEY` if using inference
- [ ] Run `npm run dev:all`
- [ ] Test login with demo account
- [ ] Start episode in Playground
- [ ] Submit action and verify reward
- [ ] Review API endpoints with curl
- [ ] Build with `npm run build`
- [ ] Deploy with Docker or Node.js

---

## 💡 Pro Tips

1. **Session Persistence** - Tokens stored in localStorage
2. **Environment State** - Tracked per user on backend
3. **Episode History** - Retrieved via `/api/episodes/:id`
4. **Multi-user** - Backend supports multiple concurrent users
5. **API Proxying** - Frontend calls `/api/*` → Backend handles

---

## 🔗 Important Links

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: Check server.ts comments
- Health Check: http://localhost:5000/api/health

---

## 📝 Notes

- Demo credentials expire after 24h JWT expiration
- Actions require authentication token
- Episodes stored per user in memory (refresh clears)
- Python bridge spawns subprocess per request
- HMR disabled for Docker environments

---

Happy training! 🎓
