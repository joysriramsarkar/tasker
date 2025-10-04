"use client";

import type { Task } from "@/types";
import { useAuth } from "@/lib/firebase/auth-context";
import { getTasks } from "@/lib/firebase/firestore";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Loader } from "@/components/loader";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

const chartConfig: ChartConfig = {
  duration: {
    label: "সময় (মিনিট)",
    color: "hsl(var(--primary))",
  },
  pending: {
    label: "অসম্পূর্ণ",
    color: "hsl(var(--chart-2))",
  },
  completed: {
    label: "সম্পন্ন",
    color: "hsl(var(--chart-1))",
  },
};

const COLORS = {
  completed: "hsl(var(--chart-1))",
  pending: "hsl(var(--chart-2))",
  "in-progress": "hsl(var(--chart-4))",
};


export default function DashboardTab() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = getTasks(user.uid, ["pending", "in-progress", "completed"], (tasks) => {
      setTasks(tasks);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const weeklyProductivity = useMemo(() => {
    const data: { date: string; duration: number }[] = [];
    const week = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d;
    }).reverse();

    week.forEach((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const tasksOnDay = tasks.filter(
        (t) => t.status === "completed" && t.completedAt && format(t.completedAt.toDate(), "yyyy-MM-dd") === dayStr
      );
      const totalDuration = tasksOnDay.reduce((acc, t) => acc + t.duration, 0) / 60; // in minutes
      data.push({
        date: format(day, "eee", { locale: bn }),
        duration: Math.round(totalDuration),
      });
    });

    return data;
  }, [tasks]);

  const taskDistribution = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "pending" || t.status === "in-progress").length;
    return [
      { name: "সম্পন্ন", value: completed, fill: COLORS.completed },
      { name: "অসম্পূর্ণ", value: pending, fill: COLORS.pending },
    ];
  }, [tasks]);

  const completionAnalysis = useMemo(() => {
     return taskDistribution;
  }, [taskDistribution]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>সাপ্তাহিক প্রোডাক্টিভিটি</CardTitle>
          <CardDescription>গত ৭ দিনে সম্পন্ন করা কাজের সময়</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={weeklyProductivity}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <Tooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent />} />
                <Bar dataKey="duration" fill="var(--color-duration)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>কাজের অবস্থা</CardTitle>
          <CardDescription>সম্পন্ন বনাম অসম্পূর্ণ কাজের বন্টন</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie data={taskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                   {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
       <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>কাজ সমাপ্তির বিশ্লেষণ</CardTitle>
          <CardDescription>আপনার কাজ শেষ করার হারের একটি চিত্র</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
             <ChartContainer config={chartConfig} className="h-64 w-full max-w-lg">
                <ResponsiveContainer>
                <PieChart>
                    <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                    <Pie
                    data={completionAnalysis}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                    {completionAnalysis.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                    ))}
                    </Pie>
                    <Legend />
                </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
