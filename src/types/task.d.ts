/* eslint-disable @typescript-eslint/no-explicit-any */
export type TaskDifficulty = 'slow' | 'medium' | 'hard';
export type TaskStatus = 'start' | 'pending' | 'progress' | 'failed' | 'completed';

export interface TaskHistoryEntry {
  id: string;
  timestamp: Date;
  action: 'created' | 'updated' | 'status_changed' | 'difficulty_changed' | 'category_changed';
  oldValue?: any;
  newValue?: any;
  field?: string;
}

export interface Indicator {
  id: string;
  name: string;
  color: string;
  type: 'importance' | 'status' | 'category';
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  difficulty: TaskDifficulty;
  status: TaskStatus;
  categoryId?: string; // Reference to category indicator
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  history: TaskHistoryEntry[];
}