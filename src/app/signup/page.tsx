"use client";

import Link from "next/link";
import "./signup.scss";
import SignupForm, {
  SignUpFormData,
} from "../../components/auth/SingupForm/SignupForm";
import { signupUser } from "../../lib/api/auth";
import { useRouter } from "next/navigation";
import { useToast } from "../../components/ToastProvider/ToastProvider";

const SignupPage = () => {
  const router = useRouter();
  const toast = useToast();

  async function handleSignup(data: SignUpFormData) {
    const { repeatPassword, ...payload } = data;

    try {
      await signupUser(payload);
      router.push("/login");
      toast.success("Signup successful! Please log in");
    } catch (error: unknown) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Wrong signup access code");
    }
  }

  return (
    <div className="signup-page">
      <div className="form-container">
        <h1>Sign Up</h1>
        <SignupForm onSubmit={handleSignup} />
        <Link href="/login">You have an account already? Log in!</Link>
      </div>
    </div>
  );
};

export default SignupPage;
