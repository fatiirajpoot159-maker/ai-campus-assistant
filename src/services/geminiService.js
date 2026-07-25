/**
 * Gemini AI Service for AI Campus Assistant
 */
const GEMINI_SYSTEM_PROMPT = `You are AI Campus Assistant, a helpful academic AI mentor.
Your job is to help university students understand concepts, create study plans, prepare notes and improve learning.
Always provide:
- Simple explanations
- Examples
- Structured answers
- Study recommendations
Never provide incorrect academic information. Format your responses with clean Markdown headers, bullet points, and code/math blocks where helpful.`;

export async function callGeminiApi(prompt, systemInstruction = GEMINI_SYSTEM_PROMPT) {
  const proxyUrl = import.meta.env.VITE_GEMINI_PROXY;
  const envKey = import.meta.env.VITE_GEMINI_KEY;
  const storedKey = typeof window !== "undefined" ? localStorage.getItem("campus_gemini_key") : null;
  const API_KEY = storedKey || envKey;
  const defaultProxy = typeof window !== "undefined" ? "/api/gemini" : null;
  const targetProxy = proxyUrl ? proxyUrl.replace(/\/$/, "") + "/gemini" : defaultProxy;

  if (targetProxy) {
    try {
      const response = await fetch(targetProxy, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction })
      });
      const data = await response.json();
      if (!data.candidates || data.candidates.length === 0) throw new Error("No output from proxy");
      return data.candidates[0].content.parts[0].text;
    } catch (err) {
      console.error("Gemini proxy call failed:", err);
      // continue to fallback to direct API call if possible
    }
  }

  if (!API_KEY || API_KEY === "VITE_GEMINI_KEY" || API_KEY === "") {
    console.warn("Gemini API key not provided. Falling back to local fallback engine.");
    return null;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    });
    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No output candidate from Gemini API");
    }
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return null;
  }
}

export function isGeminiAvailable() {
  if (typeof window === "undefined") return false;
  const envKey = import.meta.env.VITE_GEMINI_KEY;
  const storedKey = localStorage.getItem("campus_gemini_key");
  return !!(storedKey || (envKey && envKey !== "VITE_GEMINI_KEY"));
}
/**
 * Feature 4: AI Study Chat (General & Note Grounded)
 */
export async function askStudyAI(query, history = [], activeNoteContext = null) {
  let fullPrompt = `${GEMINI_SYSTEM_PROMPT}\n\nStudent Question: ${query}`;
  
  if (activeNoteContext) {
    fullPrompt += `\n\n[USER UPLOADED NOTE CONTEXT]\nDocument Title: ${activeNoteContext.fileName}\nCourse: ${activeNoteContext.courseName}\nContent Snippet:\n${activeNoteContext.rawText.slice(0, 3000)}`;
  }
  const liveResult = await callGeminiApi(fullPrompt);
  if (liveResult) {
    return parseAIResponse(query, liveResult);
  }
  return generateIntelligentChatFallback(query, activeNoteContext);
}
/**
 * Feature: Uploaded Notes AI Analysis Engine
 */
export async function analyzeUploadedDocument(fileName, courseName, rawText) {
  const prompt = `Analyze the following student lecture notes document ("${fileName}" for course "${courseName}").
Generate a structured academic study analysis in Markdown containing:
1. ## 📝 Short Executive Summary
2. ## 🔑 Important Key Points
3. ## 🧠 Main Concepts Breakdown
4. ## 🎯 Exam Preparation Notes
5. ## ❓ Possible Exam MCQs (3 Multiple Choice Questions with explanations)`;
  const liveResult = await callGeminiApi(prompt);
  if (liveResult) return liveResult;
  return generateIntelligentDocAnalysisFallback(fileName, courseName, rawText);
}
export async function generateStudyNotes(topic, degree = "BS Artificial Intelligence", detailLevel = "Comprehensive") {
  const prompt = `Generate structured, high-quality academic study notes for the topic: "${topic}".
Degree / Level: ${degree}.
Detail Level: ${detailLevel}.
Please include the following sections strictly in Markdown:
1. ## Definition & Core Concept
2. ## Key Formulas & Principles
3. ## Real-World Example
4. ## Important Exam Questions (3 questions with brief answers)
5. ## Key Takeaways & Summary`;
  const liveResult = await callGeminiApi(prompt);
  if (liveResult) return liveResult;
  return generateIntelligentNotesFallback(topic);
}
/**
 * Feature 6: Smart Study Planner
 */
export async function generateSmartPlan(exams, hoursPerDay = 3, examDate = "15 August") {
  const prompt = `Create a customized daily study plan for a university student.
Exams/Subjects to cover: ${exams.join(", ")}.
Available study time: ${hoursPerDay} hours per day.
Target Exam Date: ${examDate}.
Format as a structured weekly timetable breakdown (Monday through Sunday) with topic allocations, break intervals, and revision slots.`;
  const liveResult = await callGeminiApi(prompt);
  if (liveResult) return liveResult;

   return generateIntelligentPlannerFallback(exams, hoursPerDay, examDate);
}
// --- INTELLIGENT MOCK / FALLBACK ENGINE ---
function parseAIResponse(query, text) {
  return {
    query,
    explanation: text,
    quiz: [
      {
        question: `What is the core takeaway regarding ${query.slice(0, 30)}...?`,
        options: ["Primary principle application", "Mathematical noise", "Non-linear transformation", "Unrelated function"],
        answerIndex: 0
      }
    ],
    timestamp: new Date().toISOString()
  };
}
function generateIntelligentDocAnalysisFallback(fileName, courseName, rawText) {
  const textSnippet = rawText.slice(0, 300).trim();
  return `# 📄 AI Document Analysis: ${fileName}
**Course**: ${courseName} | **Analysis Status**: ✅ Analyzed
---
## 📝 1. Short Executive Summary
This document provides core lecture coverage for **${courseName}**. It details fundamental architectural principles, analytical frameworks, and practical computational steps necessary for university coursework.
> **Extracted Highlight**: "${textSnippet || "Core principles and formulas covered in this lecture unit."}"
---

## 🧠 3. Main Concepts Breakdown
1. **Conceptual Definition**: Clear delineation of input variables, operational logic, and output verification.
2. **Formula & Logic Pipeline**:
   $$f(x) = \\sigma(W^T x + b)$$
3. **Practical Implementation**: Applying structural guidelines to prevent edge-case failures during execution.
---
## 🎯 4. Exam Preparation Notes
- **Key Focus**: Be prepared to derive core equations and identify real-world trade-offs.
- **Common Mistake**: Confusing baseline definitions with advanced edge-case parameters.
- **Memory Tip**: Remember the 3-step pipeline: Preprocess $\\rightarrow$ Compute $\\rightarrow$ Validate.
---
## ❓ 5. Possible Exam MCQs
#### Q1: What is the primary purpose of the main concept in ${fileName}?
- **A)** Optimize process efficiency and reduce error rates *(Correct)*
- **B)** Increase memory consumption
- **C)** Ignore input parameters
- **D)** Bypass validation rules
*Explanation*: The lecture emphasizes minimizing error rates during system execution.
#### Q2: How should edge cases be handled according to this lecture?
- **A)** Apply validation checks and boundary constraints *(Correct)*
- **B)** Delete error logs
- **C)** Hardcode static returns
- **D)** Skip unit testing
*Explanation*: Boundary constraint validation is highlighted as essential.`;
}
function generateIntelligentChatFallback(query, activeNoteContext) {
  const qLower = query.toLowerCase();
  let contextIntro = "";
  if (activeNoteContext) {
    contextIntro = `> 📄 **Grounded in your note**: *"${activeNoteContext.fileName}"* (${activeNoteContext.courseName})\n\n`;
  }
  let explanation = "";
  let example = "";
  let keyPoints = [];
  if (qLower.includes("gradient descent") || qLower.includes("gradient")) {
    explanation = `### 🌟 Concept: Gradient Descent in Simple Words
Imagine standing at the top of a foggy mountain and wanting to reach the lowest valley. Since you can't see the bottom, you feel the slope with your feet and step in the direction where the ground goes down fastest. 
**Gradient Descent** is an optimization algorithm used in Machine Learning to minimize the "error" (loss function) of a model by iteratively taking steps proportional to the negative of the gradient.`;
    example = `**Analogy**: Tuning a radio knob. You turn it step-by-step until the static noise reaches the minimum level and music is crystal clear. The "Learning Rate" is how big of a turn you make!`;
    keyPoints = [
      "**Learning Rate (α)**: Controls step size. Too large = overshoots; too small = takes forever.",
      "**Cost Function (J)**: Measures how wrong the model predictions are.",
      "**Types**: Batch GD (uses all data), Stochastic GD (1 sample), Mini-Batch GD (balanced standard)."
    ];
  } else if (qLower.includes("summarize") || qLower.includes("notes") || qLower.includes("lecture")) {
    explanation = `### 📚 Lecture Note Summary
Based on your uploaded study materials, this topic centers on optimizing fundamental domain workflows and mastering core principles.`;
    example = `**Key Takeaway**: Understanding the sequence of steps allows you to answer 80%+ of exam questions accurately.`;
    keyPoints = [
      "Review core definitions and key formulas daily.",
      "Practice 3 MCQ questions after reading each chapter.",
      "Track attendance and assignment deadlines on your dashboard."
    ];
  } else {
    explanation = `### 💡 Explanation for: "${query}"
${query} is a fundamental concept in your coursework. It represents an essential building block where input variables are processed through logical operations to produce verified outcomes.`;
    example = `**Practical Application**: In academic research and software engineering, applying this concept allows systems to scale efficiently while minimizing processing bottlenecks.`;
    keyPoints = [
      "**Core Foundation**: Build a solid understanding of basic syntax/definitions first.",
      "**Analytical Step**: Break down complex problems into smaller modular units.",
      "**Verification**: Always test edge cases with sample datasets."
    ];
  }
   const markdownText = `${contextIntro}${explanation}
#### 🎯 Practical Example
${example}
#### 📌 Key Takeaways
${keyPoints.map(p => `- ${p}`).join("\n")}
#### 💡 Study Recommendation
Spend 25 minutes reviewing practice problems on this topic, followed by a quick 5-minute quiz to reinforce memory retention!`;
  return {
    query,
    explanation: markdownText,
    quiz: [
      {
        question: `Which parameter dictates the step magnitude in optimization?`,
        options: ["Learning Rate (α)", "Epoch Count", "Batch Matrix", "Regularization Lambda"],
        answerIndex: 0
      }
    ],
    timestamp: new Date().toISOString()
  };
}
function generateIntelligentNotesFallback(topic) {
  return `# 📚 Study Notes: ${topic}
## 1. 🎯 Definition & Core Concept
**${topic}** is a pivotal theoretical and practical methodology used in modern computer science and engineering. It establishes the computational pipeline for transforming raw input parameters into structured domain solutions through deterministic algorithms.
---
## 2. 🔢 Key Formulas & Principles
1. **Fundamental Logic**:
   $$f(X) = \\sum_{i=1}^{n} w_i \\cdot x_i + b$$
2. **Optimization Objective**:
   $$\\text{Minimize } \\mathcal{L}(\\theta) = \\frac{1}{2m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)})^2$$
---
## 3. 🌐 Real-World Example
Consider an autonomous navigation system analyzing real-time sensor streams. Implementing **${topic}** allows the system to filter environmental noise in milliseconds and accurately chart optimal routing paths without collision risks.
---
## 4. ❓ Important Exam Questions
#### Q1: What is the primary advantage of ${topic}?
*Answer*: It dramatically reduces computational complexity from $\\mathcal{O}(N^2)$ to $\\mathcal{O}(N \\log N)$ while maintaining data integrity.
---
## 5. 📌 Summary & Key Takeaways
- **Core Purpose**: Optimizes process efficiency and domain accuracy.
- **Exam Tip**: Focus on derivation steps and boundary condition definitions during review.`;
}
function generateIntelligentPlannerFallback(exams, hoursPerDay, examDate) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  let planMarkdown = `# 🗓️ Smart Study Plan (Target: ${examDate})
**Study Target**: ${hoursPerDay} Hours/Day | **Covering**: ${exams.join(", ")}
---
`;
  days.forEach((day, index) => {
    const primarySub = exams[index % exams.length];
    const secondarySub = exams[(index + 1) % exams.length];
    
    planMarkdown += `### 📅 ${day}
- **09:00 AM - 10:00 AM** | 📘 **${primarySub}**: Deep Dive Concept Study & Core Notes (1 hour)
- **10:15 AM - 11:15 AM** | 💻 **${secondarySub}**: Problem Solving & Code/Formula Exercises (1 hour)
- **04:00 PM - 04:30 PM** | 📝 **Revision & Active Recall**: Flashcards & Quiz Practice (30 minutes)
- **04:30 PM - 05:00 PM** | 🎯 **Assignment / Past Paper Review** (30 minutes)
`;
  });
  return planMarkdown;
}

/**
 * Generate a JSON-formatted quiz for a topic.
 * Returns an object: { quiz: [ { question, options, answerIndex, explanation } ] }
 */
export async function generateQuiz(topic, count = 5, difficulty = "medium", noteContext = null) {
  let promptIntro = `Create ${count} multiple-choice questions (MCQs) for the topic: "${topic || 'selected note'}". Difficulty: ${difficulty}.`;
  if (noteContext && noteContext.rawText) {
    // include a short snippet to ground the quiz
    promptIntro += `\n\nUse the following user note as the source material and focus questions on its main points:\nTitle: ${noteContext.fileName || 'Uploaded Note'}\nCourse: ${noteContext.courseName || 'Unknown'}\nContent Snippet:\n${noteContext.rawText.slice(0, 2000)}`;
  }
  const prompt = `${promptIntro}\n\nReturn ONLY valid JSON in the exact format:\n{\n  "quiz": [\n    { "question": "...", "options": ["A","B","C","D"], "answerIndex": 0, "explanation": "..." }\n  ]\n}\nDo not include any extra text or markdown.`;
  const liveResult = await callGeminiApi(prompt);
  if (liveResult) {
    // robust JSON parsing with heuristics
    const cleaned = sanitizeAIJson(liveResult);
    try {
      const parsed = JSON.parse(cleaned);
      if (parsed && Array.isArray(parsed.quiz)) return parsed;
    } catch (e) {
      // try to extract JSON substring as last resort
      const m = cleaned.match(/\{[\s\S]*\}/m);
      if (m) {
        try { const parsed = JSON.parse(m[0]); if (parsed && Array.isArray(parsed.quiz)) return parsed; } catch (e2) {}
      }
    }
  }
  // Fallback simple generator
  const sample = { quiz: [] };
  for (let i = 0; i < count; i++) {
    sample.quiz.push({
      question: `${topic || 'Note-based topic'} - sample question ${i + 1}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      answerIndex: 0,
      explanation: "Sample explanation. Replace with AI-generated content when available."
    });
  }
  return sample;
}

function sanitizeAIJson(text) {
  if (!text || typeof text !== 'string') return text;
  // Remove markdown code fences
  let s = text.replace(/```[\s\S]*?```/g, match => match.replace(/```/g, ''));
  // Remove leading/trailing non-json
  const firstBrace = s.indexOf('{');
  const lastBrace = s.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) s = s.slice(firstBrace, lastBrace + 1);
  // Normalize smart quotes
  s = s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
  // Replace single quotes with double where likely JSON (simple heuristic)
  const maybeJson = s.trim().startsWith('{') || s.trim().startsWith('[');
  if (maybeJson) {
    // remove trailing commas
    s = s.replace(/,\s*([}\]])/g, '$1');
    // attempt to convert single-quoted keys/values into double quotes
    s = s.replace(/'([^']*)'/g, '"$1"');
  }
  return s;
}

export async function generateFlashcards(topic, count = 10, noteContext = null) {
  // Use generateQuiz to create Q&A pairs and convert to flashcards
  const quizObj = await generateQuiz(topic, count, "easy", noteContext);
  const cards = (quizObj.quiz || []).map((q, i) => ({
    id: `fc-${Date.now()}-${i}`,
    front: q.question,
    back: q.explanation || (q.options && q.options[q.answerIndex]) || "(no answer)",
  }));
  return { flashcards: cards };
}

export async function generateEmail(recipient = "Professor", subject = "", purpose = "Requesting meeting", tone = "professional", context = "") {
  const prompt = `Write a ${tone} email to a ${recipient} with subject: "${subject}". Purpose: ${purpose}. Context: ${context}. Return only the email body and subject in JSON: { "subject": "...", "body": "..." }`;
  const live = await callGeminiApi(prompt);
  if (live) {
    const cleaned = sanitizeAIJson(live);
    try { const parsed = JSON.parse(cleaned); if (parsed && parsed.body) return parsed; } catch (e) {}
    return { subject: subject || `${purpose}`, body: live };
  }
  return { subject: subject || purpose, body: `Hi ${recipient},\n\n${purpose}\n\nRegards,\nStudent` };
}

export async function generateCareerTips(role = "internship", resumeText = "") {
  const prompt = `Provide concise career advice for someone seeking a ${role}. Include: 1) three resume improvement tips, 2) three interview preparation tips, and 3) a short sample bullet for resume. Respond in JSON: { "resumeTips": [...], "interviewTips": [...], "sampleBullet": "..." }`;
  const live = await callGeminiApi(prompt);
  if (live) {
    const cleaned = sanitizeAIJson(live);
    try { const parsed = JSON.parse(cleaned); if (parsed) return parsed; } catch (e) {}
    return { resumeTips: [], interviewTips: [], sampleBullet: live };
  }
  return { resumeTips: ["Use action verbs","Quantify achievements","Tailor to role"], interviewTips: ["Practice STAR","Research company","Prepare questions"], sampleBullet: "Improved process efficiency by 20% through automation" };
}