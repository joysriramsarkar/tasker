import type { Unsubscribe } from 'firebase/firestore';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  Timestamp,
} from 'firebase/firestore';
import type { Task } from '@/types';
import { db } from './config';

const getTasksCollectionRef = (userId: string) =>
  collection(db, 'users', userId, 'tasks');

export async function addTask(
  userId: string,
  taskData: { title: string; description?: string, dueDate: Date, recurrence: Task['recurrence'] }
): Promise<string | null> {
  try {
    const tasksCollection = getTasksCollectionRef(userId);
    const docRef = await addDoc(tasksCollection, {
      ...taskData,
      duration: 0,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding task: ', error);
    return null;
  }
}

export function getTasks(
  userId: string,
  status: Task['status'][],
  callback: (tasks: Task[]) => void
): Unsubscribe {
  const tasksCollection = getTasksCollectionRef(userId);
  const q = query(
    tasksCollection,
    where('status', 'in', status),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (querySnapshot) => {
      const tasks = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Task)
      );
      callback(tasks);
    },
    (error) => {
      console.error('Error getting tasks: ', error);
    }
  );
}

export function getTasksForDateRange(
  userId: string,
  startDate: Date,
  endDate: Date,
  callback: (tasks: Task[]) => void
): Unsubscribe {
    const tasksCollection = getTasksCollectionRef(userId);
    const q = query(
        tasksCollection,
        where('dueDate', '>=', Timestamp.fromDate(startDate)),
        where('dueDate', '<=', Timestamp.fromDate(endDate)),
        orderBy('dueDate', 'asc')
    );

    return onSnapshot(
        q,
        (querySnapshot) => {
            const tasks = querySnapshot.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() } as Task)
            );
            callback(tasks);
        },
        (error) => {
            console.error('Error getting tasks for date range: ', error);
        }
    );
}

export async function updateTask(
  userId: string,
  taskId: string,
  data: Partial<Omit<Task, 'id' | 'createdAt'>>
): Promise<boolean> {
  try {
    const taskDoc = doc(db, 'users', userId, 'tasks', taskId);
    await updateDoc(taskDoc, {
        ...data,
        updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating task: ', error);
    return false;
  }
}

export async function completeTask(
  userId: string,
  task: Task,
  duration: number
): Promise<boolean> {
  try {
    const taskDoc = doc(db, 'users', userId, 'tasks', task.id);
    await updateDoc(taskDoc, {
      status: 'completed',
      duration,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    if (task.recurrence === 'daily') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0,0,0,0); // Start of day
        await addTask(userId, {
            title: task.title,
            description: task.description,
            dueDate: tomorrow,
            recurrence: task.recurrence, // This was missing!
        });
    }
    // TODO: Add logic for weekly and monthly recurrence

    return true;
  } catch (error) {
    console.error('Error completing task: ', error);
    return false;
  }
}
