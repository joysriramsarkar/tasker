"use client";

import { signInWithGoogle, signInWithFacebook, signInWithEmail } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AppleIcon, FacebookIcon, GoogleIcon, MicrosoftIcon } from "@/components/icons";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "সঠিক ইমেইল লিখুন।" }),
  password: z.string().min(6, { message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }),
});

export default function LoginPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        variant: "destructive",
        title: "সাইন ইন ব্যর্থ হয়েছে",
        description: "গুগল দিয়ে সাইন ইন করার সময় একটি সমস্যা হয়েছে।",
      });
    }
  };
  
  const handleFacebookSignIn = async () => {
    const { error } = await signInWithFacebook();
    if (error) {
      toast({
        variant: "destructive",
        title: "সাইন ইন ব্যর্থ হয়েছে",
        description: "ফেসবুক দিয়ে সাইন ইন করার সময় একটি সমস্যা হয়েছে।",
      });
    }
  };

  const handleEmailSignIn = async (values: z.infer<typeof formSchema>) => {
    const { error } = await signInWithEmail(values.email, values.password);
    if (error) {
       toast({
        variant: "destructive",
        title: "সাইন ইন ব্যর্থ হয়েছে",
        description: error.message === 'Firebase: Error (auth/invalid-credential).' 
          ? "আপনার দেওয়া ইমেইল বা পাসওয়ার্ড সঠিক নয়।"
          : "সাইন ইন করার সময় একটি সমস্যা হয়েছে।",
      });
    }
  }

  const handleNotImplemented = () => {
    toast({
      description: "এই সাইন-ইন পদ্ধতিটি এখনো প্রয়োগ করা হয়নি।",
    });
  }

  return (
    <div className="space-y-6">
       <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEmailSignIn)} className="space-y-4">
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
                  <Input type="password" placeholder="আপনার পাসওয়ার্ড" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
             {form.formState.isSubmitting ? "প্রসেসিং..." : "সাইন ইন করুন"}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">অথবা</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button onClick={handleGoogleSignIn} className="w-full" variant="outline">
            <GoogleIcon className="mr-2 h-5 w-5" />
            গুগল দিয়ে চালিয়ে যান
        </Button>
        <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" onClick={handleNotImplemented} aria-label="Apple দিয়ে সাইন ইন করুন" disabled>
            <AppleIcon className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={handleFacebookSignIn} aria-label="Facebook দিয়ে সাইন ইন করুন">
            <FacebookIcon className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={handleNotImplemented} aria-label="Microsoft দিয়ে সাইন ইন করুন" disabled>
            <MicrosoftIcon className="h-5 w-5" />
            </Button>
        </div>
      </div>
    </div>
  );
}
