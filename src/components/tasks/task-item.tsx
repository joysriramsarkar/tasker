"use client";

import type { Task } from "@/types";
import { useAuth } from "@/lib/firebase/auth-context";
import { useTimer } from "@/hooks/use-timer";
import { updateTask } from "@/lib/firebase/firestore";
import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play, Pause, Check, Edit } from "lucide-react";
import { TimeCaptureModal } from "./time-capture-modal";
import { EditTaskModal } from "./edit-task-modal";

export function TaskItem({ task }: { task: Task }) {
  const { user } = useAuth();
  const { seconds, status, start, pause, setSeconds } = useTimer(task.duration);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  useEffect(() => {
    setSeconds(task.duration);
  }, [task.duration, setSeconds]);

  useEffect(() => {
    if (task.status === 'in-progress' && status !== 'running') {
      start();
    }
  }, [task.status, status, start]);
  
  useEffect(() => {
    const persistDuration = async () => {
      if (status === 'paused' && user && seconds !== task.duration) {
        await updateTask(user.uid, task.id, { duration: seconds });
      }
    };
    persistDuration();
  }, [status, seconds, task.id, task.duration, user]);

  const handleTogglePlay = async () => {
    if (!user) return;
    if (status === "running") {
      pause();
      await updateTask(user.uid, task.id, { status: "pending", duration: seconds });
    } else {
      start();
      await updateTask(user.uid, task.id, { status: "in-progress" });
    }
  };

  const handleComplete = () => {
    pause();
    setIsCompleteModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4 transition-all hover:shadow-md">
        <span className="flex-1 font-medium">{task.title}</span>
        <div className="flex items-center gap-1 text-lg font-semibold tabular-nums text-muted-foreground">
          <span>{formatDuration(seconds)}</span>
          <Button variant="ghost" size="icon" onClick={handleTogglePlay}>
            {status === "running" ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="sr-only">{status === "running" ? "Pause" : "Start"}</span>
          </Button>
           <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-5 w-5" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600" onClick={handleComplete}>
            <Check className="h-5 w-5" />
            <span className="sr-only">Complete</span>
          </Button>
        </div>
      </div>
      <TimeCaptureModal 
        isOpen={isCompleteModalOpen} 
        onClose={() => setIsCompleteModalOpen(false)}
        taskId={task.id}
        initialDuration={seconds}
      />
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
      />
    </>
  );
}
