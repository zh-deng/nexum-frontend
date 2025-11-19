import Link from "next/link";
import "./homePage.scss";
import Footer from "../components/Footer/Footer";

const HomePage = () => {
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Track your applications, land your next job.
          </h1>
          <p className="hero-sub">
            A lightweight, beautiful tracker for your job search. Organize
            applications, interviews, and reminders in one place.
          </p>
          <div className="hero-ctas">
            <Link href="/signup" className="btn primary">
              Get Started — It&apos;s free
            </Link>
            <Link href="/login" className="btn ghost">
              View Demo
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden>
          <div className="mock-dashboard">
            <div className="md-row">
              <div className="card small" />
              <div className="card large" />
            </div>
            <div className="md-row">
              <div className="card medium" />
              <div className="card small" />
              <div className="card medium" />
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Designed for job seekers</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>All-in-one tracker</h3>
            <p>
              Manage companies, positions, interviews, and follow-ups in a
              single view.
            </p>
          </div>
          <div className="feature">
            <h3>Reminders & calendar</h3>
            <p>
              Never miss an interview, set reminders and sync with your
              calendar.
            </p>
          </div>
          <div className="feature">
            <h3>Insights & progress</h3>
            <p>
              See where you stand with simple analytics and kanban-style
              tracking.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-inner">
          <h3>Ready to get organized?</h3>
          <Link href="/signup" className="btn primary large">
            Create your account
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default HomePage;
