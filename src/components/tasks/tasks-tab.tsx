"use client";

import { useEffect, useState, useMemo } from "react";
import type { Task } from "@/types";
import { useAuth } from "@/firebase/auth-context";
import { getTasksForDateRange } from "@/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/loader";
import { Plus, CheckCircle2, XCircle } from "lucide-react";
import { TaskItem } from "./task-item";
import { AddTaskForm } from "./add-task-form";
import { formatDurationBengali } from "@/lib/utils";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

function YesterdayTaskItem({ task }: { task: Task }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/50 p-4">
      <span className={`flex-1 font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
        {task.title}
      </span>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {task.status === 'completed' ? (
          <>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>সম্পন্ন হয়েছে: {task.completedAt ? format(task.completedAt.toDate(), "p", { locale: bn }) : ''}</span>
            <span className="font-mono font-semibold">{formatDurationBengali(task.duration)}</span>
          </>
        ) : (
          <>
            <XCircle className="h-5 w-5 text-red-500" />
            <span>অসম্পূর্ণ</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function TasksTab() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 1); // Yesterday
    start.setHours(0, 0, 0, 0);

    const end = new Date(today);
    end.setDate(end.getDate() + 1); // Tomorrow
    end.setHours(23, 59, 59, 999);

    const unsubscribe = getTasksForDateRange(user.uid, start, end, (tasks) => {
      setTasks(tasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const { ongoingTasks, tomorrowTasks, yesterdayTasks } = useMemo(() => {
    const today = new Date();
    const todayDateStr = format(today, "yyyy-MM-dd");
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowDateStr = format(tomorrow, "yyyy-MM-dd");
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayDateStr = format(yesterday, "yyyy-MM-dd");
    
    const ongoing: Task[] = [];
    const tomorrowT: Task[] = [];
    const yesterdayT: Task[] = [];

    tasks.forEach(task => {
        const dueDateStr = format(task.dueDate.toDate(), "yyyy-MM-dd");
        if (dueDateStr === todayDateStr && (task.status === 'pending' || task.status === 'in-progress')) {
            ongoing.push(task);
        } else if (dueDateStr === tomorrowDateStr && (task.status === 'pending' || task.status === 'in-progress')) {
            tomorrowT.push(task);
        } else if (dueDateStr === yesterdayDateStr) {
            yesterdayT.push(task);
        }
    });

    return { ongoingTasks: ongoing, tomorrowTasks: tomorrowT, yesterdayTasks: yesterdayT };

  }, [tasks]);


  return (
    <div className="grid gap-8">
      {showAddTask ? (
        <AddTaskForm onTaskAdded={() => setShowAddTask(false)} />
      ) : (
        <Button variant="outline" className="w-full justify-start p-6 text-muted-foreground" onClick={() => setShowAddTask(true)}>
          <Plus className="mr-2 h-4 w-4" />
          নতুন কাজ যোগ করুন
        </Button>
      )}
      
      {loading ? (
          <div className="flex justify-center py-8"><Loader /></div>
      ) : (
        <div className="grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>চলমান কাজ</CardTitle>
                </CardHeader>
                <CardContent>
                    {ongoingTasks.length > 0 ? (
                        <div className="space-y-4">
                        {ongoingTasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                        </div>
                    ) : (
                        <p className="py-8 text-center text-muted-foreground">কোনো চলমান কাজ নেই।</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>আগামীকালের কাজ</CardTitle>
                </CardHeader>
                <CardContent>
                    {tomorrowTasks.length > 0 ? (
                        <div className="space-y-4">
                        {tomorrowTasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                        </div>
                    ) : (
                        <p className="py-8 text-center text-muted-foreground">আগামীকালের জন্য কোনো কাজ নেই।</p>
                    )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>গতকালকের কাজ</CardTitle>
                </CardHeader>
                <CardContent>
                    {yesterdayTasks.length > 0 ? (
                        <div className="space-y-4">
                        {yesterdayTasks.map((task) => (
                            <YesterdayTaskItem key={task.id} task={task} />
                        ))}
                        </div>
                    ) : (
                        <p className="py-8 text-center text-muted-foreground">গতকালকের কোনো কাজ নেই।</p>
                    )}
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
