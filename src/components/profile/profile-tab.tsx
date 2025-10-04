"use client";

import { useAuth } from "@/firebase/auth-context";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const formSchema = z.object({
  name: z.string().min(3, { message: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।" }),
  email: z.string().email(),
});

export default function ProfileTab() {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    try {
      await updateProfile(user, { displayName: values.name });
      toast({
        title: "প্রোফাইল আপডেট হয়েছে",
        description: "আপনার তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।",
      });
      // This will trigger a re-render in the main layout to show the new name
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast({
        variant: "destructive",
        title: "ত্রুটি",
        description: "প্রোফাইল আপডেট করার সময় একটি সমস্যা হয়েছে।",
      });
    }
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>আপনার প্রোফাইল</CardTitle>
        <CardDescription>এখানে আপনার ব্যক্তিগত তথ্য দেখতে এবং সম্পাদনা করতে পারেন।</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
             <Avatar className="h-20 w-20">
                <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'User'} />
                <AvatarFallback className="text-3xl">{getInitials(user?.displayName)}</AvatarFallback>
              </Avatar>
            <div>
                <h2 className="text-2xl font-bold">{user?.displayName}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
            </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>পুরো নাম</FormLabel>
                  <FormControl>
                    <Input placeholder="আপনার পুরো নাম" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ইমেইল</FormLabel>
                  <FormControl>
                    <Input placeholder="আপনার ইমেইল" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
