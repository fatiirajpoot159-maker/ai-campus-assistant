import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Building,
  GraduationCap,
  Layers,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { registerUser } from "../services/authService";

export function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    university: "Air University",
    degreeSelect: "BS Computer Science",
    customDegree: "",
    semester: "4",
  });
  const [loading, setLoading] = useState(false);

  const degreeOptions = [
    "BS Computer Science",
    "BS Artificial Intelligence",
    "BS Software Engineering",
    "BS Data Science",
    "BS Cyber Security",
    "BBA / MBA Business Administration",
    "BS Electrical Engineering",
    "BS Mechanical Engineering",
    "MBBS / Pre-Med Sciences",
    "LL.B / Law",
    "BS Psychology",
    "BS Economics & Finance",
    "BS Mass Communication",
    "BS Biotechnology",
    "Other / Custom Degree",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalDegree =
      formData.degreeSelect === "Other / Custom Degree"
        ? formData.customDegree || "General Degree"
        : formData.degreeSelect;

    try {
      await registerUser(formData.name, formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <div className="w-full max-w-xl glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl gradient-bg text-white shadow-lg mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Student Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Universal AI Campus Assistant — Suitable for all degrees & majors
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Haya Fatima"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
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
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="haya@university.edu"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                University Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  placeholder="e.g. Air University"
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                />
                <Building className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Degree Program / Major
              </label>
              <div className="relative">
                <select
                  value={formData.degreeSelect}
                  onChange={(e) => setFormData({ ...formData, degreeSelect: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                >
                  {degreeOptions.map((deg, i) => (
                    <option key={i} value={deg}>{deg}</option>
                  ))}
                </select>
                <BookOpen className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Semester
              </label>
              <div className="relative">
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
                <Layers className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 text-xs font-bold text-white gradient-bg rounded-xl shadow-lg shadow-blue-500/25 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? "Creating Profile..." : "Complete Registration"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Already registered?{" "}
          <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
            Sign In to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;