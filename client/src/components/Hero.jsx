import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Download,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

function Hero() {
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [resumeLoading, setResumeLoading] = useState(true);

  const [imageError, setImageError] = useState(false);

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/profile`
        );

        const data = await response.json();

        if (data.success && data.profile) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================================
  // FETCH ACTIVE RESUME
  // ==========================================

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setResumeLoading(true);

        const response = await fetch(
          `${API_URL}/api/resume`
        );

        const data = await response.json();

        if (
          response.ok &&
          data.success &&
          data.resume
        ) {
          setResume(data.resume);
        } else {
          setResume(null);
        }
      } catch (error) {
        console.error(
          "Failed to load resume:",
          error
        );

        setResume(null);
      } finally {
        setResumeLoading(false);
      }
    };

    fetchResume();
  }, []);

  // ==========================================
  // PROFILE DATA
  // ==========================================

  const name =
    profile?.name || "Rahul Maurya";

  const title =
    profile?.title ||
    "MERN Stack Developer";

  const bio =
    profile?.bio ||
    "I build modern, responsive and user-friendly web applications using modern technologies and clean development practices.";

  const github =
    profile?.github ||
    "https://github.com";

  const linkedin =
    profile?.linkedin ||
    "https://www.linkedin.com";

  const profileImage =
    profile?.profileImage || "";

  // ==========================================
  // RESUME DATA
  // ==========================================

  const resumeUrl =
    resume?.fileUrl || "";

  const resumeFileName =
    resume?.fileName || "Resume.pdf";

  // ==========================================
  // SPLIT NAME
  // ==========================================

  const nameParts =
    name.trim().split(" ");

  const firstName =
    nameParts[0] || "Rahul";

  const lastName =
    nameParts.slice(1).join(" ") ||
    "Maurya";

  // ==========================================
  // DOWNLOAD RESUME
  // ==========================================

  const handleResumeDownload = async () => {
    if (!resumeUrl) {
      return;
    }

    try {
      // Open the actual uploaded resume URL.
      // This avoids downloading JSON/HTML response
      // instead of the PDF file.

      const response = await fetch(resumeUrl);

      if (!response.ok) {
        throw new Error(
          "Resume file could not be downloaded"
        );
      }

      const blob = await response.blob();

      const blobUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = blobUrl;
      link.download = resumeFileName;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(
        "Resume download error:",
        error
      );

      // Fallback:
      // Open uploaded resume directly.
      window.open(
        resumeUrl,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-slate-950 px-6 pt-20"
    >
      {/* ======================================
          BACKGROUND GLOW
      ======================================= */}

      <div className="absolute left-1/2 top-1/3 -z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 py-20 lg:grid-cols-2">

        {/* ====================================
            LEFT CONTENT
        ===================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          {/* Hello */}

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Hello, I'm
          </p>

          {/* Name */}

          <h1 className="text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
            {firstName}

            <br />

            <span className="text-cyan-400">
              {lastName}
            </span>
          </h1>

          {/* Title */}

          <h2 className="mt-6 text-2xl font-semibold text-slate-200 sm:text-3xl">
            {title}
          </h2>

          {/* Bio */}

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
            {bio}
          </p>

          {/* ==================================
              BUTTONS
          =================================== */}

          <div className="mt-8 flex flex-wrap gap-4">

            {/* View Projects */}

            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:scale-105 hover:bg-cyan-300"
            >
              View Projects

              <ArrowDown size={18} />
            </a>

            {/* =================================
                DOWNLOAD RESUME
            ================================== */}

            {resumeLoading ? (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-slate-500 opacity-70"
              >
                <Download size={18} />

                Loading Resume...
              </button>
            ) : resumeUrl ? (
              <button
                type="button"
                onClick={handleResumeDownload}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-cyan-400 hover:text-cyan-400"
              >
                <Download size={18} />

                Download Resume
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-semibold text-slate-600"
              >
                <Download size={18} />

                Resume Unavailable
              </button>
            )}
          </div>

          {/* ==================================
              SOCIAL LINKS
          =================================== */}

          <div className="mt-8 flex items-center gap-4">

            {/* GitHub */}

            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-full border border-white/10 p-3 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
            >
              <FaGithub size={20} />
            </a>

            {/* LinkedIn */}

            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="rounded-full border border-white/10 p-3 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
            >
              <FaLinkedinIn size={20} />
            </a>
          </div>

          {/* ==================================
              RESUME STATUS
          =================================== */}

          {!resumeLoading &&
            resume &&
            resume.fileName && (
              <p className="mt-4 text-xs text-slate-600">
                {resume.fileName}
              </p>
            )}
        </motion.div>

        {/* ====================================
            PROFILE IMAGE
        ===================================== */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative">

            {/* Glow */}

            <div className="absolute -inset-4 rounded-full bg-cyan-400/10 blur-2xl" />

            {/* Profile Circle */}

            <div className="relative flex h-72 w-72 items-center justify-center overflow-hidden rounded-full border border-cyan-400/30 bg-slate-900 shadow-2xl sm:h-96 sm:w-96">

              {!loading &&
              profileImage &&
              !imageError ? (
                <img
                  src={profileImage}
                  alt={name}
                  onError={() => {
                    console.error(
                      "Profile image failed to load:",
                      profileImage
                    );

                    setImageError(true);
                  }}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-7xl font-bold text-cyan-400">
                  RM
                </span>
              )}

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;