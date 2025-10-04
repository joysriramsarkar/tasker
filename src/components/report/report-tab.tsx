"use client";

import { generateBengaliProductivityReport } from "@/ai/flows/generate-bengali-productivity-report";
import { Bot, Sparkles } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/firebase/auth-context";
import { getTasks } from "@/firebase/firestore";
import type { Task } from "@/types";
import { Loader } from "../loader";

export default function ReportTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [incompleteTasks, setIncompleteTasks] = useState<Task[]>([]);
  const [report, setReport] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = getTasks(user.uid, ["pending", "in-progress"], (tasks) => {
      setIncompleteTasks(tasks);
    });
    return () => unsubscribe();
  }, [user]);

  const handleGenerateReport = () => {
    if (incompleteTasks.length === 0) {
      toast({
        description: "রিপোর্ট তৈরি করার জন্য কোনো অসম্পূর্ণ কাজ নেই।",
      });
      return;
    }

    startTransition(async () => {
      try {
        const taskTitles = incompleteTasks.map((task) => task.title).join(", ");
        const result = await generateBengaliProductivityReport({
          incompleteTasks: taskTitles,
        });
        setReport(result.report);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "রিপোর্ট তৈরিতে ব্যর্থ",
          description: "একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        });
      }
    });
  };

  return (
    <Card className="min-h-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot />
          আপনার ব্যক্তিগত প্রোডাক্টিভিটি রিপোর্ট
        </CardTitle>
        <CardDescription>
          আপনার অসম্পূর্ণ কাজগুলো বিশ্লেষণ করে কৃত্রিম বুদ্ধিমত্তা আপনাকে প্রোডাক্টিভিটি বাড়ানোর জন্য ব্যক্তিগত পরামর্শ দেবে।
        </CardDescription>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none whitespace-pre-wrap rounded-md bg-muted/50 p-6">
        {isPending ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <Loader />
            <p className="text-muted-foreground">আপনার রিপোর্ট তৈরি করা হচ্ছে...</p>
          </div>
        ) : report ? (
          <p>{report}</p>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 text-center text-muted-foreground">
             <Sparkles className="h-12 w-12" />
             <p>আপনার ব্যক্তিগত পরামর্শ পেতে রিপোর্ট তৈরি করুন।</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateReport} disabled={isPending || incompleteTasks.length === 0}>
          {isPending ? "প্রসেসিং..." : "রিপোর্ট তৈরি করুন"}
        </Button>
      </CardFooter>
    </Card>
  );
}
