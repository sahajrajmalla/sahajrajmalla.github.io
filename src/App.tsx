import { useState, useEffect } from 'react';
import './App.css';

// Define types for ProjectCard props
interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  links?: { text: string; url: string }[];
}

const ProjectCard = ({ title, description, image = "", links = [] }: ProjectCardProps) => (
  <div className="project-card">
    {image && <div className="project-image" style={{ backgroundImage: `url(${image})` }} />}
    <h3>{title}</h3>
    <p>{description}</p>
    <div className="project-links">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="project-link"
        >
          {link.text}
        </a>
      ))}
    </div>
  </div>
);

// Define types for AwardCard props
interface AwardCardProps {
  title: string;
  date: string;
  description: string;
}

const AwardCard = ({ title, date, description }: AwardCardProps) => (
  <div className="award-card">
    <div className="award-header">
      <h3>{title}</h3>
      <span className="award-date">{date}</span>
    </div>
    <p>{description}</p>
  </div>
);

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add type for sectionId parameter
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <div className="app">
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="logo" onClick={() => scrollToSection('home')}>SRM</div>
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            {['home', 'about', 'experience', 'projects', 'publications', 'awards', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={activeSection === section ? 'active' : ''}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
            <a href="https://drive.google.com/file/d/18JqVmvVvkbgPykcFJ7qUKOhlDjRAwS1v/view?usp=sharing" download className="cv-button">Download CV</a>
          </div>
        </div>
      </nav>

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Sahaj Raj Malla</h1>
              <h2>Data Scientist | Researcher | Computational Mathematician</h2>
              <p>"Forget passion; science and technology are my religion."</p>
              <div className="social-links">
                <a href="https://github.com/sahajrajmalla" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://linkedin.com/in/sahajrajmalla" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://medium.com/@mallasahajraj" target="_blank" rel="noopener noreferrer">Medium</a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <h2>About Me</h2>
          <div className="about-content">
            <div className="about-text">
              <p>I'm a 22-year-old technologist with a BSc in Computational Mathematics from Kathmandu University, passionate about pushing the boundaries of technology and mathematics.</p>
            </div>
            <div className="skills-grid">
              <div className="skill-category">
                <h3>Mathematics & Theory</h3>
                <ul>
                  <li>Linear Algebra</li>
                  <li>Complex Analysis</li>
                  <li>Computational Complexity</li>
                  <li>Quantum Computing Theory</li>
                </ul>
              </div>
              <div className="skill-category">
                <h3>Programming</h3>
                <ul>
                  <li>Python, C++, TypeScript</li>
                  <li>Django, FastAPI, Next.js</li>
                  <li>TensorFlow, PyTorch</li>
                  <li>Docker, AWS, Azure</li>
                </ul>
              </div>
              <div className="skill-category">
                <h3>Data Science</h3>
                <ul>
                  <li>Machine Learning</li>
                  <li>Natural Language Processing</li>
                  <li>Statistical Analysis</li>
                  <li>Data Visualization</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="experience">
          <h2>Professional Journey</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>Founder & CEO</h3>
                <h4>HamroNiwas</h4>
                <p className="date">2023 - Present</p>
                <p>Leading a revolutionary tech-based rental services platform for university students, combining AI and user-centric design to transform the rental experience. Spearheading the development of innovative solutions for student housing challenges.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>Senior Data Scientist</h3>
                <h4>Naamche Technology</h4>
                <p className="date">2021 - 2023</p>
                <p>Led the implementation of distributed web crawlers and advanced ML algorithms for real estate predictions. Managed complex data pipelines and created interactive visualization dashboards for market analysis.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>Data Engineer</h3>
                <h4>Devfinity Nepal</h4>
                <p className="date">2021</p>
                <p>Engineered robust web applications using Django and Angular. Orchestrated large-scale data processing workflows with Azure services, improving system efficiency by 40%.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="projects">
          <h2>Notable Projects</h2>
          <div className="projects-grid">
            <ProjectCard
              title="GreatAPI Framework"
              description="An open-source Python web framework for simplified full-stack application development."
              links={[{ text: "Documentation", url: "#" }]}
            />
            <ProjectCard
              title="HamroNiwas Platform"
              description="A comprehensive rental service platform for university students."
              links={[{ text: "Visit Site", url: "#" }]}
            />
            <ProjectCard
              title="DistilBERT - Nepali News"
              description="Implemented news classification with 95.475% accuracy using DistilBERT."
              links={[{ text: "HuggingFace", url: "https://huggingface.co/sahajrajmalla/patrakar" }]}
            />
          </div>
        </section>

        <section id="publications" className="publications">
          <h2>Research & Publications</h2>
          <div className="publications-grid">
            <div className="publication-card">
              <h3>Evaluating XGBoost Algorithm for Nepali Stock Price Prediction</h3>
              <p className="pub-date">IEEE Conference, October 2023</p>
              <p>Research focusing on stock market prediction in the Nepali context using advanced ML algorithms.</p>
            </div>
            <div className="publication-card">
              <h3>Getting Started with GreatAPI</h3>
              <p className="pub-date">AWSTip, August 2023</p>
              <p>Comprehensive tutorial on web application development using the GreatAPI framework.</p>
            </div>
          </div>
        </section>

        <section id="awards" className="awards">
          <h2>Awards & Recognition</h2>
          <div className="awards-grid">
            <AwardCard
              title="Winner - KU Hackfest 2023"
              date="October 2023"
              description="Led the development of 'Green Pulse' for environmental impact visualization."
            />
            <AwardCard
              title="Winner - Infinity Codewave"
              date="August 2023"
              description="Developed a metric-based house address hashing system in a 24-hour hackathon."
            />
            <AwardCard
              title="Winner - AI Competition"
              date="August 2022"
              description="Recognized for DistilBERT model development with exceptional accuracy."
            />
          </div>
        </section>

        <section id="contact" className="contact">
          <h2>Let's Connect</h2>
          <div className="contact-content">
            <p>Interested in collaboration or have a project in mind? Let's discuss how we can work together.</p>
            <div className="contact-info">
              <a href="mailto:mallasahajraj@gmail.com" className="contact-card">
                <i className="fas fa-envelope"></i>
                <span>mallasahajraj@gmail.com</span>
              </a>
              <a href="https://scholar.google.com/citations?user=NYVtgiYAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="contact-card">
                <i className="fas fa-graduation-cap"></i>
                <span>Google Scholar</span>
              </a>
              <a href="https://drive.google.com/file/d/18JqVmvVvkbgPykcFJ7qUKOhlDjRAwS1v/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="contact-card">
                <i className="fas fa-file-alt"></i>
                <span>View CV</span>
              </a>
            </div>
          </div>
        </section>

        <footer>
          <div className="footer-content">
            <div className="footer-logo">SRM</div>
            <div className="footer-text">
              <p>Building the future with code and mathematics</p>
              <p className="copyright">&copy; {new Date().getFullYear()} Sahaj Raj Malla. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
