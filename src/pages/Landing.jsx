import React from "react";
import { Link } from "react-router-dom";
import { 
  Bot, 
  Calendar, 
  CheckSquare, 
  FileText, 
  PieChart, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Zap, 
  BookOpen, 
  Award,
  Star,
  GraduationCap
} from "lucide-react";
export default function Landing()  {
  const featureCards = [
    {
      icon: Bot,
      title: "AI Study Chat",
      description: "Ask complex concepts like Gradient Descent or Normalization. Get simple explanations, examples, key points, and instant mini-quizzes.",
      badge: "Core AI",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Calendar,
      title: "Smart Planner",
      description: "Enter your upcoming exam dates and daily available hours. Our AI agent calculates an optimized day-by-day study schedule.",
      badge: "Agent AI",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: CheckSquare,
      title: "Assignment Manager",
      description: "Keep track of pending homework, projects, and lab reports with deadline countdowns, priority levels, and instant status updates.",
      badge: "CRUD System",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: FileText,
      title: "Lecture Notes Builder",
      description: "Upload or type course material and instantly convert it into structured study notes with highlights, summaries, and research links.",
      badge: "Smart Notes",
      color: "from-cyan-500 to-sky-600"
    },
    {
      icon: PieChart,
      title: "Progress Insights",
      description: "Analyze your study habits and grades with AI-generated visual reports, recommendations, and strength/weakness tracking.",
      badge: "Analytics",
      color: "from-fuchsia-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Attendance Guard",
      description: "Monitor your attendance, receive reminders, and stay on track to meet participation requirements across all courses.",
      badge: "Safety",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const statHighlights = [
    { label: "Active Students", value: "10,000+" },
    { label: "AI Notes Generated", value: "250,000+" },
    { label: "Avg Grade Boost", value: "+28%" },
    { label: "Attendance Safety", value: "99.4%" }
  ];
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-200">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-50 glass-card border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl gradient-bg text-white shadow-lg shadow-blue-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              AI Campus Assistant
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 text-sm font-bold text-white gradient-bg rounded-xl shadow-md shadow-blue-500/20 hover:opacity-95 transition-opacity"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Background Decorative Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] bg-gradient-to-tr from-blue-400/20 to-purple-500/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-blue-200 dark:border-slate-700 text-xs font-bold text-blue-700 dark:text-blue-300 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>Powered by Gemini 1.5 & Firebase Engine</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Your Personal <span className="gradient-text">AI Academic Companion</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Manage courses, generate study plans, chat with AI, track attendance, and achieve your peak academic goals with one intelligent campus platform.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white gradient-bg rounded-2xl shadow-xl shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-200 glass-card rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Explore Demo Dashboard</span>
            </Link>
          </div>
          {/* Metric Highlights Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {statHighlights.map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white gradient-text">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* App Features Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
            Campus Intelligence
          </p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Tools designed to help every student succeed
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            From planning and note-taking to progress tracking, everything you need to stay organized and study smarter.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((card, index) => (
            <div key={index} className="glass-card rounded-3xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-slate-950/40 border border-slate-200 dark:border-slate-800">
              <div className={`w-14 h-14 rounded-3xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-lg shadow-slate-300/20`}>
                <card.icon className="w-6 h-6" />
              </div>
              <span className="inline-flex mt-5 items-center rounded-full bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700 dark:text-slate-200">
                {card.badge}
              </span>
              <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
                {card.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {card.description}
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link
                  to="/signup"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  Try Feature <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
            </div>
          ))}
        </div>
      </section>
           {/* Footer */}
      <footer className="glass-card border-t border-slate-200 dark:border-slate-800 py-8 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 AI Campus Assistant. Designed for University Excellence.</p>
      </footer>
    </div>
  );
}
