import { useState } from "react";
import { profile, skills, projects } from "./data/portfolioData";
import "./App.css";

export default function App() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <div className="portfolio">
      <header className="navbar">
        <a href="#hero" className="logo">AK.</a>
        <nav>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section id="hero" className="hero">
        <span className="pill">MCA Candidate • GLA University, Mathura</span>
        <h1>Hi, I&apos;m {profile.name}</h1>
        <p className="role">{profile.role}</p>
        <p className="summary">{profile.summary}</p>
        <div className="hero-actions">
          <a href="#projects" className="btn-primary">View Projects</a>
          <a href="#contact" className="btn-outline">Contact Me</a>
        </div>
      </section>

      <section id="about" className="section">
        <h2>About &amp; Education</h2>
        <div className="card">
          <h3>{profile.education}</h3>
          <p>{profile.summary}</p>
          <p className="muted">Location: {profile.location}</p>
        </div>
      </section>

      <section id="skills" className="section">
        <h2>Technical Skills</h2>
        <div className="grid">
          {skills.map((group) => (
            <div key={group.category} className="card">
              <h3>{group.category}</h3>
              <div className="tags">
                {group.items.map((item) => (
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="section">
        <h2>Key Projects</h2>
        <div className="grid">
          {projects.map((proj) => (
            <article key={proj.title} className="card">
              <span className="stack-label">{proj.stack}</span>
              <h3>{proj.title}</h3>
              <p>{proj.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section">
        <h2>Get In Touch</h2>
        <form className="card contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            required
          />
          <textarea
            rows="4"
            placeholder="Your Message"
            value={formState.message}
            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
            required
          />
          <button type="submit" className="btn-primary">Send Message</button>
          {sent && <p className="success">Thank you! Your message has been recorded.</p>}
        </form>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} {profile.name} • Built with React</p>
      </footer>
    </div>
  );
}
