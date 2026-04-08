/**
 * SmartInboxENV Backend Server
 * Express.js server that bridges the React frontend with the Python environment
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { spawn } from 'child_process';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Demo users
const DEMO_USERS = [
  { id: 'demo-user', email: 'demo@smartinbox.com', password: 'demo123', name: 'Demo User' },
  { id: 'test-user', email: 'test@smartinbox.com', password: 'test123', name: 'Test User' },
];

// In-memory storage
const userSessions: Map<string, any> = new Map();
const episodes: Map<string, any> = new Map();

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  const user = DEMO_USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  userSessions.set(user.id, { ...user, token });

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

app.get('/api/auth/profile', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const user = req.user;
  const stats = {
    episodesCompleted: Math.floor(Math.random() * 50),
    averageScore: (0.5 + Math.random() * 0.5).toFixed(2),
    tasksMastered: Math.floor(Math.random() * 7),
  };

  res.json({ ...user, stats });
});

app.post('/api/auth/logout', authMiddleware as any, (req: AuthRequest, res: Response) => {
  if (req.user) {
    userSessions.delete(req.user.id);
  }
  res.json({ message: 'Logged out successfully' });
});

// ============================================================================
// ENVIRONMENT ENDPOINTS
// ============================================================================

// Store current environment state per user
const envStates: Map<string, any> = new Map();

app.post('/api/env/reset', authMiddleware as any, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    
    // Call Python environment reset
    const state = await callPythonEnv('reset', {});
    envStates.set(userId, state);

    res.json(state);
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset environment', error: String(error) });
  }
});

app.post('/api/env/step', authMiddleware as any, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { action } = req.body;

    if (!action) {
      return res.status(400).json({ message: 'Action required' });
    }

    const result = await callPythonEnv('step', { action });
    envStates.set(userId, result);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to execute step', error: String(error) });
  }
});

app.get('/api/env/state', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const state = envStates.get(userId) || null;

  res.json(state || { message: 'No active environment' });
});

app.get('/api/env/observation', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const state = envStates.get(userId);

  if (!state || !state.observation) {
    return res.status(400).json({ message: 'Environment not initialized' });
  }

  res.json(state.observation);
});

// ============================================================================
// TASKS ENDPOINTS
// ============================================================================

const TASKS_DEFINITION = [
  {
    id: 'easy_welcome',
    name: 'Welcome Email',
    difficulty: 'easy',
    description: 'Handle welcome onboarding emails',
    episodes: 100,
  },
  {
    id: 'easy_security',
    name: 'Security Notification',
    difficulty: 'easy',
    description: 'Identify security notifications',
    episodes: 100,
  },
  {
    id: 'normal_meeting',
    name: 'Meeting Reminder',
    difficulty: 'normal',
    description: 'Manage meeting reminders',
    episodes: 80,
  },
  {
    id: 'normal_order',
    name: 'Order Tracking',
    difficulty: 'normal',
    description: 'Process order notifications',
    episodes: 80,
  },
  {
    id: 'spam_detection',
    name: 'Spam Detection',
    difficulty: 'normal',
    description: 'Identify and ignore spam',
    episodes: 100,
  },
  {
    id: 'urgent_business',
    name: 'Urgent Business',
    difficulty: 'medium',
    description: 'Handle urgent requests',
    episodes: 60,
  },
  {
    id: 'angry_customer',
    name: 'Angry Customer',
    difficulty: 'hard',
    description: 'Handle upset customers',
    episodes: 50,
  },
];

app.get('/api/tasks', authMiddleware as any, (req: AuthRequest, res: Response) => {
  res.json(TASKS_DEFINITION);
});

app.get('/api/tasks/:taskId', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const task = TASKS_DEFINITION.find((t) => t.id === req.params.taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json(task);
});

// ============================================================================
// EPISODES ENDPOINTS
// ============================================================================

app.post('/api/episodes', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const { taskId } = req.body;
  const episodeId = `ep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const episode = {
    id: episodeId,
    taskId,
    userId: req.user!.id,
    startTime: new Date(),
    steps: [],
    finalScore: 0,
    completed: false,
  };

  episodes.set(episodeId, episode);

  res.json(episode);
});

app.get('/api/episodes/:episodeId', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const episode = episodes.get(req.params.episodeId);

  if (!episode || episode.userId !== req.user!.id) {
    return res.status(404).json({ message: 'Episode not found' });
  }

  res.json(episode);
});

app.post('/api/episodes/:episodeId', authMiddleware as any, (req: AuthRequest, res: Response) => {
  const episode = episodes.get(req.params.episodeId);

  if (!episode || episode.userId !== req.user!.id) {
    return res.status(404).json({ message: 'Episode not found' });
  }

  const { result } = req.body;
  episode.steps.push(result);
  episode.finalScore = result.score || 0;

  if (result.done) {
    episode.completed = true;
    episode.endTime = new Date();
  }

  episodes.set(req.params.episodeId, episode);

  res.json(episode);
});

// ============================================================================
// INFERENCE ENDPOINTS
// ============================================================================

app.post('/api/inference/run', authMiddleware as any, async (req: AuthRequest, res: Response) => {
  try {
    const { numEpisodes = 1 } = req.body;
    const inferenceId = `inf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Call Python inference script
    const result = await callPythonInference(numEpisodes);

    res.json({
      inferenceId,
      userId: req.user!.id,
      numEpisodes,
      result,
      startTime: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Inference failed', error: String(error) });
  }
});

app.get('/api/inference/:inferenceId', authMiddleware as any, (req: AuthRequest, res: Response) => {
  res.json({
    inferenceId: req.params.inferenceId,
    userId: req.user!.id,
    status: 'completed',
  });
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Call Python environment functions
 */
async function callPythonEnv(command: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '..', 'env_bridge.py');
    const process = spawn('python', [pythonScript], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let output = '';
    let error = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (err) {
          resolve({ command, data, status: 'success' });
        }
      } else {
        reject(new Error(error || `Process exited with code ${code}`));
      }
    });

    process.stdin.write(JSON.stringify({ command, data }));
    process.stdin.end();
  });
}

/**
 * Call Python inference script
 */
async function callPythonInference(numEpisodes: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const process = spawn('python', [
      path.join(__dirname, '..', 'inference.py'),
      '--episodes',
      numEpisodes.toString(),
    ]);

    let output = '';
    let error = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve({
          episodes: numEpisodes,
          output,
          averageScore: (0.5 + Math.random() * 0.5).toFixed(2),
        });
      } else {
        reject(new Error(error || `Inference failed with code ${code}`));
      }
    });
  });
}

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SmartInboxENV server running on http://0.0.0.0:${PORT}`);
  console.log(`API endpoints available at http://0.0.0.0:${PORT}/api`);
});
