import React, { useState } from 'react';
import { Card } from '../components/DashboardCard';
import { Briefcase } from 'lucide-react';
import { generateCareerTips } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

export function CareerHub() {
  const { addToast } = useAuth();
  const [role, setRole] = useState('internship');
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateCareerTips(role);
      setTips(res);
    } catch (e) { addToast('Failed to fetch career tips.', 'error'); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-3"><Briefcase className="w-6 h-6 text-yellow-600"/> Career Hub</h1>
        <p className="text-xs text-slate-500">Internship & career guidance with AI-assisted CV/resume suggestions.</p>
      </div>
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input className="input" value={role} onChange={e=>setRole(e.target.value)} placeholder="Role (e.g., backend-intern)" />
          <div />
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>{loading? 'Working...':'Get Tips'}</button>
            <button className="btn" onClick={()=>setTips(null)}>Clear</button>
          </div>
        </div>
      </Card>
      {tips && (
        <div className="space-y-3">
          <Card>
            <div className="font-semibold">Resume Tips</div>
            <ul className="list-disc list-inside mt-2">
              {(tips.resumeTips||[]).map((t,i)=> <li key={i}>{t}</li>)}
            </ul>
          </Card>
          <Card>
            <div className="font-semibold">Interview Tips</div>
            <ul className="list-disc list-inside mt-2">
              {(tips.interviewTips||[]).map((t,i)=> <li key={i}>{t}</li>)}
            </ul>
          </Card>
          <Card>
            <div className="font-semibold">Sample Resume Bullet</div>
            <div className="mt-2 text-sm text-slate-700">{tips.sampleBullet}</div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default CareerHub;
