export type GoalCategory = 'GAMING' | 'TECH' | 'EXPERIENCE' | 'MUSIC' | 'VEHICLE' | 'EDUCATION' | 'OTHER';

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  category: GoalCategory;
  imageUrl?: string;
  createdAt: string;
  notes?: string;
}

export interface GoalWithProgress extends SavingsGoal {
  currentSaved: number;
  progressPercentage: number;
  projectedMonthToReach: number;
  isAchieved: boolean;
}
