import Link from "next/link";
import "./signup.scss";

export default function SignInPage() {
  return (
    <main className="signup-page">
      <h1>Sign Up</h1>
      <form>
        <input type="text" placeholder="First Name" required />
        <input type="text" placeholder="Last Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <input type="password" placeholder="Repeat-Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <Link href="/signin">You have an account already? Sign In!</Link>
    </main>
  );
}
