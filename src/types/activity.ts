export interface ActivityItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'TASK_SUBMITTED' | 'TASK_APPROVED' | 'MONTH_PROGRESSED' | 'PLAN_ACTIVATED' | 'GOAL_CREATED';
  amount?: number;
  profileId: string;
}
