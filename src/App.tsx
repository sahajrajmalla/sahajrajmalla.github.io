import { useState, useEffect } from 'react';
import './App.css';
import React from 'react';

// Define types for ProjectCard props
interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  links?: { text: string; url: string }[];
}

const ProjectCard = React.memo(({ title, description, image = "", links = [] }: ProjectCardProps) => (
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
          style={{ color: 'green', textDecoration: 'underline' }}
        >
          {link.text}
        </a>
      ))}
    </div>
  </div>
));

// Define types for AwardCard props
interface AwardCardProps {
  title: string;
  date: string;
  description: string;
}

const AwardCard = React.memo(({ title, date, description }: AwardCardProps) => (
  <div className="award-card">
    <div className="award-header">
      <h3>{title}</h3>
      <span className="award-date">{date}</span>
    </div>
    <p>{description}</p>
  </div>
));

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      // Update scrolled state for navbar styling
      setIsScrolled(window.scrollY > 50);

      // Determine which section is in view
      const sections = ['home', 'about', 'experience', 'volunteer', 'projects', 'publications', 'awards', 'contact'];
      let currentSection = activeSection;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if the section is roughly centered in the viewport
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = section;
          }
        }
      });

      // Update activeSection only if it changes
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]); // Dependency on activeSection to keep the effect in sync

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <div className="app">
      <head>
        <title>Sahaj Raj Malla</title>
        <meta name="description" content="Portfolio of Sahaj Raj Malla, a data/research scientist and computational mathematician." />
        <meta name="keywords" content="Sahaj Raj Malla, Data Scientist, Research Scientist, Computational Mathematics, Quantum Computing, Machine Learning" />
      </head>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="logo" onClick={() => scrollToSection('home')}>SRM</div>
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            {['home', 'about', 'experience', 'volunteer', 'projects', 'publications', 'awards', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={activeSection === section ? 'active' : ''}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
            <a href="https://drive.google.com/file/d/1URSBZ4jtnmCpzMLj4E8F0Oh8vHjT0FhR/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="cv-button">Download CV</a>
          </div>
        </div>
      </nav>

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Sahaj Raj Malla</h1>
              <h2>Technopreneur/ Research Scientist</h2>
              <p>"Forget passion; science and technology are my religion."</p>
              <p><strong>Life Goal:</strong> To solve the P vs NP problem.</p>
              <div className="social-links">
                <a href="https://github.com/sahajrajmalla" target="_blank" rel="noopener noreferrer">
                   <span>GitHub</span>
                </a>
                <a href="https://linkedin.com/in/sahajrajmalla" target="_blank" rel="noopener noreferrer">
                   <span>LinkedIn</span>
                </a>
                <a href="https://scholar.google.com/citations?user=NYVtgiYAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
                   <span>Google Scholar</span>
                </a>
                <a href="https://www.researchgate.net/profile/Sahaj-Raj-Malla" target="_blank" rel="noopener noreferrer">
                 <span>ResearchGate</span>
                </a>
              </div>

              
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <h2>About Me</h2>
          <div className="about-content">
            <div className="about-text">
              <p>Greetings, I’m a 23-year old data/research scientist about to build production-ready machine learning products and is obsessed with software, maths, and quantum computing, and I want to devote my life to this field by researching, developing, and publishing my own software, algorithms, and theories so that I can look back on my life and say, "Yes, I did it my way."</p>
            </div>
            <br></br>
            <br></br>
            <div className="skills-grid">
              <div className="skill-category">
                <h3>Mathematics</h3>
                <ul>
                  <li>Linear Algebra</li>
                  <li>Complex Number</li>
                  <li>Calculus</li>
                  <li>Statistics</li>
                  <li>Probability</li>
                </ul>
              </div>
              <div className="skill-category">
                <h3>Quantum Computing</h3>
                <ul>
                  <li>Qiskit</li>
                  <li>Pennylane</li>
                </ul>
              </div>
              <div className="skill-category">
                <h3>Frontend</h3>
                <ul>
                  <li>TypeScript</li>
                  <li>Next.js</li>
                </ul>
              </div>
              <div className="skill-category">
                <h3>Backend</h3>
                <ul>
                  <li>Python</li>
                  <li>C++</li>
                  <li>pybind11</li>
                  <li>GreatAPI</li>
                  <li>Django</li>
                  <li>FastAPI</li>
                  <li>Database</li>
                </ul>
              </div>
              <div className="skill-category">
                <h3>Data Science</h3>
                <ul>
                  <li>TensorFlow</li>
                  <li>PyTorch</li>
                  <li>Airflow</li>
                  <li>Streamlit</li>
                  <li>Scraping</li>
                </ul>
              </div>
              <div className="skill-category">
                <h3>DevOps</h3>
                <ul>
                  <li>Docker</li>
                  <li>Traefik</li>
                </ul>
              </div>
              <div className="skill-category">
                <h3>Cloud</h3>
                <ul>
                  <li>AWS</li>
                  <li>Azure</li>
                  <li>Localstack</li>
                  <li>CPanel</li>
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
                <h3>Founder</h3>
                <h4>HomroNiwas - Tech-based Rental Services</h4>
                <p className="date">Nov 2023 - Present</p>
                <p>Leading a platform connecting 2500+ students with accommodation solutions, reducing search time by 90%.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>Data Scientist</h3>
                <h4>Noamche Technology</h4>
                <p className="date">Sep 2021 - Jan 2023</p>
                <p>Scraped 1M+ real estate listings, improving investment decision accuracy by 40+% and reducing computation time by 200+%.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>Data Engineer</h3>
                <h4>Devfinity Nepal</h4>
                <p className="date">Mar 2021 - Sep 2021</p>
                <p>Built a Django-based data factory processing 1M+ job data daily, deployed on Azure.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>Founder</h3>
                <h4>vyesna.com</h4>
                <p className="date">Apr 2020 - Mar 2021</p>
                <p>Developed a Django/React job platform with a scraped-data recommender system.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="volunteer" className="volunteer">
          <h2>Volunteer Works</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>Teaching Assistant</h3>
                <h4>NAAMII - AI School</h4>
                <p className="date">Dec 2024 - Jan 2025</p>
                <p>Assisted in teaching AI concepts at Nepal's research lab for AI and informatics.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>Website Manager</h3>
                <h4>Kathmandu University Robotics Club</h4>
                <p className="date">May 2023 - May 2024</p>
                <p>Managed the club's website, enhancing robotics education outreach.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>Lead Quantum Computing Researcher</h3>
                <h4>OneQuantum</h4>
                <p className="date">Mar 2021 - Mar 2023</p>
                <p>Contributed to quantum tech research and community growth.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>Data Scientist / Software Developer</h3>
                <h4>Robotics Association of Nepal</h4>
                <p className="date">Mar 2021 - Mar 2022</p>
                <p>Developed solutions bridging humans and machines during the COVID-19 response.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="projects">
          <h2>Notable Projects</h2>
          <div className="projects-grid">
            <ProjectCard
              title="GreatAPI"
              description="Open-sourced Python web framework for full-stack development."
              links={[{ text: "GitHub", url: "https://github.com/sahajrajmalla/greatapi" }]}
            />
            <ProjectCard
              title="Solving Human Trafficking on a Quantum Computer"
              description="Applied QAOA and Max-Cut to optimize node configurations."
              links={[{ text: "Details", url: "#" }]} // Replace with actual link if available
            />
            <ProjectCard
              title="DistilBERT - Nepali News Classification"
              description="Achieved 95.475% accuracy classifying Nepali news with DistilBERT."
              links={[{ text: "HuggingFace", url: "https://huggingface.co/sahajrajmalla/patrakar" }]}
            />
            <ProjectCard
              title="Mission Oxygen Web Portal"
              description="Facilitated COVID-19 resource access during the pandemic."
              links={[{ text: "Website", url: "#" }]} // Replace with actual link if available
            />
            <ProjectCard
              title="chayorooms.com"
              description="Short-term room rental service platform in Nepal."
              links={[{ text: "Website", url: "#" }]} // Replace with actual link if available
            />
            <ProjectCard
              title="CO2 Calculator API"
              description="API to measure carbon footprints from event emissions."
              links={[{ text: "Details", url: "#" }]} // Replace with actual link if available
            />
          </div>
        </section>

        <section id="publications" className="publications">
          <h2>Research & Publications</h2>
          <div className="publications-grid">
            <div className="publication-card">
              <h3>A landmark-based addressing framework for urban navigation</h3>
              <p className="pub-date">KUSET, Mar 2025</p>
              <p>Framework integrating landmarks with geospatial tech, reducing path length by 37.7%.</p>
            </div>
            <div className="publication-card">
              <h3>Evaluating XGBoost for Nepali Stock Price Prediction</h3>
              <p className="pub-date">IEEE, Oct 2023</p>
              <p>Presented at an international conference on tech advancements.</p>
            </div>
            <div className="publication-card">
              <h3>Getting Started with GreatAPI: A Comprehensive Tutorial</h3>
              <p className="pub-date">AWSTip, Aug 2023</p>
              <p>Tutorial on rapid web app development with GreatAPI.</p>
            </div>
          </div>
        </section>

        <section id="awards" className="awards">
          <h2>Awards & Honors</h2>
          <div className="awards-grid">
            <AwardCard
              title="Seeds for the Future Nepal"
              date="Sep 2023"
              description="Winner, Huawei Technologies Co., Ltd."
            />
            <AwardCard
              title="Computer Engineering Model Demonstration"
              date="Dec 2024"
              description="Winner, KEC LITE 2081, Kontipur Engineering College"
            />
            <AwardCard
              title="KU Hackfest 2023 - OSM Category"
              date="Oct 2023"
              description="Winner, Kathmandu University Computer Club"
            />
            <AwardCard
              title="Infinity Codewave"
              date="Aug 2023"
              description="Winner, Department of Mathematics, Kathmandu University"
            />
            <AwardCard
              title="AI Competition - Text Challenge"
              date="Aug 2022"
              description="Winner, IT MEET 2022, Kathmandu University"
            />
            <AwardCard
              title="AI Competition - Data Visualization"
              date="Aug 2022"
              description="Winner, IT MEET 2022, Kathmandu University"
            />
            <AwardCard
              title="Youth Innovation Challenge"
              date="Aug 2022"
              description="Winner, Social Changemakers and Innovators"
            />
            <AwardCard
              title="50+ Online Course Certifications"
              date="Ongoing"
              description="Coursera, Udemy, DataCamp, Udacity, etc."
            />
          </div>
        </section>

        <section id="contact" className="contact">
          <h2>Let's Connect</h2>
          <div className="contact-content">
            <p>Interested in collaboration or discussing a project? Reach out to me!</p>
            <div className="contact-info">
              <a href="mailto:mallasahajraj@gmail.com" className="contact-card">
               <span>mallasahajraj@gmail.com</span>
              </a>
              <a href="https://www.instagram.com/sahajrajmalla/" target="_blank" rel="noopener noreferrer" className="contact-card">
                 <span>Instagram</span>
              </a>
              <a href="https://www.facebook.com/sahajrajmalla" target="_blank" rel="noopener noreferrer" className="contact-card">
                <span>Facebook</span>
              </a>
              <a href="https://medium.com/@mallasahajraj" target="_blank" rel="noopener noreferrer" className="contact-card">
                <span>Medium</span>
              </a>
            </div>
          </div>
        </section>

        <footer>
          <div className="footer-content">
            <div className="footer-logo">SRM</div>
            <div className="footer-text">
              <p>Advancing science and technology through code and research</p>
              <p className="copyright">© {new Date().getFullYear()} Sahaj Raj Malla. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}