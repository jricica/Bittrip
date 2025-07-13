import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { fine } from "@/lib/fine";

interface AuthContextValue {
  user: any | null;
  loading: boolean;
  setUser: (user: any | null) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending } = fine.auth.useSession();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending) {
      setUser(data?.user ?? null);
      setLoading(false);
    }
  }, [data, isPending]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
