🎓 AI Campus Assistant

Your Personal AI Academic Companion — an all-in-one student productivity platform that combines AI tutoring, note generation, study planning, and academic organization into a single app.

🔗 Live App:https://ai-campus-assistant-221ud6yw4-haya-fatimas-projects.vercel.app 📂 GitHub Repo: github.com/fatiirajpoot159-maker/ai-campus-assistant

📌 The Problem

University students juggle multiple disconnected tools — one app for notes, another for planning, another for chasing explanations of difficult concepts, and a spreadsheet or planner for assignments and attendance. This fragmentation makes it easy to fall behind, especially before exams.

AI Campus Assistant solves this by giving students one place to:

Get concepts explained in plain language, on demand
Turn any topic into structured, exam-ready notes instantly
Generate a realistic day-by-day study plan before an exam
Track assignments and attendance without spreadsheets

Who it's for: university and college students who want an AI-powered academic companion that reduces the overhead of staying organized, so they can spend more time actually learning.

✨ Features
Professional Landing Page — Hero section, value propositions, live metrics counter, and 6 feature launchpads.
Authentication System — Firebase Authentication with a fallback demo profile mode for instant testing.
Student Dashboard — Real-time progress counters (Courses, Assignments, Attendance %, Study Hours), quick launchpads, and deadline alerts.
AI Study Assistant (Core AI Feature) — Powered by the Gemini API: simple explanations, practical examples, key-takeaway bullet points, interactive quizzes, text-to-speech, and voice input via speech recognition.
AI Notes Generator — Converts any academic topic into structured Markdown notes (Definitions, Formulas, Real-World Examples, Exam Questions, Summary).
Smart Study Planner (Agent Feature) — Generates a day-by-day exam schedule tailored to daily available study hours and a target exam date.
Assignment Manager — Full CRUD assignment management with priority tags, status updates (Pending, In Progress, Completed), and deadline sorting.
Attendance Tracker — Class attendance counter with a 75% threshold safety indicator (Safe, Warning, Critical).
Study History — A saved vault of past AI chats, generated notes, and study planners.
Student Profile — Academic credentials, semester info, and earned badges (AI Course Completed, Cybersecurity Certified, Top Attendance Streak).
🤖 The AI Feature

The core AI feature is the AI Study Assistant, powered by the Gemini API. It acts as an academic mentor rather than a generic chatbot — every response follows a consistent, learning-focused structure (explanation → example → key takeaways → optional quiz), and it also supports voice input and text-to-speech for hands-free study.

System Prompt
text
You are AI Campus Assistant, a helpful academic AI mentor.
Your job is to help university students understand concepts, create study plans, prepare notes and improve learning.

Always provide:
- Simple explanations
- Examples
- Structured answers
- Study recommendations

Never provide incorrect academic information.

This same underlying model also powers the AI Notes Generator (structured Markdown notes) and the Smart Study Planner (day-by-day exam schedules), applying the same mentor-style reasoning to different structured outputs.

🛠️ Tools, Services & Models Used
Category	Tool / Service
AI Model	Google Gemini API
Authentication & Database	Firebase Authentication + Firestore
Frontend Framework	React (Vite)
Deployment	Vercel
Serverless Proxy	Vercel Serverless Functions (keeps the Gemini key off the client)
Design & Prototyping	Google Stitch, Claude Design
Planning & Research	NotebookLM
Workflow Automation	n8n 

Create Student Account 
<img width="1382" height="852" alt="1" src="https://github.com/user-attachments/assets/73d9d868-6592-42bb-b544-f5e64aec99d5" />

Student Dashboard
<img width="937" height="862" alt="2" src="https://github.com/user-attachments/assets/b05fc707-ee51-4900-bdbb-acbe65f54648" />

Quick AI Launchpads
<img width="937" height="856" alt="3" src="https://github.com/user-attachments/assets/ea2a00a9-cd5e-4a79-a9ae-1932628ef4ea" />

AI Study Assistant
<img width="933" height="850" alt="4" src="https://github.com/user-attachments/assets/5b352a9c-f71e-4337-b1ac-ed97078125fc" />

Quiz Generator
<img width="927" height="831" alt="5" src="https://github.com/user-attachments/assets/5715991c-2545-4865-bb16-e0d39de88dc4" />

🚀 How to Run the Project
1. Clone and install dependencies
bash
git clone https://github.com/fatiirajpoot159-maker/ai-campus-assistant.git
cd ai-campus-assistant
npm install
2. Set up environment variables

Create a .env file in the root directory:

env
VITE_GEMINI_KEY=your_gemini_api_key_here
VITE_FIREBASE_KEY=your_firebase_api_key_here
VITE_FIREBASE_PROJECT_ID=ai-campus-assistant

If environment keys are omitted, the app runs in an intelligent local demo mode for instant testing.

3. Run the dev server
bash
npm run dev
4. Build for production
bash
npm run build
5. (Optional) Run the Gemini proxy locally
bash
npm run start:proxy
npm run dev

The app routes /api/gemini to the local proxy in development and to the serverless proxy in production.

🌐 Deployment (Vercel)
Create a Vercel project and connect your GitHub repository.
Set these environment variables in your Vercel project settings:
env
GEMINI_KEY=your_gemini_api_key_here
VITE_FIREBASE_KEY=your_firebase_api_key_here
VITE_FIREBASE_PROJECT_ID=ai-campus-assistant
(Optional) If you want the client to explicitly call the proxy:
env
VITE_GEMINI_PROXY=https://your-vercel-app.vercel.app/api
Deploy.

⚠️ Never commit API keys or secrets to the repository. Keep them in your hosting provider's environment variables only.
