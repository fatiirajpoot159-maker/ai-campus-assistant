import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { askStudyAI, isGeminiAvailable } from "../services/geminiService";
import { Card } from "../components/DashboardCard";
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Volume2, 
  Trash2,
  Copy,
  Check,
  FileText,
  X
} from "lucide-react";
export function Chat() {
  const { chatHistory, addChatMessage, clearChatHistory, uploadedNotes, activeNoteContext, setActiveNoteContext } = useAuth();
  const location = useLocation();
  
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  
  const messagesEndRef = useRef(null);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const initialQ = searchParams.get("q");
    if (initialQ) {
      setInputQuery(initialQ);
      handleSendMessage(initialQ);
    }
  }, [location.search]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);
  const handleSendMessage = async (queryToSubmit) => {
    const q = queryToSubmit || inputQuery;
    if (!q.trim() || loading) return;
  const userMsg = { sender: "user", text: q, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    addChatMessage(userMsg);
    setInputQuery("");
    setLoading(true);
    try {
      const res = await askStudyAI(q, chatHistory, activeNoteContext);
      const aiMsg = { 
        sender: "ai", 
        text: res.explanation, 
        quiz: res.quiz,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      addChatMessage(aiMsg);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const toggleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice speech recognition is not supported on this browser. Try Chrome/Edge!");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    }
  };
     const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*$`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  const noteGroundedChips = activeNoteContext ? [
    `Summarize ${activeNoteContext.fileName}`,
    "Explain key concepts from my notes",
    "Make quiz from this chapter",
    "What are the exam questions from this note?"
  ] : [
    "Explain Gradient Descent in simple words",
    "What is 3NF Database Normalization?",
    "Explain Linear Regression with a real-world example",
    "How does TCP 3-way handshake work?"
  ];
  const geminiOnline = isGeminiAvailable();
  return (
    <div className="min-h-[calc(100vh-180px)] sm:min-h-[calc(100vh-150px)] lg:min-h-[calc(100vh-105px)] flex flex-col justify-between space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bot className="w-7 h-7 text-blue-600" />
            AI Study Assistant
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {geminiOnline ? (
              "Powered by Gemini API • Contextual Q&A, explanations & automatic quiz generation"
            ) : (
              <>
                Using local fallback AI engine. Add your Gemini API key in <a href="/settings" className="underline font-semibold">Settings</a> for live responses.
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Note Context Selector */}
          <select
            value={activeNoteContext?.id || ""}
            onChange={(e) => {
              const selected = uploadedNotes.find(n => n.id === e.target.value);
              setActiveNoteContext(selected || null);
            }}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold"
          >
            <option value="">🌐 General AI Knowledge Mode</option>
            {uploadedNotes.map(n => (
              <option key={n.id} value={n.id}>📄 Note: {n.fileName}</option>
            ))}
          </select>
          <button
            onClick={clearChatHistory}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs flex items-center gap-1.5"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </div>
      {/* Active Note Context Banner */}
      {activeNoteContext && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between gap-3 text-xs text-purple-900 dark:text-purple-200 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              <span className="font-bold">Active Document Context:</span> {activeNoteContext.fileName} ({activeNoteContext.courseName})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveNoteContext(null)}
            className="p-2 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            aria-label="Close active note context"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* Main Chat Container */}
      <Card hover={false} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl gradient-bg text-white flex items-center justify-center shadow-xl">
              <Bot className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeNoteContext ? `Ask anything about "${activeNoteContext.fileName}"` : "How can I assist your study session today?"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                {activeNoteContext
                  ? "I am contextualized on your uploaded lecture notes. Ask for summaries, key concepts, or practice quizzes!"
                  : "I can break down complex university concepts, provide practical examples, and quiz your retention."}
              </p>
            </div>
            {/* Starter Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl w-full pt-4">
              {noteGroundedChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputQuery(chip);
                    handleSendMessage(chip);
                  }}
                  className="p-3 text-left rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-400 transition-all flex items-center justify-between"
                >
                  <span>{chip}</span>
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender !== "user" && (
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-300 flex items-center justify-center text-sm font-bold shrink-0">
                    AI
                  </div>
                )}
                <div className={`max-w-full w-full rounded-3xl p-4 border ${msg.sender === "user" ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {msg.sender === "user" ? "You" : "AI Study Assistant"}
                    </div>
                    {msg.sender === "ai" && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => speakText(msg.text)}
                          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Listen to Explanation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(msg.text, msg.id || idx)}
                          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Copy text"
                        >
                          {copiedId === (msg.id || idx) ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="prose dark:prose-invert prose-xs text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </div>
                  {msg.quiz && msg.quiz.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/80 space-y-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 mb-3">
                        <HelpCircle className="w-4 h-4" />
                        <span>Interactive Knowledge Quiz</span>
                      </div>
                      <div className="space-y-4">
                        {msg.quiz.map((qItem, qIdx) => (
                          <div key={qIdx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                              Q{qIdx + 1}: {qItem.question}
                            </p>
                            <div className="grid grid-cols-1 gap-1.5 pt-1">
                              {qItem.options.map((opt, optIdx) => {
                                const answerKey = `${idx}-${qIdx}`;
                                const isSelected = selectedAnswers[answerKey] === optIdx;
                                const isCorrect = optIdx === qItem.answerIndex;
                                const isAnswered = selectedAnswers[answerKey] !== undefined;
                                const btnStyle = isAnswered
                                  ? isCorrect
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                                    : isSelected
                                      ? "border-rose-200 bg-rose-50 text-rose-900"
                                      : "border-slate-200 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                                  : "border-slate-200 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-400";

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    disabled={isAnswered}
                                    onClick={() => setSelectedAnswers(prev => ({ ...prev, [answerKey]: optIdx }))}
                                    className={`w-full p-2.5 text-left text-xs rounded-xl border transition-all flex items-center justify-between ${btnStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <span className={`block text-[10px] mt-2 text-right ${msg.sender === "user" ? "text-blue-100" : "text-slate-400"}`}>
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === "user" && (
                  <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center text-sm shrink-0">
                    S
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl gradient-bg text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-md">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="glass-card rounded-2xl px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  Analyzing query & notes context...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </Card>
      {/* Query Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={activeNoteContext ? `Ask anything about notes (${activeNoteContext.fileName})...` : "Ask AI a concept (e.g. 'Explain Gradient Descent step by step')..."}
            className="w-full pl-4 pr-12 py-3.5 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-lg"
          />
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`absolute right-3 top-3 p-1.5 rounded-xl transition-colors ${isListening
              ? "bg-rose-500 text-white animate-pulse"
              : "text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"}`}
            title={isListening ? "Listening... Click to stop" : "Voice AI Search"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="p-3.5 rounded-2xl gradient-bg text-white font-bold shadow-lg shadow-blue-500/25 hover:opacity-95 disabled:opacity-50 transition-opacity"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}

