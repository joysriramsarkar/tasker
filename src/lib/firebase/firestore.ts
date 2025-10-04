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
  writeBatch,
} from 'firebase/firestore';
import type { Task } from '@/types';
import { db } from './config';

const getTasksCollectionRef = (userId: string) =>
  collection(db, 'users', userId, 'tasks');

export async function addTask(
  userId: string,
  title: string
): Promise<string | null> {
  try {
    const tasksCollection = getTasksCollectionRef(userId);
    const docRef = await addDoc(tasksCollection, {
      title,
      status: 'pending',
      duration: 0,
      createdAt: serverTimestamp(),
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

export async function updateTask(
  userId: string,
  taskId: string,
  data: Partial<Task>
): Promise<boolean> {
  try {
    const taskDoc = doc(db, 'users', userId, 'tasks', taskId);
    await updateDoc(taskDoc, data);
    return true;
  } catch (error) {
    console.error('Error updating task: ', error);
    return false;
  }
}

export async function completeTask(
  userId: string,
  taskId: string,
  duration: number
): Promise<boolean> {
  try {
    const taskDoc = doc(db, 'users', userId, 'tasks', taskId);
    await updateDoc(taskDoc, {
      status: 'completed',
      duration,
      completedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error completing task: ', error);
    return false;
  }
}
