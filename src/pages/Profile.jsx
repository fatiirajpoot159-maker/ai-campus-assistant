import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/DashboardCard";
import { 
  User, 
  Award, 
  Building, 
  BookOpen, 
  Layers, 
  Mail, 
  Check, 
  Sparkles, 
  Shield, 
  Star,
  Edit2,
  Save
} from "lucide-react";
export default function Profile() {
  const { currentUser, updateProfile, studySessions } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "Haya Fatima",
    email: currentUser?.email || "haya.fatima@campus.edu",
    university: currentUser?.university || "Air University",
    degree: currentUser?.degree || "BS Artificial Intelligence",
    semester: currentUser?.semester || "4"
  });
   const [savedSuccess, setSavedSuccess] = useState(false);
  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-3xl gradient-bg text-white font-extrabold text-3xl flex items-center justify-center shadow-xl shadow-blue-500/20">
            {formData.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Verified University Student
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {formData.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {formData.degree} • Semester {formData.semester} ({formData.university})
            </p>
          </div>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information Form */}
        <Card hover={false} className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Academic Credentials
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
              <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
            </button>
          </div>
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" /> Profile credentials successfully updated!
            </div>
          )}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-60"
                  />
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

  <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-60"
                  />
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  University
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-60"
                  />
                  <Building className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>
                 <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Degree Program
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-60"
                  />
                  <BookOpen className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester
              </label>
              <div className="relative max-w-xs">
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-60"
                />
                <Layers className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>
             {isEditing && (
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white gradient-bg rounded-xl shadow-md"
              >
                Save Profile Changes
              </button>
            )}
          </form>
        </Card>
        {/* Academic Badges & Achievements Panel */}
        <Card hover={false} className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Student Badges
            </h2>
          </div>
          <div className="space-y-3">
            {(currentUser?.achievements || [
              { title: "AI Course Completed", icon: "🏆", date: "Jan 2026" },
              { title: "Cybersecurity Certified", icon: "🛡️", date: "Feb 2026" },
              { title: "Top Attendance Streak (87%+)", icon: "⭐", date: "Current" }
            ]).map((ach, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/60 to-purple-50/60 dark:from-slate-900 dark:to-slate-800 border border-amber-200/50 dark:border-slate-700 flex items-center gap-3"
              >
                <div className="text-2xl">{ach.icon}</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ach.title}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{ach.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card hover={false} className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Study Sessions</h2>
          </div>
          <div className="space-y-3">
            {(studySessions || []).slice(-3).reverse().map((s) => (
              <div key={s.id} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{new Date(s.startedAt).toLocaleString()}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{s.endedAt ? `${s.durationMinutes} minutes` : "In progress"}</p>
              </div>
            ))}
            {(studySessions || []).length === 0 && (
              <p className="text-xs text-slate-400">No sessions yet. Start a session from the dashboard.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}