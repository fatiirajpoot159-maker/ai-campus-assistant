## 🌟 Features Built
## React Compiler
1. **Professional Landing Page**: Hero section, value propositions, metrics counter, and 6 feature launchpads.
2. **Authentication System**: Firebase Authentication + fallback demo profile mode.
3. **Student Dashboard**: Real-time progress counters (Courses, Assignments, Attendance %, Study Hours), quick launchpads, and deadline alerts.
4. **AI Study Assistant (Core Feature)**: Powered by Gemini API with simple explanations, practical examples, key takeaway bullet points, interactive quizzes, text-to-speech, and voice input (Speech recognition).
5. **AI Notes Generator**: Transforms any academic topic into structured Markdown notes (Definitions, Formulas, Real-world Examples, Exam Questions, Summary).
6. **Smart Study Planner (Agent Feature)**: Generates day-by-day exam schedules tailored to daily available study hours and target exam dates.
7. **Assignment Manager**: Full CRUD assignment management with priority tags, status updates (Pending, In Progress, Completed), and deadline sorting.
8. **Attendance Tracker**: Class attendance counter with 75% threshold safety status indicators (*Safe*, *Warning*, *Critical*).
9. **Study History**: Vault for saved AI chats, generated notes, and study planners.
10. **Student Profile**: Academic credentials, semester info, and earned badges (*AI Course Completed*, *Cybersecurity Certified*, *Top Attendance Streak*).
The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
---
## Expanding the Oxlint configuration
## 🤖 AI System Prompt
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
```text
You are AI Campus Assistant, a helpful academic AI mentor.
Your job is to help university students understand concepts, create study plans, prepare notes and improve learning.
Always provide:
- Simple explanations
- Examples
- Structured answers
- Study recommendations
Never provide incorrect academic information.
```
---
## ⚙️ Environment Variables Setup
Create a `.env` file in the root directory:
```env
VITE_GEMINI_KEY=your_gemini_api_key_here
VITE_FIREBASE_KEY=your_firebase_api_key_here
VITE_FIREBASE_PROJECT_ID=ai-campus-assistant
```
*(Note: If environment keys are omitted, the app operates in intelligent local demonstration mode for instant testing!)*
---
## 🚀 Quick Start Instructions
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run dev server**:
   ```bash
   npm run dev
   ```
3. **Build for production**:
   ```bash
   npm run build
   ```
---
## 🌐 Deployment (Vercel)
To deploy to Vercel:
```bash
git add .
git commit -m "Final submission - AI Campus Assistant"

## 🌐 Deployment (Vercel)
1. Create a Vercel project and connect your GitHub repository.
2. Set these environment variables in Vercel:

```env
GEMINI_KEY=your_gemini_api_key_here
VITE_FIREBASE_KEY=your_firebase_api_key_here
VITE_FIREBASE_PROJECT_ID=ai-campus-assistant
```

3. Deploy the app.

### Optional `VITE_GEMINI_PROXY`
If you want the client to explicitly use the proxy, set:
```env
VITE_GEMINI_PROXY=https://your-vercel-app.vercel.app/api
```

### Local Proxy Development
Run the proxy locally and start Vite:

```bash
npm install
npm run start:proxy
npm run dev
```

The app will route `/api/gemini` to the local proxy during development and use the serverless proxy in production.
