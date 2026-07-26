import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, ArrowRight, Mail, Lock, Sparkles } from "lucide-react";
export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("haya.fatima@campus.edu");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl gradient-bg text-white shadow-lg mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome Back!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access your AI Campus Assistant Dashboard
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="haya@university.edu"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 text-xs font-bold text-white gradient-bg rounded-xl shadow-lg shadow-blue-500/25 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? "Signing In..." : "Enter Student Dashboard"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-6 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-start gap-2.5 text-xs text-blue-800 dark:text-blue-300">
          <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">Instant Demo Credentials Loaded:</span>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">
              Click 'Enter Student Dashboard' to test all AI features immediately!
            </p>
          </div>
        </div>
        
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          New Student?{" "}
          <Link to="/signup" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
