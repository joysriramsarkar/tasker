"use client";

import { useAuth } from "@/firebase/auth-context";
import AuthPage from "@/components/auth-page";
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
    return <AuthPage />;
  }

  return <MainApp />;
}
