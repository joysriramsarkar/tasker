"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Task } from "@/types";
import { useAuth } from "@/lib/firebase/auth-context";
import { addTask, getTasks, updateTask } from "@/lib/firebase/firestore";
import { formatDuration } from "@/lib/utils";
import { useTimer } from "@/hooks/use-timer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/loader";
import { Play, Pause, Check } from "lucide-react";
import { TimeCaptureModal } from "./time-capture-modal";

const formSchema = z.object({
  title: z.string().min(3, { message: "কাজের শিরোনাম কমপক্ষে ৩ অক্ষরের হতে হবে।" }),
});

function TaskItem({ task }: { task: Task }) {
  const { user } = useAuth();
  const { seconds, status, start, pause } = useTimer(task.duration);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (task.status === 'in-progress' && status !== 'running') {
      start();
    }
  }, [task.status, status, start]);
  
  // Persist duration on pause
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
    setIsModalOpen(true);
  };
  
  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4 transition-all hover:shadow-md">
        <span className="flex-1 font-medium">{task.title}</span>
        <div className="flex items-center gap-2 text-lg font-semibold tabular-nums text-muted-foreground">
          <span>{formatDuration(seconds)}</span>
          <Button variant="ghost" size="icon" onClick={handleTogglePlay}>
            {status === "running" ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="sr-only">{status === "running" ? "Pause" : "Start"}</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600" onClick={handleComplete}>
            <Check className="h-5 w-5" />
            <span className="sr-only">Complete</span>
          </Button>
        </div>
      </div>
      <TimeCaptureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        taskId={task.id}
        initialDuration={seconds}
      />
    </>
  );
}

export default function TasksTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsubscribe = getTasks(user.uid, ["pending", "in-progress"], (tasks) => {
      setTasks(tasks);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    const taskId = await addTask(user.uid, values.title);
    if (taskId) {
      toast({ title: "কাজ যোগ করা হয়েছে", description: values.title });
      form.reset();
    } else {
      toast({ variant: "destructive", title: "ত্রুটি", description: "কাজ যোগ করতে ব্যর্থ।" });
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>নতুন কাজ যোগ করুন</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="যেমন: জিমেইল ইনবক্স শূন্য করুন..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "যোগ হচ্ছে..." : "কাজ যোগ করুন"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>চলমান কাজ</CardTitle>
        </Header>
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
