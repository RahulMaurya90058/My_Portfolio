import { FaGithub, FaLinkedinIn } from "react-icons/fa";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  {
    name: "Certifications",
    href: "#certifications",
  },
  {
    name: "Achievements",
    href: "#achievements",
  },
  { name: "Resume", href: "#resume" },
];

function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">

      {/* =========================
          DESKTOP NAVBAR
      ========================== */}

      <nav className="mx-auto hidden h-20 max-w-7xl items-center justify-between px-6 lg:px-8 xl:flex">

        {/* Logo */}

        <a
          href="#home"
          className="flex shrink-0 items-center"
          aria-label="Rahul Maurya - Home"
        >
          <img
            src="/logo.png"
            alt="Rahul Maurya Logo"
            className="h-14 w-auto object-contain"
          />
        </a>

        {/* Navigation */}

        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-slate-300 transition hover:text-cyan-400"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Social + Contact */}

        <div className="flex shrink-0 items-center gap-3">

          {/* GitHub */}

          <a
            href="https://github.com/RahulMaurya90058"
            target="_blank"
            rel="noreferrer"
            className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-cyan-400"
            aria-label="GitHub"
          >
            <FaGithub size={19} />
          </a>

          {/* LinkedIn */}

          <a
            href="www.linkedin.com/in/rahul-maurya-16b957312"
            target="_blank"
            rel="noreferrer"
            className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-cyan-400"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={19} />
          </a>

          {/* Contact */}

          <a
            href="#contact"
            className="ml-1 rounded-full border border-cyan-400/50 px-5 py-2 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950"
          >
            Contact Me
          </a>

        </div>
      </nav>

      {/* =========================
          MOBILE NAVBAR
      ========================== */}

      <nav className="xl:hidden">

        {/* Logo Row */}

        <div className="flex h-16 items-center px-5">

          <a
            href="#home"
            aria-label="Rahul Maurya - Home"
            className="flex items-center"
          >
            <img
              src="/logo.png"
              alt="Rahul Maurya Logo"
              className="h-11 w-auto object-contain"
            />
          </a>

        </div>

        {/* Horizontal Scroll Navigation */}

        <div className="border-t border-white/10">

          <div
            className="flex items-center gap-6 overflow-x-auto px-5 py-3"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="shrink-0 whitespace-nowrap text-sm font-medium text-slate-300 transition active:text-cyan-400"
              >
                {link.name}
              </a>
            ))}

            {/* Contact Button */}

            <a
              href="#contact"
              className="shrink-0 whitespace-nowrap rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition active:bg-cyan-300"
            >
              Contact Me
            </a>

          </div>

        </div>

      </nav>

    </header>
  );
}

export default Navbar;