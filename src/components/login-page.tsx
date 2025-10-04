"use client";

import { signInWithGoogle } from "@/lib/firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppleIcon, FacebookIcon, GoogleIcon, MicrosoftIcon } from "@/components/icons";

export default function LoginPage() {
  const { toast } = useToast();

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

  const handleNotImplemented = () => {
    toast({
      description: "এই সাইন-ইন পদ্ধতিটি এখনো প্রয়োগ করা হয়নি।",
    });
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-5xl text-primary">টাস্কার</CardTitle>
          <CardDescription className="pt-2 text-lg">
            আপনার প্রোডাক্টিভিটি বাড়ানোর জন্য একটি আধুনিক টাস্ক ম্যানেজার
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={handleGoogleSignIn} className="w-full" size="lg">
            <GoogleIcon className="mr-2 h-5 w-5" />
            গুগল দিয়ে সাইন ইন করুন
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">অথবা</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
             <Button variant="outline" onClick={handleNotImplemented} aria-label="Apple দিয়ে সাইন ইন করুন" disabled>
                <AppleIcon className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={handleNotImplemented} aria-label="Facebook দিয়ে সাইন ইন করুন" disabled>
                <FacebookIcon className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={handleNotImplemented} aria-label="Microsoft দিয়ে সাইন ইন করুন" disabled>
                <MicrosoftIcon className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
