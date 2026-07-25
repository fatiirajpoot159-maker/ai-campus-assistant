import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/DashboardCard";
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Calendar, 
  Tag, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter
} from "lucide-react";
export function Assignments() {
  const { assignments, addAssignment, updateAssignmentStatus, deleteAssignment } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState("Artificial Intelligence");
  const [newDeadline, setNewDeadline] = useState("2026-07-25");
  const [newPriority, setNewPriority] = useState("High");
  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addAssignment({
      title: newTitle,
      course: newCourse,
      deadline: newDeadline,
      priority: newPriority,
      status: "Pending"
    });
    setNewTitle("");
    setShowAddModal(false);
  };
  const filteredAssignments = assignments.filter(item => {
    if (filterStatus === "All") return true;
    return item.status === filterStatus;
  });
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-7 h-7 text-emerald-600" />
            Assignment Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track coursework deadlines, prioritize homework, and update completion status.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 text-xs font-bold text-white gradient-bg rounded-xl shadow-md shadow-blue-500/20 hover:opacity-95 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Assignment</span>
        </button>
      </div>
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <Filter className="w-4 h-4 text-slate-400" />
        {["All", "Pending", "In Progress", "Completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              filterStatus === status
                ? "gradient-bg text-white shadow-sm"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            {status}
          </button>
        ))}
        </div>
         {/* Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-400">
            <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-40" />
            <p className="text-xs font-semibold">No assignments found for status "{filterStatus}".</p>
          </div>
        ) : (
          filteredAssignments.map((item) => {
            const isCompleted = item.status === "Completed";
            return (
              <Card key={item.id} hover={false} className="flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md ${
                        item.priority === "High"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                          : item.priority === "Medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                      }`}>
                        {item.priority} Priority
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {item.course}
                      </span>
                    </div>
                    
                    <h3 className={`text-base font-bold text-slate-900 dark:text-white ${
                      isCompleted ? "line-through opacity-60" : ""
                    }`}>
                      {item.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => deleteAssignment(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Assignment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Due: {item.deadline}</span>
                  </div>
                  {/* Status Toggle buttons */}
                  <div className="flex items-center gap-1">
                    {["Pending", "In Progress", "Completed"].map((st) => (
                      <button
                        key={st}
                        onClick={() => updateAssignmentStatus(item.id, st)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors ${
                          item.status === st
                            ? st === "Completed"
                              ? "bg-emerald-600 text-white"
                              : st === "In Progress"
                              ? "bg-blue-600 text-white"
                              : "bg-amber-600 text-white"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
       {/* Modal for Creating New Assignment */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-card rounded-3xl p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl animate-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Add New Assignment
            </h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Machine Learning Report"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                />
              </div>

 <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  required
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                  />
                </div>
                  <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white gradient-bg rounded-xl shadow-md"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}