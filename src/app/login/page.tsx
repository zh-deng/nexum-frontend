"use client";

import "./login.scss";
import Link from "next/link";
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
      await loginUser(data);
      setUser(await getCurrentUser());
      router.push("/dashboard");
      toast.success("Login successful");
    } catch (error: unknown) {
      console.error("Signup error:", error);
      toast.error("Login failed");
    }
  }

  return (
    <div className="login-page">
      <div className="form-container">
        <h1>Log In</h1>
        <LoginForm onSubmit={handleLogin} />
        <Link href="/signup">No account? Sign up here!</Link>
      </div>
    </div>
  );
}
