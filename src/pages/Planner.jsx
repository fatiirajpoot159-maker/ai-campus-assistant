import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { generateSmartPlan } from "../services/geminiService";
import { Card } from "../components/DashboardCard";
import { 
  Calendar, 
  Sparkles, 
  Clock, 
  Plus, 
  X, 
  Bookmark, 
  CheckCircle2, 
  RefreshCw, 
  BookOpen, 
  Zap,
  Target
} from "lucide-react";
export default function Planner() {
  const { addPlanner } = useAuth();
  
  const [exams, setExams] = useState(["Artificial Intelligence", "Database Systems", "Computer Networks"]);
  const [newExamInput, setNewExamInput] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [examDate, setExamDate] = useState("2026-08-15");
  
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const handleAddExam = (e) => {
    e.preventDefault();
    if (newExamInput.trim() && !exams.includes(newExamInput.trim())) {
      setExams([...exams, newExamInput.trim()]);
      setNewExamInput("");
    }
  };
  const handleRemoveExam = (index) => {
    setExams(exams.filter((_, i) => i !== index));
  };
  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (exams.length === 0 || loading) return;
    setLoading(true);
    setSaved(false);
    try {
      const res = await generateSmartPlan(exams, hoursPerDay, examDate);
      setGeneratedPlan(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleSavePlan = () => {
    if (!generatedPlan) return;
    addPlanner({
      title: `Study Plan (${exams.join(", ")})`,
      exams,
      hoursPerDay,
      examDate,
      content: generatedPlan,
      date: new Date().toISOString().split("T")[0]
    });
    setSaved(true);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-7 h-7 text-purple-600" />
          Smart Study Planner <span className="text-xs px-2 py-0.5 font-bold rounded-full gradient-bg text-white">AI Agent</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter your upcoming course exams, daily hours, and target date. Our AI agent calculates a balanced day-by-day timetable.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planner Inputs Form */}
        <Card hover={false} className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            <Target className="w-4 h-4 text-purple-600" />
            <span>Configure Exam Schedule</span>
          </div>
          <form onSubmit={handleGeneratePlan} className="space-y-4">
            {/* Exam List */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Exams / Courses
              </label> 
              <div className="flex flex-wrap gap-1.5 mb-2">
                {exams.map((exam, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                  >
                    {exam}
                    <button type="button" onClick={() => handleRemoveExam(idx)} className="hover:text-rose-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newExamInput}
                  onChange={(e) => setNewExamInput(e.target.value)}
                  placeholder="Add exam (e.g. Operating Systems)"
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddExam}
                  className="p-2 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 hover:bg-purple-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Daily Hours */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Available Time per Day
                </label>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  {hoursPerDay} hours/day
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>
            {/* Exam Target Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/40 focus:outline-none"
              />
            </div>
             <button
              type="submit"
              disabled={loading || exams.length === 0}
              className="w-full py-3 text-xs font-bold text-white gradient-bg rounded-xl shadow-lg shadow-purple-500/20 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Generating Agent Timetable..." : "Generate AI Study Plan"}
            </button>
          </form>
        </Card>
        {/* Generated Schedule Panel */}
        <Card hover={false} className="lg:col-span-2 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Agent Generated Weekly Timetable
              </h2>
            </div>
            {generatedPlan && (
              <button
                onClick={handleSavePlan}
                disabled={saved}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors ${
                  saved 
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{saved ? "Saved" : "Save Plan"}</span>
              </button>
            )}
          </div>
          <div className="flex-1 min-h-[280px] sm:min-h-[350px] p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 overflow-y-auto">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Calculating optimal spaced repetition intervals for {exams.join(", ")}...
                </p>
              </div>
            ) : generatedPlan ? (
              <div className="prose dark:prose-invert prose-xs text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {generatedPlan}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <Calendar className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-xs font-semibold">
                  No schedule generated yet. Configure options on the left and click "Generate AI Study Plan".
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}