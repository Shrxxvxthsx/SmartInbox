import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { cn } from '../lib/utils';
import { Mail, Send, Zap, AlertCircle, CheckCircle, Loader, Play, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Playground: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [observation, setObservation] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<'urgent' | 'normal' | 'spam'>('normal');
  const [selectedAction, setSelectedAction] = useState<'reply' | 'escalate' | 'ignore'>('reply');
  const [response, setResponse] = useState('');
  const [episodeActive, setEpisodeActive] = useState(false);
  const [episodeStats, setEpisodeStats] = useState<any>(null);

  const initializeEpisode = async () => {
    setLoading(true);
    try {
      const obs = await apiClient.env.reset();
      setObservation(obs);
      setEpisodeActive(true);
      setHistory([]);
      setResponse('');
      setEpisodeStats({ totalReward: 0, steps: 0 });
    } catch (error) {
      console.error('Failed to reset:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async () => {
    if (!response.trim()) {
      alert('Please enter a response');
      return;
    }

    setLoading(true);
    try {
      const action = {
        classification: selectedPriority,
        action_type: selectedAction,
        response,
      };

      const result = await apiClient.env.step(action);
      
      const step = {
        action,
        reward: result.reward,
        done: result.done,
        observation: result.observation,
      };

      setHistory([...history, step]);
      setObservation(result.observation);
      setResponse('');

      if (episodeStats) {
        setEpisodeStats({
          totalReward: episodeStats.totalReward + result.reward,
          steps: episodeStats.steps + 1,
        });
      }

      if (result.done) {
        setEpisodeActive(false);
      }
    } catch (error) {
      console.error('Failed to execute action:', error);
      alert('Failed to execute action');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Interactive Playground</h2>
        <p className="text-slate-600">Test the SmartInbox environment in real-time. Start a new episode and make decisions to train your agent.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Playground */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Email */}
          {observation ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{observation.sender}</h3>
                    <p className="text-sm text-slate-500">{observation.email_text.substring(0, 60)}...</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    observation.priority === 'urgent' && "bg-red-100 text-red-700",
                    observation.priority === 'normal' && "bg-blue-100 text-blue-700",
                    observation.priority === 'spam' && "bg-yellow-100 text-yellow-700"
                  )}>
                    {observation.priority.toUpperCase()}
                  </span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    observation.sentiment === 'angry' && "bg-red-100 text-red-700",
                    observation.sentiment === 'neutral' && "bg-slate-100 text-slate-700",
                    observation.sentiment === 'happy' && "bg-green-100 text-green-700"
                  )}>
                    {observation.sentiment.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6 max-h-48 overflow-y-auto">
                <p className="text-slate-700 text-sm leading-relaxed">{observation.email_text}</p>
              </div>

              {observation.history.length > 0 && (
                <div className="text-xs text-slate-500 space-y-2">
                  <p className="font-semibold">Thread History:</p>
                  {observation.history.map((item: string, i: number) => (
                    <p key={i} className="italic">{item}</p>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">No active episode. Start a new one to begin.</p>
              <button
                onClick={initializeEpisode}
                disabled={loading}
                className={cn(
                  "px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold",
                  "hover:bg-indigo-700 disabled:opacity-50",
                  "flex items-center justify-center gap-2 mx-auto"
                )}
              >
                {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Start Episode
              </button>
            </div>
          )}

          {/* Action Controls */}
          {episodeActive && observation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6"
            >
              <h3 className="font-bold text-slate-900">Your Response</h3>

              {/* Classification */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Priority Classification
                </label>
                <div className="flex gap-3">
                  {(['urgent', 'normal', 'spam'] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setSelectedPriority(priority)}
                      className={cn(
                        "flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all",
                        selectedPriority === priority
                          ? priority === 'urgent'
                            ? "bg-red-100 text-red-700 border-2 border-red-500"
                            : priority === 'normal'
                            ? "bg-blue-100 text-blue-700 border-2 border-blue-500"
                            : "bg-yellow-100 text-yellow-700 border-2 border-yellow-500"
                          : "bg-slate-100 text-slate-600 border-2 border-transparent"
                      )}
                    >
                      {priority.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Action Type
                </label>
                <div className="flex gap-3">
                  {(['reply', 'escalate', 'ignore'] as const).map((action) => (
                    <button
                      key={action}
                      onClick={() => setSelectedAction(action)}
                      className={cn(
                        "flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2",
                        selectedAction === action
                          ? "bg-indigo-100 text-indigo-700 border-indigo-500"
                          : "bg-slate-100 text-slate-600 border-transparent"
                      )}
                    >
                      {action.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Response Text */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Draft Response
                </label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="What's your response to this email?"
                  className={cn(
                    "w-full px-4 py-3 border border-slate-200 rounded-lg",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                    "resize-none"
                  )}
                  rows={4}
                />
              </div>

              {/* Submit */}
              <button
                onClick={executeAction}
                disabled={loading || !response.trim()}
                className={cn(
                  "w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold",
                  "hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed",
                  "flex items-center justify-center gap-2",
                  "transition-all"
                )}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Action
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>

        {/* Sidebar Stats and History */}
        <div className="space-y-6">
          {/* Episode Stats */}
          {episodeStats && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="font-bold text-slate-900 mb-4">Episode Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Steps</p>
                  <p className="text-2xl font-bold text-indigo-600">{episodeStats.steps}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold">Total Reward</p>
                  <p className="text-2xl font-bold text-green-600">{episodeStats.totalReward.toFixed(2)}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <button
              onClick={initializeEpisode}
              disabled={loading || episodeActive}
              className={cn(
                "w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold",
                "hover:bg-indigo-700 disabled:opacity-50",
                "flex items-center justify-center gap-2"
              )}
            >
              <Play className="w-4 h-4" />
              New Episode
            </button>
            <button
              onClick={() => {
                setEpisodeActive(false);
                setHistory([]);
                setObservation(null);
                setEpisodeStats(null);
              }}
              disabled={loading}
              className={cn(
                "w-full px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold",
                "hover:bg-slate-300 disabled:opacity-50",
                "flex items-center justify-center gap-2"
              )}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-h-96 overflow-y-auto">
              <h3 className="font-bold text-slate-900 mb-4">History</h3>
              <div className="space-y-3">
                <AnimatePresence>
                  {history.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200"
                    >
                      <p className="font-semibold text-slate-900">Step {idx + 1}</p>
                      <p className="text-slate-600 mt-1">
                        Action: <span className="font-mono text-indigo-600">{step.action.action_type}</span>
                      </p>
                      <p className="text-slate-600">
                        Reward: <span className={`font-semibold ${step.reward > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {step.reward.toFixed(2)}
                        </span>
                      </p>
                      {step.done && (
                        <p className="text-green-600 font-semibold mt-2">✓ Episode Complete</p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
