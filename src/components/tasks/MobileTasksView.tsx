import React, { useState } from 'react';
import { CheckCircle2, Clock, Plus, Award, Check, X, Edit3, History, ShieldAlert } from 'lucide-react';
import type { ChoreTask, TaskCategory, TaskFrequency } from '../../types/task';
import type { ActivityItem } from '../../types/activity';
import type { CurrencyConfig } from '../../types/allowance';
import type { AppUserRole } from '../../types/pairing';
import { formatCurrency } from '../../config/currencies';
import { hapticsService } from '../../services/hapticsService';
import { confettiService } from '../../services/confettiService';

interface MobileTasksViewProps {
  tasks: ChoreTask[];
  activities: ActivityItem[];
  currency: CurrencyConfig;
  userRole: AppUserRole;
  teenName: string;
  parentName: string;
  onMarkTaskCompleted: (taskId: string) => void;
  onApproveTask: (taskId: string) => void;
  onAddNewTask: (task: Omit<ChoreTask, 'id' | 'status'>) => void;
  onUpdateTask?: (taskId: string, updates: Partial<ChoreTask>) => void;
}

export const MobileTasksView: React.FC<MobileTasksViewProps> = ({
  tasks,
  activities,
  currency,
  userRole,
  teenName,
  parentName,
  onMarkTaskCompleted,
  onApproveTask,
  onAddNewTask,
  onUpdateTask,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editReward, setEditReward] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newReward, setNewReward] = useState('50');
  const [newCategory, setNewCategory] = useState<TaskCategory>('CHORES');
  const [newFrequency, setNewFrequency] = useState<TaskFrequency>('DAILY');
  const [showActivityDrawer, setShowActivityDrawer] = useState(false);

  const handleKidSubmit = async (taskId: string) => {
    await hapticsService.notifySuccess();
    onMarkTaskCompleted(taskId);
  };

  const handleParentApprove = async (taskId: string) => {
    await hapticsService.impactHeavy();
    confettiService.fireCelebration();
    onApproveTask(taskId);
  };

  const handleStartEdit = (task: ChoreTask) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditReward(String(task.rewardAmount));
  };

  const handleSaveEdit = (taskId: string) => {
    if (!editTitle.trim() || !onUpdateTask) return;
    onUpdateTask(taskId, {
      title: editTitle.trim(),
      rewardAmount: Number(editReward) || 50,
    });
    setEditingTaskId(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await hapticsService.notifySuccess();
    onAddNewTask({
      title: newTitle.trim(),
      category: newCategory,
      frequency: newFrequency,
      rewardAmount: Number(newReward) || 50,
      assignedToProfileId: '',
      icon: '⭐',
    });

    setIsAdding(false);
    setNewTitle('');
    setNewReward('50');
  };

  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-3 pb-20 animate-in fade-in duration-300 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">Chores & Responsibilities</h2>
            <p className="text-[11px] text-slate-400">
              {completedCount} of {tasks.length} bounties earned
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowActivityDrawer(!showActivityDrawer)}
            className="p-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
            title="Activity Notifications"
          >
            <History className="w-4 h-4 text-indigo-400" />
          </button>

          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-indigo-500 text-slate-950 rounded-xl flex items-center gap-1 text-xs font-black active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Activity Log Drawer */}
      {showActivityDrawer && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-3 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
              <History className="w-3.5 h-3.5" />
              <span>Recent Family Activity</span>
            </span>
            <button onClick={() => setShowActivityDrawer(false)} className="text-slate-400 hover:text-white p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {activities.length > 0 ? (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <div className="flex justify-between font-bold text-white">
                    <span>{act.title}</span>
                    {act.amount && <span className="text-emerald-400 font-mono">+{formatCurrency(act.amount, currency)}</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{act.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 py-1 text-center">No recent activities logged yet.</p>
          )}
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2.5">
        {tasks.map((task) => {
          const isDone = task.status === 'COMPLETED';
          const isPending = task.status === 'PENDING_APPROVAL';
          const isEditing = editingTaskId === task.id;

          return (
            <div
              key={task.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 opacity-80'
                  : isPending
                  ? 'bg-amber-950/25 border-amber-500/40 shadow-sm'
                  : 'bg-slate-900/95 border-slate-800 shadow-sm'
              }`}
            >
              {isEditing ? (
                /* In-Place Task Editing by Parent */
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editReward}
                      onChange={(e) => setEditReward(e.target.value)}
                      className="w-28 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-emerald-400 font-mono font-bold"
                    />
                    <button
                      onClick={() => handleSaveEdit(task.id)}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="px-2 py-1 text-slate-400 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Task Display */
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xl mt-0.5">{task.icon || '⭐'}</span>
                    <div>
                      <h4 className={`text-xs font-bold leading-snug ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded mt-1 inline-block">
                        {task.frequency}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-1.5">
                    <div>
                      <span className="text-sm font-black font-mono text-emerald-400 block">
                        +{formatCurrency(task.rewardAmount, currency)}
                      </span>
                    </div>
                    {userRole === 'PARENT' && (
                      <button
                        onClick={() => handleStartEdit(task)}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Edit Task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons depending on role */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                {isDone ? (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Bounty Credited to Vault</span>
                  </span>
                ) : isPending ? (
                  userRole === 'PARENT' ? (
                    <button
                      onClick={() => handleParentApprove(task.id)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Credit +{formatCurrency(task.rewardAmount, currency)}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 w-full justify-center py-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Submitted! Waiting for {parentName}'s Approval ⏳</span>
                    </span>
                  )
                ) : userRole === 'TEEN' ? (
                  <button
                    onClick={() => handleKidSubmit(task.id)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-black border border-slate-700 flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>I Completed This Task (Request Approval)</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between w-full text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Assigned to {teenName}</span>
                    </span>
                    <button
                      onClick={() => handleParentApprove(task.id)}
                      className="text-emerald-400 font-bold hover:underline"
                    >
                      Quick Direct Credit
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Task Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 max-w-sm w-full shadow-2xl space-y-3 animate-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="text-xs font-bold text-white">Add Chore for {teenName}</h3>
                <p className="text-[10px] text-slate-400">Set task name & cash bounty</p>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Task Name</label>
                <input
                  type="text"
                  placeholder="e.g. Clean bedroom or practice piano"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Bounty Reward ({currency.symbol})</label>
                <input
                  type="number"
                  min={10}
                  step={10}
                  value={newReward}
                  onChange={(e) => setNewReward(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-bold"
                  >
                    <option value="CHORES">Chores</option>
                    <option value="STUDY">Study & Books</option>
                    <option value="FITNESS">Fitness / Sports</option>
                    <option value="RESPONSIBILITY">Responsibility</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Frequency</label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as TaskFrequency)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-bold"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="ONE_TIME">One Time</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-indigo-500 text-slate-950 font-black text-xs rounded-xl active:scale-98 transition-transform flex items-center justify-center gap-1 shadow-md shadow-indigo-500/20 cursor-pointer mt-1"
              >
                <Plus className="w-4 h-4" />
                <span>Save Chore Bounty</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
