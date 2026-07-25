import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { ToastContainer } from "./components/Toast";

import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { Chat } from "./pages/Chat";
import { Notes } from "./pages/Notes";
import { Planner } from "./pages/Planner";
import { Assignments } from "./pages/Assignments";
import { Attendance } from "./pages/Attendance";
import { Profile } from "./pages/Profile";
import { StudyHistory } from "./pages/History";
import { Settings } from "./pages/Settings";
import { Quiz } from "./pages/Quiz";
import { Flashcards } from "./pages/Flashcards";
import { CodingAssistant } from "./pages/CodingAssistant";
import { EmailWriter } from "./pages/EmailWriter";
import { CareerHub } from "./pages/CareerHub";
import NotFound from "./pages/NotFound";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden min-h-[calc(100vh-65px)]">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/coding-assistant" element={<CodingAssistant />} />
            <Route path="/email-writer" element={<EmailWriter />} />
            <Route path="/career-hub" element={<CareerHub />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<StudyHistory />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

