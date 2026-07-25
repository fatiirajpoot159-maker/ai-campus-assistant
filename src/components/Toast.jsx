import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
const TOAST_ICONS = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error:   <AlertCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info:    <Info className="w-5 h-5 text-blue-500" />
};
const TOAST_COLORS = {
  success: "border-l-emerald-500",
  error:   "border-l-red-500",
  warning: "border-l-amber-500",
  info:    "border-l-blue-500"
};
function Toast({ toast }) {
  const { removeToast } = useAuth();
  return (
    <div
      className={`
        flex items-start gap-3 bg-white dark:bg-slate-800 shadow-xl rounded-xl
        px-4 py-3 w-72 border border-slate-200 dark:border-slate-700
        border-l-4 ${TOAST_COLORS[toast.type] || TOAST_COLORS.info}
        animate-slide-up
      `}
    >
      {TOAST_ICONS[toast.type] || TOAST_ICONS.info}
      <p className="text-sm text-slate-700 dark:text-slate-200 flex-1 leading-snug">
        {toast.message}
      </p>
      <button
          onClick={() => removeToast(toast.id)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
export function ToastContainer() {
  const { toasts } = useAuth();
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      {toasts.map(t => <Toast key={t.id} toast={t} />)}
    </div>
  );
}