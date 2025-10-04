"use client";

import type { User } from 'firebase/auth';
import { onAuthStateChanged, browserLocalPersistence, initializeAuth, getAuth } from 'firebase/auth';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { app } from './config';

// Initialize auth with browserLocalPersistence to avoid popup issues on page reload.
// But for popups to work correctly, we need to get the auth instance via getAuth().
try {
  initializeAuth(app, {
    persistence: browserLocalPersistence
  });
} catch (e) {
  // Initialization can only happen once.
}

const auth = getAuth(app);

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { auth };
