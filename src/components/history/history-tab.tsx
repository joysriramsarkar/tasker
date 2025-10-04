"use client";

import { useEffect, useState, useMemo } from "react";
import type { Task } from "@/types";
import { useAuth } from "@/firebase/auth-context";
import { getTasks } from "@/firebase/firestore";
import { format, isToday, isYesterday } from "date-fns";
import { bn } from "date-fns/locale";
import { formatDurationBengali } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/loader";

const formatDateGroup = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "আজ";
  if (isYesterday(date)) return "গতকাল";
  return format(date, "d MMMM, yyyy", { locale: bn });
};

export default function HistoryTab() {
  const { user } = useAuth();
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsubscribe = getTasks(user.uid, ["completed"], (tasks) => {
      setCompletedTasks(tasks);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {};
    completedTasks.forEach((task) => {
      if (task.completedAt) {
        const dateStr = format(task.completedAt.toDate(), "yyyy-MM-dd");
        if (!groups[dateStr]) {
          groups[dateStr] = [];
        }
        groups[dateStr].push(task);
      }
    });
    return groups;
  }, [completedTasks]);

  const sortedGroupKeys = useMemo(() => {
    return Object.keys(groupedTasks).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [groupedTasks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>সম্পন্ন কাজের ইতিহাস</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : sortedGroupKeys.length > 0 ? (
          <Accordion type="single" collapsible className="w-full" defaultValue={sortedGroupKeys[0]}>
            {sortedGroupKeys.map((dateStr) => (
              <AccordionItem value={dateStr} key={dateStr}>
                <AccordionTrigger className="text-lg font-semibold">
                  {formatDateGroup(dateStr)}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {groupedTasks[dateStr].map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between rounded-md border bg-muted/50 p-3"
                      >
                        <span>{task.title}</span>
                        <span className="font-mono text-sm font-semibold text-muted-foreground">
                          {formatDurationBengali(task.duration)}
                        </span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="py-8 text-center text-muted-foreground">
            আপনার কোনো সম্পন্ন করা কাজ নেই।
          </p>
        )}
      </CardContent>
    </Card>
  );
}
