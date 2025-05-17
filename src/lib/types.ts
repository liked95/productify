import type { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  email: string;
  role: 'Manager' | 'Contributor' | 'Analyst';
  metrics: MetricData;
  dataAiHint?: string;
}

export interface MetricData {
  tasksCompleted: number;
  avgCompletionTime: string; // e.g., "2h 30m"
  productivityScore: number; // 0-100
  activeProjects: number;
  overdueTasks: number;
}

export interface Widget {
  id: string;
  title: string;
  icon?: LucideIcon;
  metricKey?: keyof MetricData | 'userActivity' | 'projectTimeline'; // To fetch data or display specific content
  data?: any; // Could be a number, string, or more complex object for charts
  colSpan?: number; // For grid layout
  rowSpan?: number; // For grid layout
}

export type UserRole = 'Manager' | 'Contributor' | 'Analyst';

export const AVAILABLE_WIDGETS_LIST: Pick<Widget, 'id' | 'title' | 'icon'>[] = [
  { id: 'tasksCompleted', title: 'Tasks Completed' },
  { id: 'avgCompletionTime', title: 'Avg. Completion Time' },
  { id: 'productivityScore', title: 'Productivity Score' },
  { id: 'activeProjects', title: 'Active Projects' },
  { id: 'overdueTasks', title: 'Overdue Tasks' },
  { id: 'userActivity', title: 'User Activity Chart' },
  { id: 'projectTimeline', title: 'Project Timeline' },
];
