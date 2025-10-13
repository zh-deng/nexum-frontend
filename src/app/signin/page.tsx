import Link from "next/link";
import "./signin.scss";

export default function SignInPage() {
  return (
    <main className="signin-page">
      <h1>Sign In</h1>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
      <Link href="/signup">No Account? Sign Up here!</Link>
    </main>
  );
}
