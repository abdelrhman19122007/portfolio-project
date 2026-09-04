import React, { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Code2,
  BrainCircuit,
  TerminalSquare,
  Github,
  Linkedin,
  Mail,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* Design tokens — kept as JS constants since arbitrary Tailwind values    */
/* aren't compiled in this environment. Applied via inline style.         */
/* ---------------------------------------------------------------------- */
const COLORS = {
  bg: "#0B0B0F",
  purple: "#7C3AED",
  purpleSoft: "rgba(124, 58, 237, 0.2)",
  purpleGlow: "rgba(124, 58, 237, 0.35)",
  electric: "#8B5CF6",
  white: "#FFFFFF",
  grey: "#9CA3AF",
  cardBg: "rgba(255, 255, 255, 0.03)",
};

const FOCUS_RING = `0 0 0 3px ${COLORS.purpleGlow}`;
const DISPLAY_FONT = "'Space Grotesk', ui-sans-serif, system-ui, sans-serif";

/* ---------------------------------------------------------------------- */
/* Centralized config — the only place URLs/assets need to be updated.    */
/* ---------------------------------------------------------------------- */
const LINKS = {
  github: "https://github.com/abdelrhman19122007",
  linkedin: "https://www.linkedin.com/in/abdelrhman-naeem-469341415/",
  email: "mailto:abdelrhman19122007@gamil.com",
  cv: "https://drive.google.com/file/d/1I4_QAQlLh74XzPr84M9EqT8YtzpNRH5Y/view?usp=sharing",
};

// Local project asset — drop the real photo in `public/images/profile.png`
// (or update this path to match whatever filename/extension is used).
const PROFILE_IMAGE_SRC = "/images/profile.png";

// New transparent logo — place `logo-an.png` inside `public/images/`
const LOGO_SRC = "/images/logo-an.png";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const SKILLS = [
  {
    icon: ShieldCheck,
    title: "Software Testing & QA",
    items: [
      "Test Case Design",
      "Bug Reporting",
      "Functional & Regression Testing",
      "Software Quality Concepts",
    ],
  },
  {
    icon: Code2,
    title: "Core Programming",
    items: [
      "C++",
      "Java",
      "Python",
      "OOP Architecture",
      "Data Structures",
      "Memory Management",
    ],
  },
  {
    icon: BrainCircuit,
    title: "Data Science & AI",
    items: ["Pandas", "NumPy", "Data Visualization", "Machine Learning Fundamentals"],
  },
  {
    icon: TerminalSquare,
    title: "Environment & Tools",
    items: ["Linux Mint", "Git & GitHub Workflow", "Qt Creator", "Kivy"],
  },
];

const PROJECTS = [
  {
    title: "Numerical Analysis Engine",
    tags: ["C++", "Qt", "Math"],
    description:
      "Root-finding algorithms and linear algebra solvers wrapped in a dark-themed desktop GUI, from Bisection and Newton-Raphson to Doolittle LU decomposition.",
    href:"https://github.com/abdelrhman19122007/numerical-analysis-engine",
},
  
  {
    title: "Probability Simulation System",
    tags: ["Python", "Kivy", "Math"],
    description:
      "A desktop graphical interface for testing probability models, with sample-space tables and live statistical visualizations.",
    href: "https://github.com/abdelrhman19122007/probability-simulation-pro",
  },
  {
    title: "AI Logic Scripts",
    tags: ["Python", "AI", "Algorithms"],
    description:
      "Smart decision logic and automated script engines built around clean, testable Python architecture.",
    href: LINKS.github,
  },
  {
    title: "Volex",
    tags: ["Java", "OOP", "NetBeans"],
    description:
      "Java desktop application developed in NetBeans using core Java and object-oriented programming principles.",
    href: LINKS.github,
  },
];

const SOCIALS = [
  { icon: Linkedin, label: "LinkedIn", href: LINKS.linkedin, external: true },
  { icon: Github, label: "GitHub", href: LINKS.github, external: true },
  { icon: Mail, label: "Email", href: LINKS.email, external: false },
];

/* ---------------------------------------------------------------------- */
/* Responsive container — expands on large screens instead of staying     */
/* pinned to a narrow fixed max-width.                                    */
/* ---------------------------------------------------------------------- */
const CONTAINER_STYLE = {
  width: "100%",
  maxWidth: "1600px",
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: "clamp(1rem, 4vw, 4rem)",
  paddingRight: "clamp(1rem, 4vw, 4rem)",
};

function Container({ children, className = "", style = {} }) {
  return (
    <div className={className} style={{ ...CONTAINER_STYLE, ...style }}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Motion — respects prefers-reduced-motion throughout.                   */
/* ---------------------------------------------------------------------- */
function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = prefersReducedMotion();
    if (reducedRef.current) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible, reducedRef.current];
}

function Reveal({ children, className = "", axis = "y" }) {
  const [ref, visible, reduced] = useReveal();
  const offset = axis === "x" ? "translateX(24px)" : "translateY(24px)";
  return (
    <div
      ref={ref}
      className={className}
      style={
        reduced
          ? { opacity: 1 }
          : {
              opacity: visible ? 1 : 0,
              transform: visible ? "translate(0, 0)" : offset,
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }
      }
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Scroll-spy — tracks which section is currently in view.                */
/* ---------------------------------------------------------------------- */
const NAVBAR_HEIGHT = 80;

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: `-${NAVBAR_HEIGHT}px 0px -55% 0px`, threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function scrollToId(id) {
  const el = document.getElementById(id.replace("#", ""));
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/* ---------------------------------------------------------------------- */
/* Reusable pieces                                                        */
/* ---------------------------------------------------------------------- */
function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <h2
        className="font-bold uppercase tracking-tight"
        style={{ color: COLORS.white, fontFamily: DISPLAY_FONT, fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)" }}
      >
        {children}
      </h2>
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(90deg, ${COLORS.purple}, transparent)` }}
      />
    </div>
  );
}

function GlassCard({ children, className = "", style = {} }) {
  return (
    <div
      className={`rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 ${className}`}
      style={{
        backgroundColor: COLORS.cardBg,
        border: `1px solid ${COLORS.purpleSoft}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.purple)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.purpleSoft)}
    >
      {children}
    </div>
  );
}

function SkillBadge({ children }) {
  return (
    <span
      tabIndex={0}
      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm transition-all duration-300 cursor-default outline-none"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        border: `1px solid ${COLORS.purpleSoft}`,
        color: COLORS.grey,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = COLORS.purple;
        e.currentTarget.style.boxShadow = `0 0 16px ${COLORS.purpleGlow}`;
        e.currentTarget.style.transform = "translateY(-2px) scale(1.04)";
        e.currentTarget.style.color = COLORS.white;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.purpleSoft;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.color = COLORS.grey;
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = COLORS.purple;
        e.currentTarget.style.boxShadow = FOCUS_RING;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = COLORS.purpleSoft;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/* Sections                                                                */
/* ---------------------------------------------------------------------- */
function Logo({ size = 40 }) {
  return (
    <img
      src={LOGO_SRC}
      alt="Abdelrahman Naeem logo"
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        filter: `drop-shadow(0 0 10px ${COLORS.purpleGlow})`,
      }}
    />
  );
}

function Navbar({ activeId }) {
  const [open, setOpen] = useState(false);
  // Appears only after the user scrolls — hidden at the very top.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkStyle = (isActive) => ({
    color: isActive ? COLORS.purple : COLORS.grey,
    backgroundColor: isActive ? "rgba(124, 58, 237, 0.12)" : "transparent",
    textShadow: isActive ? `0 0 12px ${COLORS.purpleGlow}` : "none",
  });

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: "rgba(11, 11, 15, 0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${COLORS.purpleSoft}`,
        // Scroll-reveal animation only: slides down when scrolling, hidden at top.
        transform: scrolled || open ? "translateY(0)" : "translateY(-110%)",
        transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "transform",
      }}
    >
      {/* Full-width navbar — content hugs the screen edges on any display,
          from phones up to 32"+ monitors, instead of a narrow centered column. */}
      <div
        className="py-4 flex items-center justify-between"
        style={{
          width: "100%",
          paddingLeft: "clamp(1rem, 4vw, 5rem)",
          paddingRight: "clamp(1rem, 4vw, 5rem)",
        }}
      >
        <div className="flex items-center gap-3">
          <Logo size={42} />
          <div className="hidden sm:flex flex-col leading-none">
            <span
              className="text-base font-bold tracking-wide leading-none"
              style={{ color: COLORS.white, fontFamily: DISPLAY_FONT }}
            >
              Abdelrahman
            </span>
            <span
              className="text-xs font-light tracking-widest leading-none mt-1"
              style={{ color: "#D1D5DB", fontFamily: DISPLAY_FONT }}
            >
              Naeem
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollToId(`#${link.id}`)}
                aria-current={isActive ? "true" : undefined}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 outline-none"
                style={linkStyle(isActive)}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = COLORS.white;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = COLORS.grey;
                }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = FOCUS_RING)}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                {link.label}
              </button>
            );
          })}
          <a
            href={LINKS.cv}
            className="ml-2 px-5 py-2 rounded-lg text-sm font-semibold transition-transform hover:scale-105 outline-none"
            style={{ backgroundColor: COLORS.purple, color: COLORS.white }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = FOCUS_RING)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            Download CV
          </a>
        </div>

        <button
          className="md:hidden"
          style={{ color: COLORS.white }}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-2"
          style={{ borderTop: `1px solid ${COLORS.purpleSoft}` }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  scrollToId(`#${link.id}`);
                  setOpen(false);
                }}
                aria-current={isActive ? "true" : undefined}
                className="text-left text-sm font-medium mt-2 px-4 py-2 rounded-full transition-colors duration-300"
                style={linkStyle(isActive)}
              >
                {link.label}
              </button>
            );
          })}
          <a
            href={LINKS.cv}
            className="mt-2 px-5 py-2 rounded-lg text-sm font-semibold text-center"
            style={{ backgroundColor: COLORS.purple, color: COLORS.white }}
          >
            Download CV
          </a>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center pt-32 pb-24">
      <Container className="grid md:grid-cols-2 gap-16 items-center w-full">
        <Reveal>
          <h1
            className="font-bold tracking-tight leading-tight"
            style={{
              color: COLORS.white,
              fontFamily: DISPLAY_FONT,
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
            }}
          >
            Abdelrahman Naeem
          </h1>
          <h2
            className="font-semibold mt-4 leading-snug"
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: "clamp(1.25rem, 2.6vw, 2rem)",
              backgroundImage: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.electric})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI & Data Science Student | Software Testing & QA
          </h2>
          <p className="text-lg leading-relaxed mt-6 max-w-md" style={{ color: COLORS.grey }}>
            Building high-performance software, algorithmic models, and
            ensuring flawless code quality based on strong Computer Science
            fundamentals.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={() => scrollToId("#projects")}
              className="px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105 outline-none"
              style={{ backgroundColor: COLORS.purple, color: COLORS.white }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = FOCUS_RING)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              View Projects
            </button>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg font-semibold transition-colors outline-none"
              style={{ border: `1px solid ${COLORS.purple}`, color: COLORS.white }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.purpleSoft)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              onFocus={(e) => (e.currentTarget.style.boxShadow = FOCUS_RING)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              GitHub Profile
            </a>
          </div>
        </Reveal>

        <Reveal axis="x" className="order-last md:order-none">
          <div className="relative mx-auto max-w-sm an-float">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(closest-side, ${COLORS.purpleGlow}, transparent 70%)`,
                filter: "blur(40px)",
                transform: "scale(1.15)",
                zIndex: 0,
              }}
            />
            <img
              src={PROFILE_IMAGE_SRC}
              alt="Portrait of Abdelrahman Naeem"
              className="relative w-full h-full object-cover rounded-3xl"
              style={{
                aspectRatio: "4 / 5",
                boxShadow: `0 0 50px ${COLORS.purpleGlow}`,
                maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)",
              }}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="py-24">
      <Container>
        <Reveal>
          <SectionTitle>Technical Expertise</SectionTitle>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          {SKILLS.map((skill) => {
            const Icon = skill.icon;
            return (
              <Reveal key={skill.title}>
                <GlassCard className="h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(124, 58, 237, 0.12)" }}
                    >
                      <Icon size={18} style={{ color: COLORS.purple }} />
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: COLORS.white }}>
                      {skill.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <SkillBadge key={item}>{item}</SkillBadge>
                    ))}
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="py-24">
      <Container>
        <Reveal>
          <SectionTitle>Featured Projects</SectionTitle>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECTS.map((project) => (
            <Reveal key={project.title}>
              <GlassCard className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold leading-snug" style={{ color: COLORS.white }}>
                    {project.title}
                  </h3>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.title} on GitHub`}
                    className="outline-none"
                    onFocus={(e) => (e.currentTarget.style.boxShadow = FOCUS_RING)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                  >
                    <ArrowUpRight size={20} style={{ color: COLORS.grey }} />
                  </a>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-md"
                      style={{ border: `1px solid ${COLORS.purpleSoft}`, color: COLORS.electric }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-base leading-relaxed" style={{ color: COLORS.grey }}>
                  {project.description}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Contact() {
  return (
    <footer id="contact" className="py-24 text-center">
      <Container style={{ maxWidth: "640px" }}>
        <Reveal>
          <h2
            className="font-bold uppercase tracking-tight"
            style={{ color: COLORS.white, fontFamily: DISPLAY_FONT, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Let's Build Something Together
          </h2>
          <div className="flex items-center justify-center gap-5 mt-10">
            {SOCIALS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target={social.external ? "_blank" : undefined}
                  rel={social.external ? "noopener noreferrer" : undefined}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 outline-none"
                  style={{
                    border: `1px solid ${COLORS.purpleSoft}`,
                    color: COLORS.white,
                    boxShadow: `0 0 20px ${COLORS.purpleGlow}`,
                  }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = FOCUS_RING)}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = `0 0 20px ${COLORS.purpleGlow}`)}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
          <p className="mt-8 text-sm" style={{ color: COLORS.grey }}>
            📍 Damietta, Egypt
          </p>
        </Reveal>
      </Container>
    </footer>
  );
}

/* ---------------------------------------------------------------------- */
/* Root                                                                    */
/* ---------------------------------------------------------------------- */
export default function Portfolio() {
  const sectionIds = NAV_LINKS.map((l) => l.id);
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: COLORS.bg }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes anFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .an-float { animation: anFloat 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .an-float { animation: none; }
        }
      `}</style>
      <Navbar activeId={activeId} />
      <Hero />
      <Skills />
      <Projects />
      <Contact />
    </div>
  );
}
