import { createContext } from "react";

type AuthContextType = {
  user: string | null;
  login: () => void;
  logout: () => void;
  loading?: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
