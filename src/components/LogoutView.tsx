import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const LogoutView = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (logout()) {
      toast.success("Sikeres kijelentkezés!");
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
