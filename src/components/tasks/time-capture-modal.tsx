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
import { completeTask } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { formatDuration, parseDuration } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  initialDuration: number;
};

export function TimeCaptureModal({ isOpen, onClose, taskId, initialDuration }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [durationStr, setDurationStr] = useState(formatDuration(initialDuration));

  useEffect(() => {
    if (isOpen) {
      setDurationStr(formatDuration(initialDuration));
    }
  }, [isOpen, initialDuration]);

  const handleSave = async () => {
    if (!user) return;
    const finalDuration = parseDuration(durationStr);
    const success = await completeTask(user.uid, taskId, finalDuration);
    if (success) {
      toast({ title: "কাজ সম্পন্ন হয়েছে!", description: "আপনার কাজটি সফলভাবে সম্পন্ন তালিকায় যোগ করা হয়েছে।" });
      onClose();
    } else {
      toast({ variant: "destructive", title: "ত্রুটি", description: "কাজটি সম্পন্ন করতে ব্যর্থ।" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>সময় নিশ্চিত করুন</DialogTitle>
          <DialogDescription>
            এই কাজটি সম্পন্ন করতে আপনার মোট কত সময় লেগেছে? আপনি প্রয়োজনমত সময় সম্পাদনা করতে পারেন।
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            বাতিল
          </Button>
          <Button onClick={handleSave}>সম্পন্ন হিসেবে চিহ্নিত করুন</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
