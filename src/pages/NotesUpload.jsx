import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { parseUploadedFile } from "../services/fileParser";
import { analyzeUploadedDocument } from "../services/geminiService";
import { Card } from "../components/DashboardCard";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  Bot, 
  RefreshCw, 
  BookOpen, 
  File, 
  Eye, 
  Layers,
  ArrowRight
} from "lucide-react";
export default function NotesUpload() {
  const { attendance, uploadedNotes, addUploadedNote, deleteUploadedNote, setActiveNoteContext } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [courseName, setCourseName] = useState("Artificial Intelligence");
  const [customCourse, setCustomCourse] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedDocView, setSelectedDocView] = useState(null);
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleUploadAndAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedFile || uploading) return;
    setUploading(true);
    const targetCourse = courseName === "Other" ? customCourse || "General Course" : courseName;
    try {
      // 1. Extract raw text from file
      const rawText = await parseUploadedFile(selectedFile);
      
      // 2. Run Gemini AI Document Analysis
      const aiAnalysis = await analyzeUploadedDocument(selectedFile.name, targetCourse, rawText);
 // 3. Save to AuthContext / LocalStorage
      const newDoc = addUploadedNote({
        fileName: selectedFile.name,
        courseName: targetCourse,
        fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "Analyzed",
        rawText,
        aiAnalysis
      });
      setSelectedDocView(newDoc);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      alert("Error parsing file. Please try a valid PDF, DOCX, or TXT document.");
    } finally {
      setUploading(false);
    }
  };
  const handleChatWithNote = (docItem) => {
    setActiveNoteContext(docItem);
    navigate(`/chat?q=Explain the main points from ${encodeURIComponent(docItem.fileName)}`);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Upload className="w-7 h-7 text-blue-600" />
          Lecture Notes Upload & AI Analyzer
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload PDF, DOCX, or TXT lecture notes. AI will summarize, extract key concepts, and prepare exam MCQs.
        </p>
      </div>
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form Box */}
        <Card hover={false} className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Upload New Lecture Document</span>
          </div>
          <form onSubmit={handleUploadAndAnalyze} className="space-y-4">
            {/* File Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select File (PDF, DOCX, TXT)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors p-4 text-center">
                <Upload className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-full sm:max-w-[200px]">
                  {selectedFile ? selectedFile.name : "Click or drag lecture note file"}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Supports PDF, DOCX, TXT (Max 25MB)
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
               {/* Course Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Associated Course / Subject
              </label>
              <select
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
              >
                {attendance.map((c) => (
                  <option key={c.id} value={c.course}>{c.course}</option>
                ))}
                <option value="Other">Other / Custom Course</option>
              </select>
              {courseName === "Other" && (
                <input
                  type="text"
                  placeholder="Enter Course Title..."
                  value={customCourse}
                  onChange={(e) => setCustomCourse(e.target.value)}
                  className="mt-2 w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              )}
            </div>
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="w-full py-3 text-xs font-bold text-white gradient-bg rounded-xl shadow-lg shadow-blue-500/20 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {uploading ? "Analyzing Document with AI..." : "Upload & Analyze Notes"}
            </button>
          </form>
        </Card>
          {/* Uploaded Documents Vault */}
        <Card hover={false} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Uploaded Notes Vault ({uploadedNotes.length})
              </h2>
            </div>
          </div>
          <div className="space-y-3">
            {uploadedNotes.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-semibold">No uploaded lecture notes yet.</p>
              </div>
            ) : (
              uploadedNotes.map((docItem) => (
                <div
                      key={docItem.id}
                      className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                      <div className="flex items-start gap-3">
                          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                              <File className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> {docItem.status}
                                  </span>
                                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                      {docItem.courseName}
                                  </span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                  {docItem.fileName}
                              </h4>
                              <p className="text-[11px] text-slate-400">
                                  Uploaded on {docItem.uploadDate} • {docItem.fileSize}
                              </p>
                          </div>
                      </div>
                      <div className="flex gap-2">
                          <button
                              onClick={() => setSelectedDocView(docItem)}
                              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors flex items-center gap-1"
                          >
                              <Eye className="w-3.5 h-3.5" /> View Analysis
                          </button>
                          <button
                              onClick={() => handleChatWithNote(docItem)}
                              className="px-3 py-1.5 text-xs font-bold rounded-xl gradient-bg text-white shadow-sm flex items-center gap-1"
                          >
                              <Bot className="w-3.5 h-3.5" /> Ask AI
                          </button>
                          <button
                              onClick={() => deleteUploadedNote(docItem.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                          >
                              <Trash2 className="w-4 h-4" />
                          </button>
                      </div>
                  </div>
              ))
            )}
          </div>
        </Card>
      </div>
       {/* Selected Document AI Analysis Modal / Panel */}
      {selectedDocView && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-full max-h-[85vh] glass-card rounded-3xl p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {selectedDocView.courseName}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {selectedDocView.fileName}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleChatWithNote(selectedDocView)}
                  className="px-4 py-2 text-xs font-bold text-white gradient-bg rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Bot className="w-4 h-4" /> Chat with AI on this Note
                </button>
                <button
                  onClick={() => setSelectedDocView(null)}
                  className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="prose dark:prose-invert prose-xs text-xs sm:text-sm leading-relaxed whitespace-pre-line p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800">
              {selectedDocView.aiAnalysis}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
