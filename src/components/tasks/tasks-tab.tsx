"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/types";
import { useAuth } from "@/lib/firebase/auth-context";
import { getTasks } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/loader";
import { Plus } from "lucide-react";
import { TaskItem } from "./task-item";
import { AddTaskForm } from "./add-task-form";

export default function TasksTab() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsubscribe = getTasks(user.uid, ["pending", "in-progress"], (tasks) => {
      setTasks(tasks);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <div className="grid gap-6">
      {showAddTask ? (
        <AddTaskForm onTaskAdded={() => setShowAddTask(false)} />
      ) : (
        <Button variant="outline" className="w-full justify-start p-6 text-muted-foreground" onClick={() => setShowAddTask(true)}>
          <Plus className="mr-2 h-4 w-4" />
          নতুন কাজ যোগ করুন
        </Button>
      )}
      
      <Card>
        <CardHeader>
            <CardTitle>চলমান কাজ</CardTitle>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="flex justify-center py-8"><Loader /></div>
            ) : tasks.length > 0 ? (
                <div className="space-y-4">
                {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
                </div>
            ) : (
                <p className="py-8 text-center text-muted-foreground">কোনো চলমান কাজ নেই।</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
