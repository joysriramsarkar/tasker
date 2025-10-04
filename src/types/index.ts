import type { Timestamp } from 'firebase/firestore';

export type Task = {
  id: string;
  title: string;
  createdAt: Timestamp;
  completedAt?: Timestamp;
  duration: number; // in seconds
  status: 'pending' | 'in-progress' | 'completed';
};
