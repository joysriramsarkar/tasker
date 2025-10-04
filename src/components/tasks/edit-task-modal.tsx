"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/firebase/auth-context";
import { updateTask } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { formatDuration, parseDuration } from "@/lib/utils";
import type { Task } from "@/types";
import { Calendar } from "@/components/ui/calendar";
import { bn } from "date-fns/locale";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
};

export function EditTaskModal({ isOpen, onClose, task }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState(task.title);
  const [durationStr, setDurationStr] = useState(formatDuration(task.duration));
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDurationStr(formatDuration(task.duration));
    }
  }, [isOpen, task]);

  const handleSave = async () => {
    if (!user) return;
    const finalDuration = parseDuration(durationStr);
    
    try {
        await updateTask(user.uid, task.id, { title, duration: finalDuration });
        toast({ title: "কাজ আপডেট হয়েছে", description: "আপনার পরিবর্তনগুলি সফলভাবে সংরক্ষণ করা হয়েছে।" });
        onClose();
    } catch (error) {
       toast({ variant: "destructive", title: "ত্রুটি", description: " কাজটি আপডেট করতে ব্যর্থ।" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>কাজ সম্পাদনা করুন</DialogTitle>
          <DialogDescription>
            এখানে আপনি আপনার কাজের বিবরণ পরিবর্তন করতে পারেন।
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              শিরোনাম
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              সময়
            </Label>
            <Input
              id="duration"
              value={durationStr}
              onChange={(e) => setDurationStr(e.target.value)}
              className="col-span-3 font-mono"
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              পুনরাবৃত্তি
            </Label>
            <div className="col-span-3">
                <p className="text-sm text-muted-foreground">এই ফিচারটি শীঘ্রই আসছে।</p>
            </div>
           </div>
           <div className="flex justify-center">
             <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                locale={bn}
            />
           </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            বাতিল
          </Button>
          <Button onClick={handleSave}>সংরক্ষণ করুন</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
