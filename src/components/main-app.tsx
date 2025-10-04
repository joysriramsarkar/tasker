"use client";

import { BarChart3, Bot, Calendar, CheckSquare, History, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/firebase/auth-context';
import { signOutUser } from '@/firebase/auth';
import { useState } from 'react';

import DashboardTab from './dashboard/dashboard-tab';
import HistoryTab from './history/history-tab';
import ReportTab from './report/report-tab';
import TasksTab from './tasks/tasks-tab';
import ProfileTab from './profile/profile-tab';
import CalendarTab from './calendar/calendar-tab';

export default function MainApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [showProfile, setShowProfile] = useState(false);

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  const handleTabChange = (value: string) => {
    if (value === 'profile') {
      setShowProfile(true);
      // Keep the visual indicator on the last active non-profile tab
    } else {
      setShowProfile(false);
      setActiveTab(value);
    }
  };
  
  const handleProfileClick = () => {
    setShowProfile(true);
    // When profile is opened via dropdown, we don't want to change the main active tab indicator
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-primary">
                 <CheckSquare className="h-8 w-8" />
                 <h1 className="font-headline text-2xl font-bold">টাস্কার</h1>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-3 rounded-full p-1 transition-colors hover:bg-muted">
                <Avatar>
                  <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'User'} />
                  <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                </Avatar>
                 <div>
                    <p className="font-semibold">{user?.displayName ?? 'ব্যবহারকারী'}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>আমার অ্যাকাউন্ট</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowProfile(true)}>
                প্রোফাইল
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOutUser}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>সাইন আউট</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
           {showProfile ? (
            <ProfileTab />
          ) : (
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                <TabsTrigger value="calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  ক্যালেন্ডার
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
              <TabsContent value="calendar" className="mt-6">
                 <CalendarTab />
              </TabsContent>
              <TabsContent value="report" className="mt-6">
                <ReportTab />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}
