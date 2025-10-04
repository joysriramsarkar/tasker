"use client";

import { signUpWithEmail } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(3, { message: "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।" }),
  email: z.string().email({ message: "সঠিক ইমেইল লিখুন।" }),
  password: z.string().min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }),
});

export default function SignUpPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleEmailSignUp = async (values: z.infer<typeof formSchema>) => {
    const { error } = await signUpWithEmail(values.email, values.password, values.name);
    if (error) {
       toast({
        variant: "destructive",
        title: "সাইন আপ ব্যর্থ হয়েছে",
        description: error.message === 'Firebase: Error (auth/email-already-in-use).'
          ? "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে।"
          : "অ্যাকাউন্ট তৈরির সময় একটি সমস্যা হয়েছে।"
      });
    } else {
        toast({
            title: "অ্যাকাউন্ট তৈরি হয়েছে",
            description: "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।",
        })
    }
  }


  return (
    <div className="space-y-6">
       <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEmailSignUp)} className="space-y-4">
           <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>আপনার নাম</FormLabel>
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
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>পাসওয়ার্ড</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="আপনার পাসওয়ার্ড দিন" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
             {form.formState.isSubmitting ? "প্রসেসিং..." : "অ্যাকাউন্ট তৈরি করুন"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
