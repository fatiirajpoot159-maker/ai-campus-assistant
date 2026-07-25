
import React from "react";
export function Card({ children, className = "", hover = true, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 shadow-sm ${
        hover ? "glass-card-hover" : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
export function StatCard({ title, value, subtitle, icon: Icon, color = "blue", badge }) {
  const colorMap = {
    blue: "from-blue-500 to-indigo-600 text-blue-600 bg-blue-50 dark:bg-blue-950/30",
    purple: "from-purple-500 to-violet-600 text-purple-600 bg-purple-50 dark:bg-purple-950/30",
    emerald: "from-emerald-500 to-teal-600 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
    amber: "from-amber-500 to-orange-600 text-amber-600 bg-amber-50 dark:bg-amber-950/30"
  };
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.blue}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
      {badge && (
        <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
          {badge}
        </span>
      )}
    </Card>
  );
}