import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  displayName: string;
  setDisplayName: (name: string) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayNameState] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        const savedName = localStorage.getItem(`displayName_${user.uid}`);
        setDisplayNameState(savedName || user.displayName || user.email?.split("@")[0] || "User");
      } else {
        setDisplayNameState("");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setDisplayNameState("");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const setDisplayName = (name: string) => {
    if (user) {
      localStorage.setItem(`displayName_${user.uid}`, name);
      setDisplayNameState(name);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        displayName,
        setDisplayName,
        signInWithGoogle,
        signOut,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
