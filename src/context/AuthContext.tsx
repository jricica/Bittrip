import { createContext, useContext, ReactNode } from "react";
import { fine } from "@/lib/fine";

interface AuthContextValue {
  user: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending } = fine.auth.useSession();

  return (
    <AuthContext.Provider value={{ user: data?.user ?? null, loading: isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
