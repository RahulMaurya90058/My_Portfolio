import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaDownload,
  FaFilePdf,
  FaExternalLinkAlt,
} from "react-icons/fa";

// const API_URL = "http://localhost:5000";
const API_URL = import.meta.env.VITE_API_URL;

function Resume() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  // ==========================================
  // FETCH ACTIVE RESUME
  // ==========================================

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/resume`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch resume"
          );
        }

        setResume(data.resume || null);
      } catch (error) {
        console.error(
          "Fetch resume error:",
          error
        );

        setError(
          "Unable to load resume right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  // ==========================================
  // DOWNLOAD RESUME
  // ==========================================

  const handleDownload = async () => {
    if (!resume?.fileUrl) {
      return;
    }

    try {
      setDownloading(true);

      const response = await fetch(
        resume.fileUrl
      );

      if (!response.ok) {
        throw new Error(
          "Failed to download resume"
        );
      }

      const blob = await response.blob();

      const blobUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = blobUrl;

      link.download =
        resume.fileName ||
        "Rahul-Maurya-Resume.pdf";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(
        "Resume download error:",
        error
      );

      // Fallback
      window.open(
        resume.fileUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } finally {
      setDownloading(false);
    }
  };

  // ==========================================
  // GOOGLE PDF VIEWER URL
  // ==========================================

  const getPreviewUrl = () => {
    if (!resume?.fileUrl) {
      return "#";
    }

    return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(
      resume.fileUrl
    )}`;
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <section
      id="resume"
      className="relative overflow-hidden bg-slate-900 px-6 py-24 sm:py-32"
    >
      {/* ======================================
          BACKGROUND GLOW
      ======================================= */}

      <div className="absolute left-1/2 top-1/2 -z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl sm:p-12"
        >
          <div className="grid items-center gap-10 md:grid-cols-[auto_1fr_auto]">

            {/* =================================
                RESUME ICON
            ================================== */}

            <motion.div
              initial={{
                scale: 0.8,
                opacity: 0,
              }}
              whileInView={{
                scale: 1,
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
              }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400 md:mx-0"
            >
              <FaFilePdf size={38} />
            </motion.div>

            {/* =================================
                CONTENT
            ================================== */}

            <div className="text-center md:text-left">

              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
                My Resume
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Want to know more about me?
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-slate-400">
                Download my resume to learn more
                about my education, technical skills,
                projects, experience and achievements.
              </p>

              {/* Loading */}

              {loading && (
                <p className="mt-4 text-sm text-slate-500">
                  Loading resume...
                </p>
              )}

              {/* Error */}

              {!loading && error && (
                <p className="mt-4 text-sm text-red-400">
                  {error}
                </p>
              )}

              {/* No Resume */}

              {!loading &&
                !error &&
                !resume && (
                  <p className="mt-4 text-sm text-slate-500">
                    Resume will be available soon.
                  </p>
                )}

              {/* Resume Name */}

              {!loading &&
                !error &&
                resume && (
                  <p className="mt-4 break-all text-sm text-slate-500">
                    {resume.fileName}
                  </p>
                )}

            </div>

            {/* =================================
                BUTTONS
            ================================== */}

            {!loading &&
              !error &&
              resume && (
                <div className="flex flex-col gap-3 sm:flex-row md:flex-col">

                  {/* =============================
                      DOWNLOAD CV
                  ============================== */}

                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:scale-105 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                  >
                    <FaDownload size={17} />

                    {downloading
                      ? "Downloading..."
                      : "Download CV"}
                  </button>

                  {/* =============================
                      VIEW RESUME
                  ============================== */}

                  <a
                    href={getPreviewUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                  >
                    View Resume

                    <FaExternalLinkAlt
                      size={15}
                    />
                  </a>

                </div>
              )}

          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Resume;