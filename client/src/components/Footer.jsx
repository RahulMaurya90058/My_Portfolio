import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedinIn,
  FaEnvelope,
  FaArrowUp,
  FaCode,
  FaExternalLinkAlt,
} from "react-icons/fa";

const currentYear = new Date().getFullYear();

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Achievements", href: "#achievements" },
  { name: "Resume", href: "#resume" },
  { name: "Contact", href: "#contact" },
];

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950">

      {/* ==========================================
          BACKGROUND GLOW
      =========================================== */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8 sm:px-8">

        {/* ==========================================
            MAIN FOOTER
        =========================================== */}

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">

          {/* ========================================
              BRAND
          ========================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <a
              href="#home"
              className="inline-block text-3xl font-bold tracking-tight text-white"
            >
              Rahul
              <span className="text-cyan-400">.</span>
            </a>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
              MERN Stack Developer passionate about
              building modern, responsive and
              user-friendly web applications.
            </p>

            {/* Social Links */}

            <div className="mt-7 flex items-center gap-3">

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-400"
              >
                <FaGithub size={17} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-400"
              >
                <FaLinkedinIn size={17} />
              </a>

              <a
                href="mailto:your.email@example.com"
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-400"
              >
                <FaEnvelope size={17} />
              </a>

            </div>
          </motion.div>

          {/* ========================================
              QUICK LINKS
          ========================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">
              {quickLinks.slice(0, 5).map(
                (link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 transition hover:translate-x-1 hover:text-cyan-400"
                    >
                      {link.name}
                    </a>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* ========================================
              EXPLORE
          ========================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Explore
            </h3>

            <ul className="mt-5 space-y-3">
              {quickLinks.slice(5).map(
                (link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 transition hover:translate-x-1 hover:text-cyan-400"
                    >
                      {link.name}
                    </a>
                  </li>
                )
              )}

              <li>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-cyan-400"
                >
                  Let's Connect
                  <FaExternalLinkAlt
                    size={10}
                  />
                </a>
              </li>
            </ul>
          </motion.div>

          {/* ========================================
              CONTACT
          ========================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.3,
            }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
              Get In Touch
            </h3>

            <p className="mt-5 text-sm leading-7 text-slate-500">
              Have a project, opportunity or idea?
              I'd love to hear from you.
            </p>

            <a
              href="mailto:your.email@example.com"
              className="mt-5 inline-flex items-center gap-3 text-sm font-medium text-slate-300 transition hover:text-cyan-400"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                <FaEnvelope size={14} />
              </span>

              your.email@example.com
            </a>
          </motion.div>
        </div>

        {/* ==========================================
            DIVIDER
        =========================================== */}

        <div className="my-12 h-px bg-white/10" />

        {/* ==========================================
            BOTTOM SECTION
        =========================================== */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          {/* Copyright */}

          <div className="flex flex-col gap-2 text-center sm:text-left">
            <p className="text-sm text-slate-500">
              © {currentYear}{" "}
              <span className="font-medium text-slate-300">
                Rahul Maurya
              </span>
              . All rights reserved.
            </p>

            <p className="flex items-center justify-center gap-2 text-xs text-slate-600 sm:justify-start">
              <FaCode size={11} />
              Built with React & Tailwind CSS
            </p>
          </div>

          {/* Admin + Back To Top */}

          <div className="flex items-center justify-center gap-4">

            {/* Admin Login */}

            <a
              href="/admin/login"
              className="text-xs text-slate-600 transition hover:text-cyan-400"
            >
              Admin Login
            </a>

            <span className="h-4 w-px bg-white/10" />

            {/* Back To Top */}

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-500 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-400"
            >
              <FaArrowUp size={14} />
            </button>

          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;