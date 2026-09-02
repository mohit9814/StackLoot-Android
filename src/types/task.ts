export type TaskFrequency = 'DAILY' | 'WEEKLY' | 'ONE_TIME';
export type TaskStatus = 'TODO' | 'PENDING_APPROVAL' | 'COMPLETED';
export type TaskCategory = 'STUDY' | 'CHORES' | 'FITNESS' | 'READING' | 'RESPONSIBILITY';

export interface ChoreTask {
  id: string;
  title: string;
  category: TaskCategory;
  frequency: TaskFrequency;
  rewardAmount: number;
  status: TaskStatus;
  assignedToProfileId: string;
  completedAt?: string;
  approvedAt?: string;
  icon?: string;
}

export const DEFAULT_CHORE_TEMPLATES: Omit<ChoreTask, 'id' | 'assignedToProfileId' | 'status'>[] = [
  {
    title: 'Read 20 Mins of a Non-Fiction Book',
    category: 'READING',
    frequency: 'DAILY',
    rewardAmount: 50,
    icon: '📚',
  },
  {
    title: 'Complete Homework Early',
    category: 'STUDY',
    frequency: 'DAILY',
    rewardAmount: 50,
    icon: '📐',
  },
  {
    title: 'Keep Study Desk & Room Organized',
    category: 'CHORES',
    frequency: 'WEEKLY',
    rewardAmount: 100,
    icon: '🧹',
  },
  {
    title: 'Daily 30-Min Workout / Sports Practice',
    category: 'FITNESS',
    frequency: 'DAILY',
    rewardAmount: 50,
    icon: '⚽',
  },
];
