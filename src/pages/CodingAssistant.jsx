import React, { useState } from 'react';
import { Card } from '../components/DashboardCard';
import { Code2 } from 'lucide-react';
import { askStudyAI } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

export function CodingAssistant() {
  const { addToast, activeNoteContext } = useAuth();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null);

  const handleAsk = async () => {
    if (!query.trim()) return addToast('Please enter a coding question.', 'info');
    setLoading(true);
    try {
      const res = await askStudyAI(query, [], activeNoteContext);
      setAnswer(res.explanation || JSON.stringify(res));
    } catch (e) { addToast('AI failed to respond.', 'error'); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-3"><Code2 className="w-6 h-6 text-indigo-600"/> Coding Assistant</h1>
        <p className="text-xs text-slate-500">AI-powered coding help for assignments and practice problems.</p>
      </div>
      <Card>
        <textarea className="w-full p-3 rounded border" rows={4} placeholder="Ask about algorithms, debug help, or request code snippets" value={query} onChange={(e)=>setQuery(e.target.value)} />
        <div className="flex gap-3 mt-3">
          <button className="btn btn-primary" onClick={handleAsk} disabled={loading}>{loading? 'Thinking...':'Ask AI'}</button>
          <button className="btn" onClick={()=>{ setQuery(''); setAnswer(null); }}>Clear</button>
        </div>
      </Card>
      {answer && (
        <Card>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: answer.replace(/\n/g, '<br/>') }} />
        </Card>
      )}
    </div>
  );
}

export default CodingAssistant;
