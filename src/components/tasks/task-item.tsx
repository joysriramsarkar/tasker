"use client";

import type { Task } from "@/types";
import { useAuth } from "@/firebase/auth-context";
import { completeTask as completeTaskInDb } from "@/firebase/firestore";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Edit } from "lucide-react";
import { EditTaskModal } from "./edit-task-modal";
import { useToast } from "@/hooks/use-toast";

export function TaskItem({ task }: { task: Task }) {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  
  const handleComplete = async () => {
      if (!user) return;
      const success = await completeTaskInDb(user.uid, task);
      if (success) {
        toast({ title: "কাজ সম্পন্ন হয়েছে!", description: "আপনার কাজটি সফলভাবে সম্পন্ন তালিকায় যোগ করা হয়েছে।" });
      } else {
        toast({ variant: "destructive", title: "ত্রুটি", description: "কাজটি সম্পন্ন করতে ব্যর্থ।" });
      }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4 transition-all hover:shadow-md">
        <div className="flex-1 space-y-1">
            <p className="font-medium">{task.title}</p>
            {task.description && (
                <p className="text-sm text-muted-foreground">{task.description}</p>
            )}
        </div>
        <div className="flex items-center gap-1">
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
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
      />
    </>
  );
}
