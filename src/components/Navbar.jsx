import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Menu, 
  X,
  GraduationCap
} from "lucide-react";
export function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { currentUser, darkMode, toggleDarkMode, logoutUser } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");
  const navigate = useNavigate();
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/chat?q=${encodeURIComponent(quickSearch)}`);
      setQuickSearch("");
    }
  };
  return (
    <header className="sticky top-0 z-30 w-full glass-card border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 py-3 transition-colors duration-200">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Side: Brand Logo & Mobile Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl gradient-bg text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 leading-tight">
                AI Campus Assistant
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full gradient-bg text-white">
                  PRO
                </span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Your Intelligent Academic Companion
              </p>
            </div>
          </Link>
        </div>
        {/* Middle: AI Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Ask AI anything (e.g. 'Explain Gradient Descent')..."
              className="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <button
              type="submit"
              className="absolute right-2 top-1.5 p-1 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50"
              title="Search with AI"
            >
              <Sparkles className="w-4 h-4 animate-pulse-subtle" />
            </button>
          </form>
        </div>
        <div className="flex items-center gap-3">
        <Link
          to="/chat"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white gradient-bg rounded-xl shadow-sm hover:opacity-95 transition-opacity"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </Link>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
          {/* Notifications */}
          <button
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
          </button>
          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full gradient-bg text-white font-bold flex items-center justify-center text-xs shadow-sm">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "H"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                  {currentUser?.name || "Haya Fatima"}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  {currentUser?.degree || "BS AI"} • Sem {currentUser?.semester || "4"}
                </p>
              </div>
            </button>
                 {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-xl py-2 z-50 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-300 rounded-md">
                    {currentUser?.university || "Air University"}
                  </span>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <User className="w-4 h-4 text-blue-600" /> My Profile & Achievements
                </Link>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logoutUser();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}