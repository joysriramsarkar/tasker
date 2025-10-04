import type { Timestamp } from 'firebase/firestore';

export type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
  dueDate: Timestamp;
  duration: number; // in seconds
  status: 'pending' | 'in-progress' | 'completed';
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
};
