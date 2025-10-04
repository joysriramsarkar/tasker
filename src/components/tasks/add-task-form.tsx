"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/firebase/auth-context";
import { addTask } from "@/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  title: z.string().min(3, { message: "কাজের শিরোনাম কমপক্ষে ৩ অক্ষরের হতে হবে।" }),
  description: z.string().optional(),
});

export function AddTaskForm({ onTaskAdded }: { onTaskAdded: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    const taskId = await addTask(user.uid, {
        title: values.title,
        description: values.description,
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                   <FormLabel>কাজের শিরোনাম</FormLabel>
                  <FormControl>
                    <Input placeholder="একটি নতুন কাজের শিরোনাম লিখুন..." {...field} className="text-base h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>বিবরণ</FormLabel>
                  <FormControl>
                    <Textarea placeholder="কাজটি সম্পর্কে আনুষঙ্গিক বিষয় লিখুন..." {...field} />
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
