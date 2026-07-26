import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/DashboardCard";
import { 
  History, 
  Bot, 
  FileText, 
  Calendar, 
  Trash2, 
  BookOpen, 
  Sparkles,
  ChevronRight
} from "lucide-react";
export default function StudyHistory() {
  const { savedNotes, savedPlanners, chatHistory, studySessions, clearStudySessions } = useAuth();
  const [activeTab, setActiveTab] = useState("notes");
  const [selectedItem, setSelectedItem] = useState(null);

  const exportSessionsCsv = () => {
    if (!studySessions || studySessions.length === 0) return;
    const rows = [["id", "startedAt", "endedAt", "durationMinutes"]];
    studySessions.forEach(s => rows.push([s.id, s.startedAt || "", s.endedAt || "", s.durationMinutes || ""]));
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `study_sessions_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const [undoState, setUndoState] = useState(null);

  const handleClearSessions = () => {
    if (!studySessions || studySessions.length === 0) return;
    const prev = studySessions.slice();
    clearStudySessions();
    setUndoState({ prev, visible: true });
    const t = setTimeout(() => setUndoState(null), 8000);
    setUndoState(state => ({ ...state, timeout: t }));
  };

  const handleUndo = () => {
    if (!undoState) return;
    if (undoState.timeout) clearTimeout(undoState.timeout);
    restoreStudySessions(undoState.prev || []);
    setUndoState(null);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-7 h-7 text-blue-600" />
          Study History & Vault
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Access your past AI study sessions, generated Markdown notes, and saved study planners.
        </p>
      </div>
           {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => { setActiveTab("notes"); setSelectedItem(null); }}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
            activeTab === "notes"
              ? "gradient-bg text-white shadow-md shadow-blue-500/20"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Saved Notes ({savedNotes.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab("sessions"); setSelectedItem(null); }}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
            activeTab === "sessions"
              ? "gradient-bg text-white shadow-md shadow-blue-500/20"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Study Sessions ({(studySessions || []).length})</span>
        </button>
        <button
          onClick={() => { setActiveTab("planners"); setSelectedItem(null); }}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
            activeTab === "planners"
              ? "gradient-bg text-white shadow-md shadow-blue-500/20"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Study Planners ({savedPlanners.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab("chat"); setSelectedItem(null); }}
          className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all ${
            activeTab === "chat"
              ? "gradient-bg text-white shadow-md shadow-blue-500/20"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Chat History ({chatHistory.length})</span> 
        </button>
      </div>
         {/* Content View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items List */}
        <Card hover={false} className="lg:col-span-1 space-y-3 max-h-[420px] sm:max-h-[500px] overflow-y-auto">
          {activeTab === "notes" && (
            savedNotes.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No saved notes found.</p>
            ) : (
              savedNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedItem(note)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    selectedItem?.id === note.id
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40"
                      : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{note.topic}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{note.date}</p>
                </div>
              ))
            )
          )}
      {activeTab === "planners" && (
            savedPlanners.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No saved planners found.</p>
            ) : (
              savedPlanners.map((planner) => (
                <div
                  key={planner.id}
                  onClick={() => setSelectedItem(planner)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                    selectedItem?.id === planner.id
                      ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/40"
                      : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{planner.title}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{planner.date}</p>
                </div>
              ))
            )
          )}
          {activeTab === "chat" && (
            chatHistory.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No chat logs recorded.</p>
            ) : (
              chatHistory.map((chat, idx) => (
                <div
                  key={chat.id || idx}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                    {chat.sender}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 truncate mt-0.5">{chat.text}</p>
                </div>
              ))
            )
          )}
          {activeTab === "sessions" && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <button onClick={exportSessionsCsv} className="px-3 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white">Export CSV</button>
                <button onClick={handleClearSessions} className="px-3 py-2 text-xs font-semibold rounded-xl bg-rose-500 text-white">Clear Sessions</button>
              </div>
              {undoState && undoState.visible && (
                <div className="mb-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                  <div className="text-xs text-amber-800 dark:text-amber-200">Study sessions cleared. Undo available for a few seconds.</div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleUndo} className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs">Undo</button>
                  </div>
                </div>
              )}
              {(studySessions || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No study sessions tracked yet.</p>
              ) : (
                (studySessions || []).slice().reverse().map((s) => (
                  <div key={s.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{new Date(s.startedAt).toLocaleString()}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{s.endedAt ? `${s.durationMinutes} minutes` : "In progress"}</p>
                      </div>
                      <div className="text-xs text-slate-400">{s.endedAt ? "Completed" : "Active"}</div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </Card>
          {/* Selected Content Detail View */}
        <Card hover={false} className="lg:col-span-2 min-h-[300px] sm:min-h-[400px]">
          {selectedItem ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedItem.topic || selectedItem.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Saved on {selectedItem.date}
                </p>
              </div>
              <div className="prose dark:prose-invert prose-xs text-xs leading-relaxed whitespace-pre-line max-h-[400px] overflow-y-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-900">
                {selectedItem.content}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <History className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-xs font-semibold">Select an item from the left panel to inspect details.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}