"use client";

import Link from "next/link";
import "./login.scss";
import LoginForm, {
  LoginFormData,
} from "../../components/auth/LoginForm/LoginForm";
import { getCurrentUser, loginUser } from "../../lib/api/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  async function handleLogin(data: LoginFormData) {
    try {
      await loginUser(data);
      const user = await getCurrentUser();
      setUser(user);
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Signup error:", error);
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
