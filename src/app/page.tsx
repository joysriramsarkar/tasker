"use client";

import { useAuth } from "@/lib/firebase/auth-context";
import LoginPage from "@/components/login-page";
import MainApp from "@/components/main-app";
import { Loader } from "@/components/loader";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <MainApp />;
}
