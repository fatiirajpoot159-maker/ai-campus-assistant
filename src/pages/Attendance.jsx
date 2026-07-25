import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/DashboardCard";
import { 
  PieChart, 
  Plus, 
  ShieldCheck, 
  AlertTriangle, 
  Trash2, 
  CheckCircle2, 
  BookOpen, 
  TrendingUp,
  X
} from "lucide-react";
export function Attendance() {
  const { attendance, addAttendanceCourse, updateAttendanceCounts, deleteAttendanceCourse } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCode, setNewCode] = useState("CS-400");
  const [newAttended, setNewAttended] = useState(30);
  const [newTotal, setNewTotal] = useState(35);
const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    addAttendanceCourse({
      course: newCourseName,
      code: newCode,
      attended: Number(newAttended),
      total: Number(newTotal),
      required: 75
    });
    setNewCourseName("");
    setShowAddModal(false);
  };
  // Calculate Overall Statistics
  const totalAttendedAll = attendance.reduce((acc, c) => acc + c.attended, 0);
  const totalClassesAll = attendance.reduce((acc, c) => acc + c.total, 0);
  const overallPercentage = totalClassesAll > 0 ? ((totalAttendedAll / totalClassesAll) * 100).toFixed(1) : 0;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-7 h-7 text-emerald-600" />
            Attendance Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor course attendance against university threshold requirement (75% minimum).
          </p>
        </div>
           <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 text-xs font-bold text-white gradient-bg rounded-xl shadow-md shadow-blue-500/20 hover:opacity-95 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course Attendance</span>
        </button>
      </div>
      {/* Summary Gauge Card */}
      <Card hover={false} className="gradient-bg text-white shadow-xl shadow-blue-500/15 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-white/20 backdrop-blur-md">
              Semester Aggregate
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {overallPercentage}% Cumulative Attendance
            </h2>
            <p className="text-xs text-blue-100 max-w-lg">
              {overallPercentage >= 75
                ? "🎉 You are safely above the 75% university requirement! Keep maintaining your streak."
                : "⚠️ Warning: Your cumulative attendance is below 75%. Attend upcoming classes to avoid debarment."}
            </p>
          </div>
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="text-center px-2">
              <p className="text-2xl font-extrabold">{totalAttendedAll}</p>
              <p className="text-[10px] font-semibold text-blue-100">Attended</p>
            </div>
            <div className="h-8 w-[1px] bg-white/20" />
            <div className="text-center px-2">
              <p className="text-2xl font-extrabold">{totalClassesAll}</p>
              <p className="text-[10px] font-semibold text-blue-100">Total Held</p>
            </div>
          </div>
        </div>
      </Card>
      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attendance.map((c) => {
          const pct = c.total > 0 ? ((c.attended / c.total) * 100).toFixed(1) : 0;
          const isSafe = pct >= 75;
          const isWarning = pct >= 70 && pct < 75;
          return (
            <Card key={c.id} hover={false} className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {c.code || "CS-300"}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {c.course}
                    </h3>
                  </div>
                     <button
                    onClick={() => deleteAttendanceCourse(c.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {/* Percentage Progress Gauge Bar */}
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {pct}% Attendance
                    </span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full flex items-center gap-1 ${
                      isSafe 
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : isWarning
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                    }`}>
                      {isSafe ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {isSafe ? "Safe Status" : isWarning ? "Warning" : "Critical"}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${Math.min(pct, 100)}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSafe ? "bg-emerald-500" : isWarning ? "bg-amber-500" : "bg-rose-500"
                      }`}
                    />
                  </div>
                </div>
              </div>
               {/* Increment / Decrement Counters */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white">{c.attended}</span> / {c.total} classes
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateAttendanceCounts(c.id, Math.min(c.attended + 1, c.total + 1), c.total + 1)}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200 transition-colors"
                  >
                    + Attended
                  </button>
                  <button
                    onClick={() => updateAttendanceCounts(c.id, c.attended, c.total + 1)}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-200 transition-colors"
                  >
                    + Missed
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {/* Modal for Adding New Course */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-card rounded-3xl p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Add Course Attendance Record
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCourse} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                />
              </div>

                <div>
                
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. AI-401"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Attended Classes
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newAttended}
                    onChange={(e) => setNewAttended(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                  />
                </div>
                 <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Classes Held
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newTotal}
                    onChange={(e) => setNewTotal(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white gradient-bg rounded-xl shadow-md"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}