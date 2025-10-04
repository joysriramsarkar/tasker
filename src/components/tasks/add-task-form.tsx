"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/firebase/auth-context";
import { addTask } from "@/firebase/firestore";
import { parseDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(3, { message: "কাজের শিরোনাম কমপক্ষে ৩ অক্ষরের হতে হবে।" }),
  duration: z.string().optional(),
});

export function AddTaskForm({ onTaskAdded }: { onTaskAdded: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", duration: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    const durationInSeconds = values.duration ? parseDuration(values.duration) : 0;
    const taskId = await addTask(user.uid, {
        title: values.title,
        duration: durationInSeconds,
        dueDate: new Date(),
        recurrence: 'none'
    });
    if (taskId) {
      toast({ title: "কাজ যোগ করা হয়েছে", description: values.title });
      form.reset();
      onTaskAdded();
    } else {
      toast({ variant: "destructive", title: "ত্রুটি", description: "কাজ যোগ করতে ব্যর্থ।" });
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="একটি নতুন কাজের শিরোনাম লিখুন..." {...field} className="text-base h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="সময় (HH:MM:SS)" {...field} className="w-40 font-mono h-12 text-base" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting} className="h-12 text-base px-6">
              {form.formState.isSubmitting ? "যোগ হচ্ছে..." : "কাজ যোগ করুন"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
