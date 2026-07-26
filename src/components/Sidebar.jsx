import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Bot, Calendar, FileText, CheckSquare,
  PieChart, History, User, Sparkles, Calculator, Code2,
  Mail, Brain, Layers, Briefcase, Settings, Shield, X,
  Upload, ChevronRight, Zap
} from "lucide-react";
const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { path: "/dashboard",    icon: LayoutDashboard, label: "Dashboard" },
      { path: "/chat",         icon: Bot,             label: "AI Study Chat",    badge: "AI" },
    ]
  },
  {
    label: "Academic",
    items: [
      { path: "/planner",     icon: Calendar,    label: "Study Planner"    },
      { path: "/assignments", icon: CheckSquare, label: "Assignments",     countKey: "assignments" },
      { path: "/attendance",  icon: PieChart,    label: "Attendance"       },
      {path: "/gpa-calculator",label: "GPA Calculator"   , icon: Calculator},              
      { path: "/notes",       icon: FileText,    label: "My Notes"         },
      { path: "/notes",icon: Upload,      label: "Upload Notes",    badge: "NEW" },
    ]
  },
    {
    label: "AI Tools",
    items: [
      { path: "/quiz",             icon: Brain,      label: "Quiz Generator",    badge: "AI" },
      { path: "/flashcards",       icon: Layers,     label: "Flashcards",        badge: "AI" },
      { path: "/gpa-calculator",   icon: Calculator, label: "GPA Calculator"     },
      { path: "/coding-assistant", icon: Code2,      label: "Coding Assistant",  badge: "AI" },
      { path: "/email-writer",     icon: Mail,       label: "Email Writer",      badge: "AI" },
      { path: "/career-hub",       icon: Briefcase,  label: "Career Hub",        badge: "AI" },
    ]
  },
  {
    label: "Account",
    items: [
      { path: "/profile",  icon: User,     label: "Profile"  },
      { path: "/history",  icon: History,  label: "History"  },
      { path: "/settings", icon: Settings, label: "Settings" },
    ]
  }
];
export function Sidebar({ isOpen, onClose }) {
  const { currentUser, assignments } = useAuth();
  const location = useLocation();
  const pendingCount = (assignments || []).filter(a => a.status !== "Completed").length;
  function getBadgeCount(countKey) {
    if (countKey === "assignments") return pendingCount > 0 ? pendingCount : null;
    return null;
  }
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
         {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-40 w-full max-w-xs sm:max-w-sm lg:w-64
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800
        flex flex-col shadow-xl
        transition-transform duration-300 ease-in-out
        lg:sticky lg:top-0 lg:h-screen lg:z-auto lg:translate-x-0 lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white leading-none">AI Campus</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Assistant</div>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* User mini card */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow">
              {(currentUser?.name || "U")[0].toUpperCase()}
            </div>
                   <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{currentUser?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Sem {currentUser?.semester} · {currentUser?.degree?.split(" ").slice(0,2).join(" ")}</p>
            </div>
          </div>
        </div>
        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              <p className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map(({ path, icon: Icon, label, badge, countKey }) => {
                  const count = countKey ? getBadgeCount(countKey) : null;
                  const isActive = location.pathname === path;
                  return (
                    <NavLink
                      key={path}
                      to={path}
                      onClick={() => window.innerWidth < 1024 && onClose()}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150
                        ${isActive
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        }
                      `}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
                      <span className="flex-1 truncate">{label}</span>
                      {count != null && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {count}
                        </span>
                             )}
                      {badge && !count && (
                        <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          badge === "AI"  ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400" :
                          badge === "NEW" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : ""
                        }`}>
                          {badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
          {/* Admin link */}
          {currentUser?.isAdmin && (
            <div>
              <p className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Admin</p>
              <NavLink
                to="/admin"
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Shield className="w-4 h-4 shrink-0" />
                <span>Admin Panel</span>
              </NavLink>
            </div>
          )}
        </nav>
        {/* Bottom tip */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-xl p-3 flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">AI Tip</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug mt-0.5">Upload your lecture notes for instant AI summaries!</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
