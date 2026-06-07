import { createContext } from "react";

export type Role = "admin" | "user" | "guest";

export interface AuthContextType {
  token: string | null;
  name: string | null;
  email: string | null;
  role: Role;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => boolean;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
