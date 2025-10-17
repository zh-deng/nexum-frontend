"use client";

import Link from "next/link";
import "./signup.scss";
import SignupForm, {
  SignUpFormData,
} from "../../components/auth/SingupForm/SignupForm";
import { signupUser } from "../../lib/api/auth";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();

  async function handleSignup(data: SignUpFormData) {
    const { repeatPassword, ...payload } = data;

    try {
      await signupUser(payload);
      router.push("/login");
    } catch (error: unknown) {
      console.error("Signup error:", error);
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
