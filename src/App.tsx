/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { RLSpec } from './components/RLSpec';
import { TaskCard } from './components/TaskCard';
import { Playground } from './components/Playground';
import { TASKS, EXAMPLE_THREADS } from './constants';
import { cn } from './lib/utils';
import { LayoutDashboard, BookOpen, Target, PlayCircle, Mail, Database, LogOut, User } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'tasks' | 'playground' | 'data'>('overview');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'specs', label: 'RL Specs', icon: BookOpen },
    { id: 'tasks', label: 'Tasks', icon: Target },
    { id: 'playground', label: 'Playground', icon: PlayCircle },
    { id: 'data', label: 'Example Data', icon: Database },
  ] as const;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">SmartInbox</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">OpenEnv RL Environment</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      activeTab === tab.id 
                        ? "bg-slate-100 text-slate-900" 
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
              
              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="hidden sm:flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                    "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                    "transition-colors"
                  )}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-12">
              <section className="max-w-3xl">
                <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                  The Future of Email Triage, <span className="text-indigo-600">Automated by RL.</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  SmartInbox is a high-fidelity reinforcement learning environment designed to train agents in the art of email management. It simulates the complexities of real-world communication, including shifting priorities, emotional nuances, and multi-step conversation threads.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">Sentiment-Aware</h3>
                    <p className="text-sm text-slate-500">Agents must detect and respond appropriately to the sender's emotional state (Angry, Neutral, Happy).</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">Priority Triage</h3>
                    <p className="text-sm text-slate-500">Dynamic classification of threads into Urgent, Normal, or Spam based on evolving context.</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Key Environment Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: 'Multi-Step Threads', desc: 'Conversation history matters for context.' },
                    { title: 'Partial Rewards', desc: 'Rewards for sentiment matching and speed.' },
                    { title: 'Critical Penalties', desc: 'Heavy penalties for mishandling urgent mail.' },
                    { title: 'Extensible Tasks', desc: 'From basic triage to complex resolution.' },
                  ].map((feature, i) => (
                    <div key={i} className="bg-slate-900 p-6 rounded-2xl text-white">
                      <h4 className="font-bold mb-2">{feature.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'specs' && <RLSpec />}

          {activeTab === 'tasks' && (
            <div className="space-y-8">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Training Tasks</h2>
                <p className="text-slate-600">We provide three standard tasks to benchmark agent performance across different difficulty levels.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TASKS.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'playground' && <Playground />}

          {activeTab === 'data' && (
            <div className="space-y-8">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Example Data</h2>
                <p className="text-slate-600">Sample email threads used for environment initialization and testing.</p>
              </div>
              <div className="bg-slate-950 rounded-2xl p-8 overflow-x-auto shadow-2xl">
                <pre className="text-indigo-300 font-mono text-sm">
                  {JSON.stringify(EXAMPLE_THREADS, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">SmartInbox OpenEnv</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Documentation</a>
            <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">GitHub</a>
            <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Paper</a>
          </div>
          <p className="text-xs text-slate-400">© 2026 SmartInbox RL Environment. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
