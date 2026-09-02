import React, { useState } from 'react';
import { CheckCircle2, Clock, Plus, Award, Sparkles, Check, X } from 'lucide-react';
import type { ChoreTask, TaskCategory, TaskFrequency } from '../../types/task';
import type { CurrencyConfig } from '../../types/allowance';
import type { AppUserRole } from '../../types/pairing';
import { formatCurrency } from '../../config/currencies';
import { hapticsService } from '../../services/hapticsService';
import { confettiService } from '../../services/confettiService';

interface MobileTasksViewProps {
  tasks: ChoreTask[];
  currency: CurrencyConfig;
  userRole: AppUserRole;
  teenName: string;
  onMarkTaskCompleted: (taskId: string) => void;
  onApproveTask: (taskId: string) => void;
  onAddNewTask: (task: Omit<ChoreTask, 'id' | 'status'>) => void;
}

export const MobileTasksView: React.FC<MobileTasksViewProps> = ({
  tasks,
  currency,
  userRole,
  teenName,
  onMarkTaskCompleted,
  onApproveTask,
  onAddNewTask,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newReward, setNewReward] = useState('50');
  const [newCategory, setNewCategory] = useState<TaskCategory>('CHORES');
  const [newFrequency, setNewFrequency] = useState<TaskFrequency>('DAILY');

  const handleKidComplete = async (taskId: string) => {
    await hapticsService.notifySuccess();
    onMarkTaskCompleted(taskId);
  };

  const handleParentApprove = async (taskId: string) => {
    await hapticsService.impactHeavy();
    confettiService.fireCelebration();
    onApproveTask(taskId);
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
      xpReward: Math.round((Number(newReward) || 50) * 0.5),
      assignedToProfileId: '',
      icon: '⭐',
    });

    setIsAdding(false);
    setNewTitle('');
    setNewReward('50');
  };

  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Chores & Responsibility</h2>
            <p className="text-xs text-slate-400">
              {completedCount} of {tasks.length} bounties claimed
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-indigo-500 text-slate-950 rounded-xl flex items-center gap-1 text-xs font-black active:scale-95 transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>New Task</span>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const isDone = task.status === 'COMPLETED';
          const isPending = task.status === 'PENDING_APPROVAL';

          return (
            <div
              key={task.id}
              className={`p-4 rounded-3xl border transition-all ${
                isDone
                  ? 'bg-emerald-950/25 border-emerald-500/30 opacity-80'
                  : isPending
                  ? 'bg-amber-950/30 border-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/95 border-slate-800 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl mt-0.5">{task.icon || '⭐'}</span>
                  <div>
                    <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                        {task.frequency}
                      </span>
                      <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3" />
                        <span>+{task.xpReward} XP</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black font-mono text-emerald-400 block">
                    +{formatCurrency(task.rewardAmount, currency)}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Vault Bonus</span>
                </div>
              </div>

              {/* Action Buttons depending on role */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {isDone ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bounty Credited to Vault</span>
                  </span>
                ) : isPending ? (
                  userRole === 'PARENT' ? (
                    <button
                      onClick={() => handleParentApprove(task.id)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Credit +{formatCurrency(task.rewardAmount, currency)}</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Waiting for Parent Approval</span>
                    </span>
                  )
                ) : (
                  <button
                    onClick={() => handleKidComplete(task.id)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-black border border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>I Completed This Task!</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Task Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Add Chore for {teenName}</h3>
                <p className="text-xs text-slate-400">Set task bounty & XP reward</p>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Task Name</label>
                <input
                  type="text"
                  placeholder="e.g. Clean bedroom or practice piano"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Bounty Reward ({currency.symbol})</label>
                <input
                  type="number"
                  min={10}
                  step={10}
                  value={newReward}
                  onChange={(e) => setNewReward(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    <option value="CHORES">Chores</option>
                    <option value="STUDY">Study & Books</option>
                    <option value="FITNESS">Fitness / Sports</option>
                    <option value="RESPONSIBILITY">Responsibility</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Frequency</label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as TaskFrequency)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="ONE_TIME">One Time</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-indigo-500 text-slate-950 font-black text-xs rounded-2xl active:scale-98 transition-transform flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer mt-2"
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
