import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { StatCard, Card } from "../components/DashboardCard";
import { 
  Bot, 
  Calendar, 
  FileText, 
  PieChart, 
  BookOpen, 
  CheckSquare, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Upload, 
  ShieldCheck, 
  AlertTriangle,
  File,
  Plus
} from "lucide-react";
export function Dashboard() {
  const { currentUser, assignments, attendance, uploadedNotes, studySessions, activeStudySession, startStudySession, stopStudySession, setActiveNoteContext } = useAuth();
  const navigate = useNavigate();
  // Fully dynamic metrics calculated from live user data
  const totalCourses = attendance.length;
  const pendingAssignments = assignments.filter(a => a.status !== "Completed");
  const totalAttended = attendance.reduce((acc, c) => acc + c.attended, 0);
  const totalClasses = attendance.reduce((acc, c) => acc + c.total, 0);
  const attendancePercentage = totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(1) : 0;
  const totalStudyMinutes = studySessions.reduce((sum, session) => sum + (session.durationMinutes || 0), 0);
  const studyHoursLogged = totalStudyMinutes > 0 ? (totalStudyMinutes / 60).toFixed(1) : (currentUser?.studyHours || 0);
  const activeSessionDuration = activeStudySession ? Math.max(1, Math.round((Date.now() - new Date(activeStudySession.startedAt)) / 60000)) : 0;
  const formattedLastLogin = currentUser?.lastLoginAt ? new Date(currentUser.lastLoginAt).toLocaleString() : null;
  const quickActions = [
    {
      title: "Ask AI Assistant",
      desc: "Concept explanations & interactive quizzes",
      icon: Bot,
      path: "/chat",
      color: "from-blue-500 to-indigo-600",
      btnText: "Launch Assistant"
    },
    {
      title: "Upload & Analyze Notes",
      desc: "Upload PDF, DOCX, TXT lecture notes",
      icon: Upload,
      path: "/upload-notes",
      color: "from-purple-500 to-violet-600",
      btnText: "Upload Document"
    },
    {
      title: "Create Study Plan",
      desc: "Agent generated daily timetable",
      icon: Calendar,
      path: "/planner",
      color: "from-emerald-500 to-teal-600",
      btnText: "Build Schedule"
    },
    {
      title: "Notes Generator",
      desc: "Structured Markdown notes & formulas",
      icon: FileText,
      path: "/notes",
      color: "from-amber-500 to-orange-600",
      btnText: "Generate Notes"
    }
  ];
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Greeting Banner */}
      <div className="relative overflow-hidden glass-card rounded-3xl p-6 sm:p-8 gradient-bg text-white shadow-xl shadow-blue-500/15">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center justify-between">
          <div className="max-w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Academic AI Companion Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Hello {currentUser?.name || "Student"} 👋
            </h1>
            <p className="mt-2 text-sm text-blue-100 max-w-xl">
              You have <span className="font-bold underline">{pendingAssignments.length} pending assignments</span> across <span className="font-bold">{totalCourses} courses</span>. Overall attendance is <span className="font-bold text-emerald-300">{attendancePercentage}%</span>.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/upload-notes"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white text-blue-700 font-bold text-xs shadow-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Upload Lecture Notes</span>
            </Link>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 w-[220px] h-[220px] sm:w-64 sm:h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>
      {/* Semester Dynamic Progress Metric Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Dynamic Semester Overview</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              ({currentUser?.degree} • Semester {currentUser?.semester})
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Enrolled Courses"
            value={totalCourses}
            subtitle="Active semester modules"
            icon={BookOpen}
            color="blue" />
          <StatCard
            title="Pending Assignments"
            value={pendingAssignments.length}
            subtitle="Require submission soon"
            icon={CheckSquare}
            color="purple"
            badge={pendingAssignments.length > 0 ? "Action Needed" : "All Clear"} />
          <StatCard
            title="Overall Attendance"
            value={`${attendancePercentage}%`}
            subtitle="University min: 75%"
            icon={PieChart}
            color={attendancePercentage >= 75 ? "emerald" : "amber"} />
          <StatCard
            title="Study Hours Logged"
            value={`${studyHoursLogged} hrs`}
            subtitle="Logged this month"
            icon={Clock}
            color="amber" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-900/95 dark:bg-slate-800/95 p-6 shadow-xl shadow-slate-900/10 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-300">Study Session Tracker</p>
                <h3 className="mt-1 text-xl font-bold">{activeStudySession ? "In Progress" : "Ready to Start"}</h3>
                {formattedLastLogin && (
                  <p className="text-xs text-slate-400 mt-2">Last login: {formattedLastLogin}</p>
                )}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={activeStudySession ? stopStudySession : startStudySession}
                  className={`px-4 py-3 rounded-2xl font-semibold transition ${activeStudySession ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}>
                  {activeStudySession ? `Stop Session (${activeSessionDuration}m)` : "Start Study"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/planner")}
                  className="px-4 py-3 rounded-2xl bg-slate-700 text-slate-100 hover:bg-slate-600 transition">
                  Open Planner
                </button>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Total Sessions</p>
                <p className="mt-2 text-2xl font-bold">{studySessions.length}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Total Minutes</p>
                <p className="mt-2 text-2xl font-bold">{totalStudyMinutes}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Active</p>
                <p className="mt-2 text-2xl font-bold">{activeStudySession ? `${activeSessionDuration}m` : "0m"}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-50/95 dark:bg-slate-950/80 p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Note</h3>
            <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
              Use the study tracker to monitor session duration and keep your focus. Your sessions are saved per login user and persist across refreshes.
            </p>
          </div>
        </div>
        <div className="rounded-3xl bg-slate-50/95 dark:bg-slate-950/80 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Study Sessions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Saved automatically per user</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{studySessions.length} sessions</span>
          </div>
          <div className="space-y-3">
            {studySessions.slice(-4).reverse().map((session) => (
              <div key={session.id} className="rounded-3xl bg-white/90 dark:bg-slate-900/70 p-4 border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(session.startedAt).toLocaleString()}</p>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {session.endedAt ? `${session.durationMinutes} min` : "Ongoing"}
                  </p>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${session.endedAt ? "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"}`}>
                    {session.endedAt ? "Completed" : "Active"}
                  </span>
                </div>
              </div>
            ))}
            {studySessions.length === 0 && (
              <p className="text-xs text-slate-500">No study sessions tracked yet. Start one now to save it automatically.</p>
            )}
          </div>
        </div>
      </div>
      {/* Quick Actions Launchpads */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Quick AI Launchpads
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Card key={idx} className="flex flex-col justify-between" onClick={() => navigate(action.path)}>
                <div>
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${action.color} text-white flex items-center justify-center mb-4 shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {action.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>{action.btnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      {/* Dedicated Uploaded Notes Vault Preview Section */}
      <Card hover={false} className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Uploaded Lecture Notes ({uploadedNotes.length})
            </h3>
          </div>
          <Link to="/upload-notes" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Upload New File
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uploadedNotes.slice(0, 4).map((docItem) => (
            <div
              key={docItem.id}
              className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 shrink-0">
                  <File className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-full sm:max-w-[200px]">
                    {docItem.fileName}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {docItem.courseName} • {docItem.uploadDate}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveNoteContext(docItem);
                  navigate(`/chat?q=Summarize ${encodeURIComponent(docItem.fileName)}`);
                }}
                className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors shrink-0"
              >
                Ask AI
              </button>
            </div>
          ))}
        </div>
      </Card>
      {/* Widgets Grid: Upcoming Tasks & Attendance Safety */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks Widget */}
        <Card hover={false} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upcoming Homework & Reports
              </h3>
            </div>
            <Link to="/assignments" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Manage All
            </Link>
          </div>
          <div className="space-y-3">
            {pendingAssignments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">All assignments submitted!</p>
            ) : (
              pendingAssignments.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.course}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                      Due {item.deadline}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
        {/* Attendance Safety Status Widget */}
        <Card hover={false} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Course Attendance Safety
              </h3>
            </div>
            <Link to="/attendance" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              View Tracker
            </Link>
          </div>
          <div className="space-y-3">
            {attendance.slice(0, 3).map((c) => {
              const pct = c.total > 0 ? ((c.attended / c.total) * 100).toFixed(1) : 0;
              const isSafe = pct >= 75;
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{c.course}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {c.attended} of {c.total} classes attended
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">{pct}%</span>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full flex items-center gap-1 ${
                      isSafe
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                    }`}>
                      {isSafe ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {isSafe ? "Safe" : "Warning"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
