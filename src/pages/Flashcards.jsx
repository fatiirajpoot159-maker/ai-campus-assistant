import React, { useState } from 'react';
import { Card } from '../components/DashboardCard';
import { Layers } from 'lucide-react';
import { generateFlashcards } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

export function Flashcards() {
  const { addNote, uploadedNotes, addToast } = useAuth();
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedNote, setSelectedNote] = useState('');

  const handleGenerate = async () => {
    if (!topic && !selectedNote) return addToast('Enter a topic or select a note.', 'info');
    setLoading(true);
    try {
      const noteCtx = uploadedNotes?.find(n => n.id === selectedNote) || null;
      const res = await generateFlashcards(topic || noteCtx?.fileName, count, noteCtx);
      setCards(res.flashcards || []);
    } catch (e) {
      addToast('Failed to generate flashcards.', 'error');
    } finally { setLoading(false); }
  };

  const handleSave = () => {
    if (!cards.length) return addToast('No flashcards to save.', 'info');
    const note = { title: `Flashcards: ${topic || 'Note'}`, content: JSON.stringify(cards, null, 2), createdAt: new Date().toISOString(), type: 'flashcards' };
    addNote(note);
    addToast('Flashcards saved to Notes.', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-3"><Layers className="w-6 h-6 text-emerald-600"/> Flashcards</h1>
        <p className="text-xs text-slate-500">Create spaced-repetition flashcards from your notes or topics.</p>
      </div>
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input className="input" placeholder="Topic or leave blank to use note" value={topic} onChange={(e)=>setTopic(e.target.value)} />
          <select className="input" value={selectedNote} onChange={(e)=>setSelectedNote(e.target.value)}>
            <option value="">Use Uploaded Note (optional)</option>
            {uploadedNotes?.map(n => <option key={n.id} value={n.id}>{n.fileName || n.id}</option>)}
          </select>
          <input className="input" type="number" min={1} max={30} value={count} onChange={(e)=>setCount(Number(e.target.value))} />
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>{loading? 'Generating...':'Generate'}</button>
            <button className="btn" onClick={handleSave} disabled={!cards.length}>Save</button>
          </div>
        </div>
      </Card>
      <div className="space-y-3">
        {cards.map(c => (
          <Card key={c.id}>
            <div className="font-semibold">{c.front}</div>
            <div className="text-sm text-slate-600 mt-2">{c.back}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Flashcards;
