import React, { useState } from 'react';
import { Card } from '../components/DashboardCard';
import { Bot } from 'lucide-react';
import { generateQuiz } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

export function Quiz() {
  const { currentUser, addNote, addToast } = useAuth();
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);

  const { uploadedNotes } = useAuth();
  const [selectedNoteId, setSelectedNoteId] = useState('');

  const handleGenerate = async () => {
    if (!topic && !selectedNoteId) return addToast('Please enter a topic or select a note to generate questions.', 'info');
    setLoading(true);
    try {
      const noteContext = uploadedNotes?.find(n => n.id === selectedNoteId) || null;
      const result = await generateQuiz(topic, count, difficulty, noteContext);
      setQuiz(result.quiz || []);
      if (!topic && noteContext) setTopic(noteContext.fileName || 'Note-based Quiz');
    } catch (err) {
      addToast('Failed to generate quiz. Using fallback questions.', 'error');
    } finally { setLoading(false); }
  };

  const handleSave = () => {
    if (!quiz || quiz.length === 0) return addToast('Nothing to save.', 'info');
    const note = {
      title: `Quiz: ${topic}`,
      content: JSON.stringify(quiz, null, 2),
      createdAt: new Date().toISOString(),
      type: 'quiz'
    };
    addNote(note);
    addToast('Quiz saved to your Notes.', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold flex items-center gap-3"><Bot className="w-6 h-6 text-blue-600"/> Quiz Generator</h1>
        <p className="text-xs text-slate-500">Generate practice quizzes from topics or uploaded notes.</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input className="input" placeholder="Topic (e.g., Gradient Descent)" value={topic} onChange={(e) => setTopic(e.target.value)} />
          <select className="input" value={selectedNoteId} onChange={(e) => setSelectedNoteId(e.target.value)}>
            <option value="">Use Uploaded Note (optional)</option>
            {useAuth().uploadedNotes?.map((n) => (
              <option key={n.id} value={n.id}>{n.fileName || n.id}</option>
            ))}
          </select>
          <input className="input" type="number" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} />
          <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex gap-3 mt-4">
          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>{loading ? 'Generating...' : 'Generate Quiz'}</button>
          <button className="btn" onClick={handleSave} disabled={!quiz || quiz.length===0}>Save to Notes</button>
        </div>
      </Card>

      {quiz && (
        <div className="space-y-4">
          {quiz.map((q, idx) => (
            <Card key={idx}>
              <div className="text-sm">
                <div className="font-semibold">{idx + 1}. {q.question}</div>
                <ul className="list-disc list-inside mt-2">
                  {q.options?.map((opt, i) => (
                    <li key={i} className={i === q.answerIndex ? 'text-emerald-600 font-medium' : ''}>{opt}</li>
                  ))}
                </ul>
                {q.explanation && <div className="mt-2 text-xs text-slate-500">Explanation: {q.explanation}</div>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Quiz;
