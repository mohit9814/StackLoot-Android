import { Preferences } from '@capacitor/preferences';
import type { ChoreTask } from '../types/task';
import { DEFAULT_CHORE_TEMPLATES } from '../types/task';

const STORAGE_KEY_TASKS = 'stackloot_tasks_v1';

export const taskService = {
  async getTasksForProfile(profileId: string): Promise<ChoreTask[]> {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY_TASKS });
      let allTasks: ChoreTask[] = [];
      if (value) {
        allTasks = JSON.parse(value);
      } else {
        const local = localStorage.getItem(STORAGE_KEY_TASKS);
        if (local) allTasks = JSON.parse(local);
      }

      const profileTasks = allTasks.filter((t) => t.assignedToProfileId === profileId);
      if (profileTasks.length > 0) return profileTasks;

      // Seed default chores for new profile
      const seeded: ChoreTask[] = DEFAULT_CHORE_TEMPLATES.map((tmpl, idx) => ({
        ...tmpl,
        id: `task-${profileId}-${idx}-${Date.now()}`,
        assignedToProfileId: profileId,
        status: 'TODO',
      }));

      await this.saveTasks([...allTasks, ...seeded]);
      return seeded;
    } catch {
      return [];
    }
  },

  async saveTasks(tasks: ChoreTask[]): Promise<void> {
    try {
      const json = JSON.stringify(tasks);
      await Preferences.set({ key: STORAGE_KEY_TASKS, value: json });
      localStorage.setItem(STORAGE_KEY_TASKS, json);
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  },

  async markTaskCompleted(taskId: string): Promise<ChoreTask[]> {
    const { value } = await Preferences.get({ key: STORAGE_KEY_TASKS });
    const tasks: ChoreTask[] = value ? JSON.parse(value) : [];
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, status: 'PENDING_APPROVAL' as const, completedAt: new Date().toISOString() } : t
    );
    await this.saveTasks(updated);
    return updated;
  },

  async approveTask(taskId: string): Promise<ChoreTask[]> {
    const { value } = await Preferences.get({ key: STORAGE_KEY_TASKS });
    const tasks: ChoreTask[] = value ? JSON.parse(value) : [];
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, status: 'COMPLETED' as const, approvedAt: new Date().toISOString() } : t
    );
    await this.saveTasks(updated);
    return updated;
  },
};
