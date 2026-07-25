import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { generateStudyNotes } from "../services/geminiService";
import { Card } from "../components/DashboardCard";
import { 
  FileText, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Bookmark, 
  RefreshCw, 
  BookOpen,
  CheckCircle2
} from "lucide-react";
export function Notes() {
  const { currentUser, addNote } = useAuth();
  
  const [topic, setTopic] = useState("Linear Regression & Gradient Descent");
  const [degree, setDegree] = useState(currentUser?.degree || "BS Computer Science");
  const [detailLevel, setDetailLevel] = useState("Comprehensive");
  const [generatedNotes, setGeneratedNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;
     setLoading(true);
    setCopied(false);
    setSaved(false);
    try {
      const res = await generateStudyNotes(topic, degree, detailLevel);
      setGeneratedNotes(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleSaveToHistory = () => {
    if (!generatedNotes) return;
    addNote({
      topic,
      content: generatedNotes,
      date: new Date().toISOString().split("T")[0]
    });
    setSaved(true);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedNotes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
   const handleDownload = () => {
    const blob = new Blob([generatedNotes], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic.replace(/\s+/g, "_")}_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-7 h-7 text-amber-500" />
          Universal AI Notes Generator
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Available for all subjects & degrees. Enter any topic to generate structured academic study notes.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Input Form */}
        <Card hover={false} className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Generate Custom Notes</span>
          </div>
           <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter Topic / Subject Name
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Organic Chemistry, Macroeconomics, Linear Algebra..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Program / Degree Major
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. BS Computer Science, BBA, MBBS, LL.B..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
              />
            </div>
              <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Depth Level
              </label>
              <select
                value={detailLevel}
                onChange={(e) => setDetailLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/40 focus:outline-none"
              >
                <option value="Quick Review">Quick Review (Summary Focus)</option>
                <option value="Comprehensive">Comprehensive (Full Formulas & Key Principles)</option>
                <option value="Exam Preparation">Exam Preparation (Questions Focus)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full py-3 text-xs font-bold text-white gradient-bg rounded-xl shadow-lg shadow-amber-500/20 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Generating Notes..." : "Generate Study Notes"}
            </button>
          </form> 
           {/* Quick preset topics for diverse fields */}
          <div className="pt-2">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-2">Popular Topics Across Majors:</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Linear Regression",
                "Financial Accounting",
                "Human Anatomy",
                "Constitutional Law",
                "Macroeconomics",
                "Data Structures"
              ].map((preset, i) => (
                <button
                  key={i}
                  onClick={() => setTopic(preset)}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-950/40 hover:text-amber-800 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </Card>
        {/* Notes Preview Panel */}
        <Card hover={false} className="lg:col-span-2 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Generated Markdown Notes
              </h2>
            </div> 
             {generatedNotes && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveToHistory}
                  disabled={saved}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors ${
                    saved 
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{saved ? "Saved" : "Save"}</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  title="Copy Notes"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  title="Download .md File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 min-h-[280px] sm:min-h-[350px] p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 overflow-y-auto">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Synthesizing formulas, definitions, examples, and exam questions for "{topic}"...
                </p>
              </div>
            ) : generatedNotes ? (
              <div className="prose dark:prose-invert prose-xs text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {generatedNotes}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <FileText className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-xs font-semibold">
                  No notes generated yet. Enter a topic on the left and click "Generate Study Notes".
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
