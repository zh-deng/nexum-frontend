"use client";

import "./login.scss";
import LoginForm, {
  LoginFormData,
} from "../../components/auth/LoginForm/LoginForm";
import { getCurrentUser, loginUser } from "../../lib/api/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const { setUser } = useAuth();

  async function handleLogin(data: LoginFormData) {
    try {
      // Perform login (sets auth cookie server-side)
      await loginUser(data);
      // Fetch the full user profile to populate username immediately
      const fullUser = await getCurrentUser();
      setUser(fullUser);
      // Navigate straight to jobs to avoid middleware timing
      router.replace("/dashboard/jobs");
      toast.success("Login successful");
    } catch (error: unknown) {
      console.error("Signin error:", error);
      toast.error("Login failed");
    }
  }

  return (
    <div className="login-page">
      <div className="form-container">
        <h1>Log In</h1>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
}
