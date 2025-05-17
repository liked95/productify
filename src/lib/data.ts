import type { User, Widget } from './types';
import { Users, BarChart3, Clock, TrendingUp, Zap, GanttChartSquare, AlertTriangle } from 'lucide-react';

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Alice Wonderland',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait',
    email: 'alice@example.com',
    role: 'Manager',
    metrics: {
      tasksCompleted: 25,
      avgCompletionTime: '1h 45m',
      productivityScore: 88,
      activeProjects: 3,
      overdueTasks: 1,
    },
  },
  {
    id: 'user2',
    name: 'Bob The Builder',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
    email: 'bob@example.com',
    role: 'Contributor',
    metrics: {
      tasksCompleted: 42,
      avgCompletionTime: '2h 10m',
      productivityScore: 92,
      activeProjects: 5,
      overdueTasks: 0,
    },
  },
  {
    id: 'user3',
    name: 'Charlie Brown',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'person outdoor',
    email: 'charlie@example.com',
    role: 'Analyst',
    metrics: {
      tasksCompleted: 15,
      avgCompletionTime: '3h 00m',
      productivityScore: 75,
      activeProjects: 2,
      overdueTasks: 3,
    },
  },
  {
    id: 'user4',
    name: 'Diana Prince',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman superhero',
    email: 'diana@example.com',
    role: 'Manager',
    metrics: {
      tasksCompleted: 30,
      avgCompletionTime: '1h 30m',
      productivityScore: 95,
      activeProjects: 4,
      overdueTasks: 0,
    },
  },
  {
    id: 'user5',
    name: 'Edward Scissorhands',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'man quirky',
    email: 'edward@example.com',
    role: 'Contributor',
    metrics: {
      tasksCompleted: 35,
      avgCompletionTime: '2h 00m',
      productivityScore: 85,
      activeProjects: 3,
      overdueTasks: 2,
    },
  },
];

export const initialWidgets: Widget[] = [
  { 
    id: 'tasksCompleted', 
    title: 'Tasks Completed', 
    icon: Zap, 
    data: 125, // Example data
    colSpan: 1, 
    rowSpan: 1,
    metricKey: 'tasksCompleted'
  },
  { 
    id: 'avgCompletionTime', 
    title: 'Avg. Completion Time', 
    icon: Clock, 
    data: '2h 15m',
    colSpan: 1, 
    rowSpan: 1,
    metricKey: 'avgCompletionTime'
  },
  { 
    id: 'productivityScore', 
    title: 'Productivity Score', 
    icon: TrendingUp, 
    data: 82,
    colSpan: 1, 
    rowSpan: 1,
    metricKey: 'productivityScore'
  },
  { 
    id: 'activeProjects', 
    title: 'Active Projects', 
    icon: Users, 
    data: 5, // Example data for a team or overall
    colSpan: 1, 
    rowSpan: 1,
    metricKey: 'activeProjects'
  },
  { 
    id: 'overdueTasks', 
    title: 'Overdue Tasks', 
    icon: AlertTriangle, 
    data: 3, 
    colSpan: 1, 
    rowSpan: 1,
    metricKey: 'overdueTasks'
  },
  { 
    id: 'userActivity', 
    title: 'User Activity', 
    icon: BarChart3,
    // This would typically be more complex data for a chart
    data: [ 
      { name: 'Mon', value: 20 }, { name: 'Tue', value: 35 }, { name: 'Wed', value: 25 }, 
      { name: 'Thu', value: 40 }, { name: 'Fri', value: 30 }, { name: 'Sat', value: 10 },
      { name: 'Sun', value: 5 }
    ],
    colSpan: 2, 
    rowSpan: 2,
    metricKey: 'userActivity'
  },
];
