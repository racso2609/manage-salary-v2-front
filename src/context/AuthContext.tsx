import { useAtom } from "jotai";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { sessionTokenAtom } from "../stores/auth";
import useRefreshToken from "../hooks/auth/useRefreshToken";

type AuthContext = {
  sessionToken: string;
  setSessionToken: (data: string) => void;
  isLogged: boolean;
};
const AuthContext = createContext<AuthContext>({
  sessionToken: "a",
  setSessionToken: () => {},
  isLogged: false,
});

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [sessionToken, setSessionToken] = useAtom(sessionTokenAtom);

  const { handleRefreshToken } = useRefreshToken();

  const isLogged = useMemo(() => {
    return !!sessionToken;
  }, [sessionToken]);

  useEffect(() => {
    if (sessionToken) handleRefreshToken();
  }, [sessionToken]);

  return (
    <AuthContext.Provider value={{ sessionToken, setSessionToken, isLogged }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Auth context outside provider");

  return context;
};

export default AuthProvider;
