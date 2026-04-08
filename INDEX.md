# SmartInboxENV - Master Index

Welcome! This document guides you through the complete SmartInboxENV system.

---

## 🎯 Quick Start (5 Minutes)

```bash
# 1. Install
npm install

# 2. Run
npm run dev:all

# 3. Open
http://localhost:3000

# 4. Login
Email: demo@smartinbox.com
Password: demo123
```

**That's it!** You're now using a complete RL environment.

---

## 📖 Documentation Map

Choose your adventure:

### 🚀 Just Want to Use It?
↳ Go to **QUICK_REFERENCE.md**
- Commands to run
- How to login
- How to use the playground
- Troubleshooting

### 🏗️ Want to Understand the Architecture?
↳ Go to **SYSTEM_OVERVIEW.md**
- How everything connects
- Data flow diagrams
- Component descriptions
- Customization points

### 📚 Want Step-by-Step Setup Help?
↳ Go to **GETTING_STARTED.md**
- Prerequisites
- Installation with details
- Configuration
- Running options
- Deployment

### 📋 Want Complete Project Overview?
↳ Go to **README.md**
- Problem description
- Real-world relevance
- Features
- Setup
- Example runs

### 🔧 Want Technical Details?
↳ Go to **INTEGRATION_SUMMARY.md**
- File structure
- API endpoints
- Development workflow
- Testing procedures

### 📐 Want Environment Specification?
↳ Go to **openenv.yaml**
- Observation space
- Action space
- Reward structure
- Task definitions

---

## What You Just Got

### ✨ A Complete System

```
┌─── Frontend (React + TypeScript) ────┐
│  • Beautiful login UI                 │
│  • Interactive playground              │
│  • Task browser                       │
│  • Real-time feedback                 │
└──────────────────────────────────────┘
           │
           │ REST API
           ▼
┌─── Backend (Express.js) ────────────┐
│  • JWT authentication                │
│  • User session management           │
│  • Episode tracking                  │
│  • Python environment bridge         │
└──────────────────────────────────────┘
           │
           │ JSON Bridge
           ▼
┌─── Python Environment ───────────────┐
│  • SmartInbox RL Environment          │
│  • 7 training tasks                   │
│  • Reward grading                     │
│  • Email simulation                   │
└──────────────────────────────────────┘
```

### 📦 What's Included

- ✅ 3-tier architecture (Frontend/Backend/Python)
- ✅ Complete React UI with login
- ✅ Express API with 15+ endpoints
- ✅ Python RL environment with 7 tasks
- ✅ JWT authentication
- ✅ Real-time environment interaction
- ✅ Docker containerization
- ✅ Production-ready configuration

---

## 🎮 Quick Feature Tour

### Login System
- Demo accounts pre-configured
- JWT token management
- Session persistence
- Logout functionality

### Interactive Playground
- Display random emails
- Classify by priority (urgent/normal/spam)
- Choose action (reply/escalate/ignore)
- Draft responses
- See instant reward feedback
- Track episode statistics

### Task Browser
- View all 7 available tasks
- See difficulty levels
- Understand learning objectives

### RL Specifications
- View observation space definition
- View action space definition
- Understand reward calculation

### Environment Backend
- 7 tasks (Easy/Medium/Hard)
- Sentiment detection (angry/neutral/happy)
- Priority classification
- Multi-step episodes
- Comprehensive grading

---

## 📊 System Statistics

| Metric | Value |
|--------|-------|
| Frontend Framework | React 19 + TypeScript |
| Backend Framework | Express.js + Node.js |
| RL Environment | Python 3.10+ |
| API Endpoints | 15+ |
| Training Tasks | 7 |
| Authentication | JWT (24h) |
| Database | In-memory (demo) |
| Docker Support | ✅ Yes |

---

## 🔧 Development Quick Links

### File Locations

```
Frontend Components:
└─ src/components/
   ├─ Login.tsx              (Auth UI)
   ├─ Playground2.tsx        (Interactive env)
   ├─ RLSpec.tsx             (Specs viewer)
   └─ TaskCard.tsx           (Task display)

Backend:
└─ server.ts                 (Express API)

API Client:
└─ src/lib/api.ts           (Frontend HTTP)

Python:
├─ env_bridge.py            (Node↔Python)
└─ env/
   ├─ environment.py         (RL env)
   ├─ models.py              (Data models)
   ├─ grader.py              (Rewards)
   └─ tasks.py               (Tasks)
```

### API Endpoints Summary

```
Auth:     POST   /api/auth/login
          POST   /api/auth/logout
          GET    /api/auth/profile

Env:      POST   /api/env/reset
          POST   /api/env/step
          GET    /api/env/state
          GET    /api/env/observation

Tasks:    GET    /api/tasks
          GET    /api/tasks/:taskId

Episodes: POST   /api/episodes
          GET    /api/episodes/:episodeId
          POST   /api/episodes/:episodeId

Inference:POST  /api/inference/run
          GET    /api/inference/:inferenceId

System:   GET    /api/health
```

---

## 🚀 Deployment Paths

### Development
```bash
npm run dev:all
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Production (Docker)
```bash
docker build -t smartinbox:latest .
docker run -p 8000:8000 \
  -e JWT_SECRET=prod-secret \
  -e OPENAI_API_KEY=sk-... \
  smartinbox:latest
```

### Production (Node.js)
```bash
npm run build
NODE_ENV=production node dist/server.js
```

---

## 🎓 Learning Path

### Day 1: Exploration
- [ ] Run `npm run dev:all`
- [ ] Login with demo account
- [ ] Explore all tabs (Overview, Specs, Tasks, Playground, Data)
- [ ] Start and complete one episode
- [ ] Read QUICK_REFERENCE.md

### Day 2: Understanding
- [ ] Read SYSTEM_OVERVIEW.md
- [ ] Review server.ts API implementation
- [ ] Check src/lib/api.ts client methods
- [ ] Explore env/ Python files

### Day 3: Customization
- [ ] Add a new task to env/tasks.py
- [ ] Modify reward calculation in env/grader.py
- [ ] Add a new API endpoint to server.ts
- [ ] Customize React UI

### Day 4+: Integration
- [ ] Connect real OpenAI API
- [ ] Build multi-episode training loop
- [ ] Deploy to production
- [ ] Scale infrastructure

---

## ❓ Common Questions

**Q: Can I run just the frontend?**  
A: Yes! `npm run dev` runs only React. But you won't be able to use the interactive features.

**Q: Can I run just the backend?**  
A: Yes! `npm run dev:server` runs Express only. Use cURL to test API.

**Q: Can I add more tasks?**  
A: Yes! Edit `env/tasks.py` and add to the TASKS list following the format.

**Q: Can I connect my own LLM?**  
A: Yes! Modify inference.py or create a new endpoint in server.ts.

**Q: How do I deploy?**  
A: Use Docker (`docker build . && docker run`) or see GETTING_STARTED.md

**Q: Is it production-ready?**  
A: Yes! But consider adding database persistence for production use.

---

## 🛠️ Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| Port 5000 in use | `lsof -i :5000` then `kill -9 <PID>` |
| Login fails | Clear localStorage (DevTools) |
| Backend connection error | Ensure `npm run dev:server` is running |
| Python module missing | `pip install -r requirements.txt` |
| CORS errors | Check CORS enabled in server.ts |
| Frontend not loading | Check Vite running on 3000 |

**See QUICK_REFERENCE.md for more troubleshooting.**

---

## 📞 Need Help?

### Resources in Order
1. **QUICK_REFERENCE.md** - Quick answers
2. **GETTING_STARTED.md** - Setup help
3. **SYSTEM_OVERVIEW.md** - Architecture questions
4. **Browser DevTools** - Debug frontend (F12)
5. **Server logs** - Debug backend (`npm run dev:server`)
6. **Python errors** - Check env/*.py files

---

## 🎉 You're Ready!

Everything is set up and ready to go. Your next step:

```bash
npm run dev:all
```

Then open: http://localhost:3000

Enjoy training! 🚀

---

## 📋 Documentation Checklist

- [x] README.md - Complete project overview
- [x] GETTING_STARTED.md - Setup guide
- [x] SYSTEM_OVERVIEW.md - Architecture
- [x] INTEGRATION_SUMMARY.md - Technical details
- [x] QUICK_REFERENCE.md - Command reference
- [x] THIS FILE - Master index
- [x] openenv.yaml - Environment spec
- [x] Code comments - Source documentation

---

**Last Updated: April 8, 2026**  
**SmartInboxENV v0.1.0**
