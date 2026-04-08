
import React from 'react';
import { OBSERVATION_SCHEMA, ACTION_SCHEMA, REWARD_FUNCTION_DESC } from '../constants';

export const RLSpec: React.FC = () => {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-xl font-semibold mb-4 text-slate-900">Observation Space</h3>
        <div className="bg-slate-950 rounded-lg p-6 overflow-x-auto">
          <pre className="text-emerald-400 font-mono text-sm">
            {JSON.stringify(OBSERVATION_SCHEMA, null, 2)}
          </pre>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-slate-900">Action Space</h3>
        <div className="bg-slate-950 rounded-lg p-6 overflow-x-auto">
          <pre className="text-blue-400 font-mono text-sm">
            {JSON.stringify(ACTION_SCHEMA, null, 2)}
          </pre>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-slate-900">Reward Function</h3>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
          <pre className="text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
            {REWARD_FUNCTION_DESC}
          </pre>
        </div>
      </section>
    </div>
  );
};
