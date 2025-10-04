"use client";

import { BarChart3, Bot, CheckSquare, History, LogOut, User as UserIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/lib/firebase/auth-context';
import { signOutUser } from '@/lib/firebase/auth';

import DashboardTab from './dashboard/dashboard-tab';
import HistoryTab from './history/history-tab';
import ReportTab from './report/report-tab';
import TasksTab from './tasks/tasks-tab';
import ProfileTab from './profile/profile-tab';

export default function MainApp() {
  const { user } = useAuth();

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'User'} />
                <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user?.displayName ?? 'ব্যবহারকারী'}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={signOutUser}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">সাইন আউট</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>সাইন আউট</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-5">
                <TabsTrigger value="dashboard">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  ড্যাশবোর্ড
                </TabsTrigger>
                <TabsTrigger value="tasks">
                  <CheckSquare className="mr-2 h-4 w-4" />
                  কাজসমূহ
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="mr-2 h-4 w-4" />
                  ইতিহাস
                </TabsTrigger>
                 <TabsTrigger value="profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  প্রোফাইল
                </TabsTrigger>
                <TabsTrigger value="report">
                  <Bot className="mr-2 h-4 w-4" />
                  AI রিপোর্ট
                </TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard" className="mt-6">
                <DashboardTab />
              </TabsContent>
              <TabsContent value="tasks" className="mt-6">
                <TasksTab />
              </TabsContent>
              <TabsContent value="history" className="mt-6">
                <HistoryTab />
              </TabsContent>
               <TabsContent value="profile" className="mt-6">
                <ProfileTab />
              </TabsContent>
              <TabsContent value="report" className="mt-6">
                <ReportTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
