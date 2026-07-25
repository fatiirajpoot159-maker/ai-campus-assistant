import React, { useState } from 'react';
import { Card } from '../components/DashboardCard';
import { Mail } from 'lucide-react';
import { generateEmail } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

export function EmailWriter() {
  const { addToast } = useAuth();
  const [recipient, setRecipient] = useState('Professor');
  const [subject, setSubject] = useState('');
  const [purpose, setPurpose] = useState('Requesting meeting to discuss assignment');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateEmail(recipient, subject, purpose, tone);
      setEmail(res);
    } catch (e) { addToast('Failed to generate email.', 'error'); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-3"><Mail className="w-6 h-6 text-pink-600"/> Email Writer</h1>
        <p className="text-xs text-slate-500">Generate professional emails for professors, internships, and networking.</p>
      </div>
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className="input" value={recipient} onChange={e=>setRecipient(e.target.value)} placeholder="Recipient (e.g., Professor Khan)" />
          <input className="input" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject" />
          <textarea className="input col-span-2" rows={3} value={purpose} onChange={e=>setPurpose(e.target.value)} />
          <select className="input" value={tone} onChange={e=>setTone(e.target.value)}>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
          </select>
        </div>
        <div className="flex gap-3 mt-3">
          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>{loading? 'Generating...':'Generate Email'}</button>
          <button className="btn" onClick={()=>{ setEmail(null); setSubject(''); setPurpose(''); }}>Clear</button>
        </div>
      </Card>
      {email && (
        <Card>
          <div className="font-semibold">{email.subject}</div>
          <div className="whitespace-pre-wrap mt-2 text-sm text-slate-700">{email.body}</div>
        </Card>
      )}
    </div>
  );
}

export default EmailWriter;
