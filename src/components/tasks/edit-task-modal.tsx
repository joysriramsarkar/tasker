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
import { useAuth } from "@/firebase/auth-context";
import { updateTask } from "@/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@/types";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
};

export function EditTaskModal({ isOpen, onClose, task }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [recurrence, setRecurrence] = useState(task.recurrence || 'none');
  const [date, setDate] = useState<Date | undefined>(
    task.dueDate ? task.dueDate.toDate() : new Date()
  );

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description || "");
      setRecurrence(task.recurrence || 'none');
      setDate(task.dueDate ? task.dueDate.toDate() : new Date());
    }
  }, [isOpen, task]);

  const handleSave = async () => {
    if (!user || !date) return;
    
    try {
        await updateTask(user.uid, task.id, { 
            title, 
            description,
            recurrence: recurrence as Task['recurrence'],
            dueDate: date,
        });
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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              বিবরণ
            </Label>
             <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="কাজটি সম্পর্কে আনুষঙ্গিক বিষয় লিখুন..."
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recurrence" className="text-right">
              পুনরাবৃত্তি
            </Label>
             <Select value={recurrence} onValueChange={setRecurrence}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="পুনরাবৃত্তির ধরণ নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">কখনই না</SelectItem>
                    <SelectItem value="daily">প্রতিদিন</SelectItem>
                    <SelectItem value="weekly" disabled>সাপ্তাহিক (শীঘ্রই আসছে)</SelectItem>
                    <SelectItem value="monthly" disabled>মাসিক (শীঘ্রই আসছে)</SelectItem>
                </SelectContent>
            </Select>
           </div>
           <div className="grid grid-cols-4 items-center gap-4">
             <Label className="text-right">শেষ তারিখ</Label>
             <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", {locale: bn}) : <span>একটি তারিখ নির্বাচন করুন</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={bn}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
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
