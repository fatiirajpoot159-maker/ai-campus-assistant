import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
const AuthContext = createContext({
  currentUser: {
    name: "",
    email: "",
    university: "",
    degree: "",
    semester: "1",
    studyHours: 0,
    isAdmin: false,
    achievements: []
  },
  assignments: [],
  attendance: [],
  uploadedNotes: [],
  savedNotes: [],
  savedPlanners: [],
  chatHistory: [],
  studySessions: [],
  activeStudySession: null,
  darkMode: false,
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
  signupUser: async () => {},
  loginUser: async () => {},
  logoutUser: () => {},
  updateProfile: () => {},
  addUploadedNote: () => {},
  deleteUploadedNote: () => {},
  setActiveNoteContext: () => {},
  addAssignment: () => {},
  updateAssignmentStatus: () => {},
  deleteAssignment: () => {},
  addAttendanceCourse: () => {},
  updateAttendanceCounts: () => {},
  deleteAttendanceCourse: () => {},
  addNote: () => {},
  addPlanner: () => {},
  addChatMessage: () => {},
  clearChatHistory: () => {},
  toggleDarkMode: () => {},
  startStudySession: () => {},
  stopStudySession: () => {}
});
// ─── Defaults ────────────────────────────────────────────────────────────────
const DEFAULT_USER = {
  name: "",
  email: "",
  university: "",
  degree: "",
  semester: "1",
  studyHours: 0,
  isAdmin: false,
  achievements: []
};
const DEFAULT_ASSIGNMENTS = [];
const DEFAULT_ATTENDANCE = [];
const DEFAULT_UPLOADED_NOTES = [];
const DEFAULT_STUDY_SESSIONS = [];
const STORAGE_SUFFIXES = {
  profile: "profile",
  assignments: "assignments",
  attendance: "attendance",
  uploadedNotes: "uploaded_notes",
  notes: "notes",
  planners: "planners",
  chat: "chat",
  studySessions: "study_sessions"
};
const normalizeEmailKey = (email) =>
  email?.toLowerCase().replace(/[^a-z0-9]/g, "_") || "guest";
const getStorageKey = (email, suffix) =>
  `campus_${suffix}_${normalizeEmailKey(email)}`;
const getPersistentData = (email, suffix, defaultValue) => {
  if (!email) return defaultValue;
  const saved = localStorage.getItem(getStorageKey(email, suffix));
  return saved ? JSON.parse(saved) : defaultValue;
};
const getUserProfile = (email) => {
  if (!email) return DEFAULT_USER;
  return getPersistentData(email, STORAGE_SUFFIXES.profile, { ...DEFAULT_USER, email });
};

// ─── Auth Provider ─────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  // ── Core user state ──
  const existingUser = JSON.parse(localStorage.getItem("campus_user") || "null");
  const initialUser = existingUser || DEFAULT_USER;
  const [currentUser,    setCurrentUser]    = useState(() => initialUser);
  const [assignments,    setAssignments]    = useState(() => getPersistentData(initialUser.email, STORAGE_SUFFIXES.assignments, DEFAULT_ASSIGNMENTS));
  const [attendance,     setAttendance]     = useState(() => getPersistentData(initialUser.email, STORAGE_SUFFIXES.attendance, DEFAULT_ATTENDANCE));
  const [uploadedNotes,  setUploadedNotes]  = useState(() => getPersistentData(initialUser.email, STORAGE_SUFFIXES.uploadedNotes, DEFAULT_UPLOADED_NOTES));
  const [savedNotes,     setSavedNotes]     = useState(() => getPersistentData(initialUser.email, STORAGE_SUFFIXES.notes, []));
  const [savedPlanners,  setSavedPlanners]  = useState(() => getPersistentData(initialUser.email, STORAGE_SUFFIXES.planners, []));
  const [chatHistory,    setChatHistory]    = useState(() => getPersistentData(initialUser.email, STORAGE_SUFFIXES.chat, []));
  const [studySessions,  setStudySessions]  = useState(() => getPersistentData(initialUser.email, STORAGE_SUFFIXES.studySessions, DEFAULT_STUDY_SESSIONS));
  const [activeNoteContext, setActiveNoteContext] = useState(null);
  const [darkMode,       setDarkMode]       = useState(() => localStorage.getItem("campus_theme") === "dark");
  // ── Toast system ──
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  // ── Persist to localStorage ──
  useEffect(() => {
    localStorage.setItem("campus_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.email) return;
    localStorage.setItem(getStorageKey(currentUser.email, STORAGE_SUFFIXES.profile), JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.email) return;
    localStorage.setItem(getStorageKey(currentUser.email, STORAGE_SUFFIXES.assignments), JSON.stringify(assignments));
  }, [assignments, currentUser.email]);

  useEffect(() => {
    if (!currentUser?.email) return;
    localStorage.setItem(getStorageKey(currentUser.email, STORAGE_SUFFIXES.attendance), JSON.stringify(attendance));
  }, [attendance, currentUser.email]);

  useEffect(() => {
    if (!currentUser?.email) return;
    localStorage.setItem(getStorageKey(currentUser.email, STORAGE_SUFFIXES.uploadedNotes), JSON.stringify(uploadedNotes));
  }, [uploadedNotes, currentUser.email]);

  useEffect(() => {
    if (!currentUser?.email) return;
    localStorage.setItem(getStorageKey(currentUser.email, STORAGE_SUFFIXES.notes), JSON.stringify(savedNotes));
  }, [savedNotes, currentUser.email]);

  useEffect(() => {
    if (!currentUser?.email) return;
    localStorage.setItem(getStorageKey(currentUser.email, STORAGE_SUFFIXES.planners), JSON.stringify(savedPlanners));
  }, [savedPlanners, currentUser.email]);

  useEffect(() => {
    if (!currentUser?.email) return;
    localStorage.setItem(getStorageKey(currentUser.email, STORAGE_SUFFIXES.chat), JSON.stringify(chatHistory));
  }, [chatHistory, currentUser.email]);

  useEffect(() => {
    if (!currentUser?.email) return;
    localStorage.setItem(getStorageKey(currentUser.email, STORAGE_SUFFIXES.studySessions), JSON.stringify(studySessions));
  }, [studySessions, currentUser.email]);

  useEffect(() => {
    localStorage.setItem("campus_theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);
    // ── Auth helpers ──
  const signupUser = async (profileData, email, password) => {
    try {
      if (auth.app.options.apiKey !== "AIzaSyDemoKeyOnlyForDevelopmentMode") {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", res.user.uid, "profile", "info"), { ...profileData, email });
      }
    } catch (err) { console.warn("Firebase signup fallback:", err.message); }

    const newUser = {
      ...profileData,
      email,
      studyHours: 0,
      isAdmin: false,
      achievements: [{ title: "Welcome to AI Campus", icon: "🚀", date: "Today" }]
    };

    setCurrentUser(newUser);
    setAssignments(DEFAULT_ASSIGNMENTS);
    setAttendance(DEFAULT_ATTENDANCE);
    setUploadedNotes(DEFAULT_UPLOADED_NOTES);
    setSavedNotes([]);
    setSavedPlanners([]);
    setChatHistory([]);
    setStudySessions(DEFAULT_STUDY_SESSIONS);

    localStorage.setItem(getStorageKey(email, STORAGE_SUFFIXES.profile), JSON.stringify(newUser));
    localStorage.setItem(getStorageKey(email, STORAGE_SUFFIXES.assignments), JSON.stringify(DEFAULT_ASSIGNMENTS));
    localStorage.setItem(getStorageKey(email, STORAGE_SUFFIXES.attendance), JSON.stringify(DEFAULT_ATTENDANCE));
    localStorage.setItem(getStorageKey(email, STORAGE_SUFFIXES.uploadedNotes), JSON.stringify(DEFAULT_UPLOADED_NOTES));
    localStorage.setItem(getStorageKey(email, STORAGE_SUFFIXES.notes), JSON.stringify([]));
    localStorage.setItem(getStorageKey(email, STORAGE_SUFFIXES.planners), JSON.stringify([]));
    localStorage.setItem(getStorageKey(email, STORAGE_SUFFIXES.chat), JSON.stringify([]));
    localStorage.setItem(getStorageKey(email, STORAGE_SUFFIXES.studySessions), JSON.stringify(DEFAULT_STUDY_SESSIONS));

    addToast(`Welcome, ${profileData.name}! 🎓`, "success");
    return newUser;
  };

  const loginUser = async (email, password) => {
    try {
      if (auth.app.options.apiKey !== "AIzaSyDemoKeyOnlyForDevelopmentMode") {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) { console.warn("Firebase login fallback:", err.message); }

    const now = new Date().toISOString();
    const profile = getUserProfile(email);
    const profileWithLogin = { ...profile, lastLoginAt: now };
    setCurrentUser(profileWithLogin);
    setAssignments(getPersistentData(email, STORAGE_SUFFIXES.assignments, DEFAULT_ASSIGNMENTS));
    setAttendance(getPersistentData(email, STORAGE_SUFFIXES.attendance, DEFAULT_ATTENDANCE));
    setUploadedNotes(getPersistentData(email, STORAGE_SUFFIXES.uploadedNotes, DEFAULT_UPLOADED_NOTES));
    setSavedNotes(getPersistentData(email, STORAGE_SUFFIXES.notes, []));
    setSavedPlanners(getPersistentData(email, STORAGE_SUFFIXES.planners, []));
    setChatHistory(getPersistentData(email, STORAGE_SUFFIXES.chat, []));
    setStudySessions(getPersistentData(email, STORAGE_SUFFIXES.studySessions, DEFAULT_STUDY_SESSIONS));

    addToast("Welcome back! 👋", "success");
  };

  const logoutUser = async () => {
    try { await signOut(auth); } catch (e) {}
    setCurrentUser(DEFAULT_USER);
    setAssignments(DEFAULT_ASSIGNMENTS);
    setAttendance(DEFAULT_ATTENDANCE);
    setUploadedNotes(DEFAULT_UPLOADED_NOTES);
    setSavedNotes([]);
    setSavedPlanners([]);
    setChatHistory([]);
    setStudySessions(DEFAULT_STUDY_SESSIONS);
  };
  const updateProfile = (data) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
    addToast("Profile updated successfully!", "success");
  };

  const activeStudySession = studySessions.find((session) => !session.endedAt);
  const startStudySession = () => {
    if (activeStudySession) return;
    setStudySessions(prev => [
      ...prev,
      {
        id: `study-${Date.now()}`,
        startedAt: new Date().toISOString(),
        endedAt: null,
        durationMinutes: 0,
      }
    ]);
    addToast("Study session started. Keep focused and hit stop when you're done!", "success");
  };

  const stopStudySession = () => {
    if (!activeStudySession) return;
    const endedAt = new Date().toISOString();
    const durationMinutes = Math.max(1, Math.round((new Date(endedAt) - new Date(activeStudySession.startedAt)) / 60000));
    setStudySessions(prev => prev.map((session) =>
      session.id === activeStudySession.id
        ? { ...session, endedAt, durationMinutes }
        : session
    ));
    addToast("Study session stopped and saved to your log.", "success");
  };

  const clearStudySessions = () => {
    setStudySessions([]);
    addToast("All study sessions cleared.", "info");
  };

  const restoreStudySessions = (sessions = []) => {
    setStudySessions(sessions);
    addToast("Study sessions restored.", "success");
  };
  // ── Uploaded Notes ──
  const addUploadedNote = (noteObj) => {
    const newNote = { ...noteObj, id: `upload-${Date.now()}` };
    setUploadedNotes(prev => [newNote, ...prev]);
    addToast("Document analyzed successfully! 📄", "success");
    return newNote;
  };
   const deleteUploadedNote = (id) => {
    setUploadedNotes(prev => prev.filter(n => n.id !== id));
    addToast("Document removed.", "info");
    if (activeNoteContext?.id === id) setActiveNoteContext(null);
  };
  // ── Assignments ──
  const addAssignment = (item) => {
    setAssignments(prev => [{ ...item, id: Date.now().toString() }, ...prev]);
    addToast("Assignment added! ✅", "success");
  };
  const updateAssignmentStatus = (id, status) =>
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  const deleteAssignment = (id) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    addToast("Assignment removed.", "info");
  };
  // ── Attendance ──
  const addAttendanceCourse = (course) =>
    setAttendance(prev => [...prev, { ...course, id: Date.now().toString() }]);
  const updateAttendanceCounts = (id, attended, total) =>
    setAttendance(prev => prev.map(item => item.id === id ? { ...item, attended, total } : item));
  const deleteAttendanceCourse = (id) =>
    setAttendance(prev => prev.filter(item => item.id !== id));
  // ── Notes / Planners / Chat ──
  const addNote      = (note)    => setSavedNotes(prev    => [{ ...note,    id:`note-${Date.now()}` }, ...prev]);
  const addPlanner   = (planner) => setSavedPlanners(prev => [{ ...planner, id:`plan-${Date.now()}` }, ...prev]);
  const addChatMessage = (msg)   => setChatHistory(prev   => [...prev, { ...msg, id:`msg-${Date.now()}` }]);
  const clearChatHistory = ()    => setChatHistory([]);
  const toggleDarkMode   = ()    => setDarkMode(prev => !prev);
  return (
    <AuthContext.Provider value={{
      currentUser, assignments, attendance, uploadedNotes,
      savedNotes, savedPlanners, chatHistory, activeNoteContext, darkMode,
      toasts, addToast, removeToast,
      signupUser, loginUser, logoutUser, updateProfile,
      addUploadedNote, deleteUploadedNote, setActiveNoteContext,
      addAssignment, updateAssignmentStatus, deleteAssignment,
      addAttendanceCourse, updateAttendanceCounts, deleteAttendanceCourse,
      addNote, addPlanner, addChatMessage, clearChatHistory, toggleDarkMode,
      studySessions, activeStudySession, startStudySession, stopStudySession, clearStudySessions, restoreStudySessions
    }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  return ctx || {};
};