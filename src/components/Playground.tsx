
import React, { useState } from 'react';
import { EXAMPLE_THREADS } from '../constants';
import { EmailThread, ActionSpace, RewardResult, Priority, Sentiment } from '../types';
import { cn } from '../lib/utils';
import { Mail, Send, Archive, Trash2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Playground: React.FC = () => {
  const [currentThreadIndex, setCurrentThreadIndex] = useState(0);
  const [history, setHistory] = useState<RewardResult[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<Priority | ''>('');
  const [selectedSentiment, setSelectedSentiment] = useState<Sentiment | ''>('');

  const currentThread = EXAMPLE_THREADS[currentThreadIndex];
  const lastMessage = currentThread.messages[currentThread.messages.length - 1];

  const calculateReward = (action: ActionSpace): RewardResult => {
    let score = 0;
    let accuracy = 0;
    let sentiment_match = 0;
    let penalty = 0;
    let message = '';

    if (action.type === 'triage') {
      if (action.priority_assignment === currentThread.priority) {
        accuracy = 1.0;
        score += 1.0;
        message = 'Correct priority assignment!';
      } else {
        accuracy = -1.0;
        score -= 1.0;
        message = `Incorrect priority. Expected ${currentThread.priority}.`;
      }
    } else if (action.type === 'reply') {
      if (action.response_sentiment === 'happy' && lastMessage.sentiment === 'angry') {
        sentiment_match = 0.5;
        score += 0.5;
        message = 'Empathetic response to angry sender!';
      } else if (action.response_sentiment === lastMessage.sentiment) {
        sentiment_match = 0.5;
        score += 0.5;
        message = 'Sentiment matched!';
      } else {
        sentiment_match = -0.2;
        score -= 0.2;
        message = 'Sentiment mismatch.';
      }
    } else if (action.type === 'delete' && currentThread.priority === 'urgent') {
      penalty = -2.0;
      score -= 2.0;
      message = 'Critical failure: Deleted urgent email!';
    } else if (action.type === 'archive' && currentThread.priority === 'urgent') {
      penalty = -1.0;
      score -= 1.0;
      message = 'Warning: Archived urgent email without response.';
    } else {
      score += 0.5;
      message = 'Standard action processed.';
    }

    return {
      score,
      breakdown: { accuracy, sentiment_match, speed_bonus: 0, penalty },
      message
    };
  };

  const handleAction = (type: ActionSpace['type']) => {
    const action: ActionSpace = {
      type,
      priority_assignment: selectedPriority as Priority,
      response_sentiment: selectedSentiment as Sentiment
    };

    const result = calculateReward(action);
    setHistory([result, ...history]);
    
    // Move to next thread
    setTimeout(() => {
      setCurrentThreadIndex((prev) => (prev + 1) % EXAMPLE_THREADS.length);
      setSelectedPriority('');
      setSelectedSentiment('');
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Simulation Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Current Observation</span>
            </div>
            <div className="text-xs font-mono text-slate-400">Thread ID: {currentThread.id}</div>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{lastMessage.subject}</h4>
                  <p className="text-sm text-slate-500">From: {lastMessage.sender}</p>
                </div>
                <div className={cn(
                  "px-2 py-1 rounded text-xs font-bold uppercase",
                  lastMessage.sentiment === 'angry' ? "bg-rose-100 text-rose-700" :
                  lastMessage.sentiment === 'happy' ? "bg-emerald-100 text-emerald-700" :
                  "bg-slate-100 text-slate-700"
                )}>
                  {lastMessage.sentiment}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-slate-700 text-sm leading-relaxed border border-slate-100 italic">
                "{lastMessage.body}"
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assign Priority</label>
                <div className="flex gap-2">
                  {(['urgent', 'normal', 'spam'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPriority(p)}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all",
                        selectedPriority === p 
                          ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                      )}
                    >
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Response Sentiment</label>
                <div className="flex gap-2">
                  {(['angry', 'neutral', 'happy'] as Sentiment[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSentiment(s)}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all",
                        selectedSentiment === s 
                          ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                      )}
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
              <button 
                onClick={() => handleAction('triage')}
                disabled={!selectedPriority}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Triage
              </button>
              <button 
                onClick={() => handleAction('reply')}
                disabled={!selectedSentiment}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" /> Reply
              </button>
              <button 
                onClick={() => handleAction('archive')}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                <Archive className="w-4 h-4" /> Archive
              </button>
              <button 
                onClick={() => handleAction('delete')}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-indigo-500 shrink-0" />
          <p className="text-sm text-indigo-700">
            <strong>Simulation Note:</strong> In a real RL environment, the agent would receive the observation as a tensor and output a discrete or continuous action vector. This playground visualizes the logic behind the reward function.
          </p>
        </div>
      </div>

      {/* Reward History */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">Reward Log</h4>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {history.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm italic">
                No actions taken yet.
              </div>
            )}
            {history.map((res, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "p-4 rounded-xl border flex items-start gap-3",
                  res.score > 0 ? "bg-emerald-50 border-emerald-100" : 
                  res.score < 0 ? "bg-rose-50 border-rose-100" : 
                  "bg-slate-50 border-slate-200"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-sm",
                  res.score > 0 ? "bg-emerald-500 text-white" : 
                  res.score < 0 ? "bg-rose-500 text-white" : 
                  "bg-slate-500 text-white"
                )}>
                  {res.score > 0 ? `+${res.score}` : res.score}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{res.message}</p>
                  <div className="flex gap-2 mt-1">
                    {res.breakdown.accuracy !== 0 && (
                      <span className="text-[10px] font-bold uppercase text-slate-400">Accuracy: {res.breakdown.accuracy}</span>
                    )}
                    {res.breakdown.sentiment_match !== 0 && (
                      <span className="text-[10px] font-bold uppercase text-slate-400">Sentiment: {res.breakdown.sentiment_match}</span>
                    )}
                    {res.breakdown.penalty !== 0 && (
                      <span className="text-[10px] font-bold uppercase text-rose-400">Penalty: {res.breakdown.penalty}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
