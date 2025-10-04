"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginPage from "./login-page";
import SignUpPage from "./signup-page";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-5xl text-primary">টাস্কার</CardTitle>
          <CardDescription className="pt-2 text-lg">
            আপনার প্রোডাক্টিভিটি বাড়ানোর জন্য একটি আধুনিক টাস্ক ম্যানেজার
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">সাইন ইন</TabsTrigger>
              <TabsTrigger value="signup">সাইন আপ</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-6">
                <LoginPage />
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
                <SignUpPage />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
