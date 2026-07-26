import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { ToastContainer } from "./components/Toast";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Chat = lazy(() => import("./pages/Chat"));
const Notes = lazy(() => import("./pages/Notes"));
const Planner = lazy(() => import("./pages/Planner"));
const Assignments = lazy(() => import("./pages/Assignments"));
const Attendance = lazy(() => import("./pages/Attendance"));
const GPACalculator = lazy(() => import("./pages/GPACalculator"));
const Profile = lazy(() => import("./pages/Profile"));
const StudyHistory = lazy(() => import("./pages/History"));
const Settings = lazy(() => import("./pages/Settings"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Flashcards = lazy(() => import("./pages/Flashcards"));
const CodingAssistant = lazy(() => import("./pages/CodingAssistant"));
const EmailWriter = lazy(() => import("./pages/EmailWriter"));
const CareerHub = lazy(() => import("./pages/CareerHub"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
        <Suspense fallback={<div className="p-6 text-slate-600">Loading...</div>}>
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
              <Route path="/notes" element={<Notes />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/coding-assistant" element={<CodingAssistant />} />
              <Route path="/email-writer" element={<EmailWriter />} />
              <Route path="/gpa-calculator" element={<GPACalculator />} />
              <Route path="/career-hub" element={<CareerHub />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/history" element={<StudyHistory />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

