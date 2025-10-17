"use client";

import Link from "next/link";
import "./login.scss";
import LoginForm, {
  LoginFormData,
} from "../../components/auth/LoginForm/LoginForm";
import { loginUser } from "../../lib/api/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  async function handleLogin(data: LoginFormData) {
    try {
      await loginUser(data);
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
