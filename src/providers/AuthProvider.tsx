import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type Role } from "../contexts/AuthContext";
import { NEPTUN_CODE } from "../hooks/useTableApi";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("guest");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedname = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedname) {
      setName(storedname);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedRole) {
      setRole(storedRole as Role);
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        " https://roomlie-api.gkrisz.space/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Neptun-Code": NEPTUN_CODE,
          },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!response.ok) {
        throw new Error(`Hiba történt: ${response.status}`);
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("role", data.user.role);

      setToken(data.token);
      setName(data.user.name);
      setEmail(data.user.email);
      setRole(data.user.role);
    } catch (err) {
      console.error("Bejelentkezési hiba:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    setToken(null);
    setName(null);
    setEmail(null);
    setRole("guest");

    return true;
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        " https://roomlie-api.gkrisz.space/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Neptun-Code": NEPTUN_CODE,
          },
          body: JSON.stringify({ name, email, password }),
        },
      );
      if (!response.ok) {
        throw new Error(`Hiba történt: ${response.status}`);
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("role", data.user.role);

      setToken(data.token);
      setName(data.user.name);
      setEmail(data.user.email);
      setRole(data.user.role);
    } catch (err) {
      console.error("Regisztrációs hiba:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        name,
        email,
        role,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
