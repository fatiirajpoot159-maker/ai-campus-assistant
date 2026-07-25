import React, { useState, useEffect } from "react";

export function Settings() {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("campus_gemini_key") || "";
    setKey(stored);
  }, []);

  const saveKey = () => {
    localStorage.setItem("campus_gemini_key", key.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearKey = () => {
    localStorage.removeItem("campus_gemini_key");
    setKey("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold mb-2">Gemini API Key</h2>
        <p className="text-xs text-slate-500 mb-4">Paste your Google Generative AI (Gemini) API key here to enable live responses. This is stored locally in your browser only.</p>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter Gemini API key (starts with AI... or similar)"
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
        />
        <div className="mt-4 flex items-center gap-3">
          <button onClick={saveKey} className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold">Save Key</button>
          <button onClick={clearKey} className="px-4 py-2 rounded-xl bg-rose-500 text-white font-semibold">Clear Key</button>
          {saved && <span className="text-sm text-slate-500">Saved</span>}
        </div>
      </div>
    </div>
  );
}

export default Settings;