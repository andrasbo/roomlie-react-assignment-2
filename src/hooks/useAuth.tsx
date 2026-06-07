import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "A useAuth hookot csak az AuthProvider-en belül lehet használni!",
    );
  }
  return context;
};
