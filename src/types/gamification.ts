export type BadgeId =
  | 'FIRST_DEPOSIT'
  | 'STREAK_3_MONTHS'
  | 'STREAK_6_MONTHS'
  | 'HALF_GOAL_REACHED'
  | 'GOAL_ACHIEVED'
  | 'SNOWBALL_MASTER'
  | 'GRADUATION_CHAMPION';

export interface GamificationBadge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  xpReward: number;
}

export interface UserGamificationState {
  currentLevel: number;
  totalXp: number;
  unlockedBadgeIds: BadgeId[];
  streakMonths: number;
}
