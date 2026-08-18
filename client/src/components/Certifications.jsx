import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  ExternalLink,
} from "lucide-react";

// const API_URL = "http://localhost:5000";
const API_URL = import.meta.env.VITE_API_URL;

function Certifications() {
  const [certifications, setCertifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // Fetch Certifications
  // ==========================================

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/certifications`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to fetch certifications"
          );
        }

        setCertifications(
          data.certifications || []
        );
      } catch (error) {
        console.error(
          "Failed to load certifications:",
          error
        );

        setError(
          "Unable to load certifications right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  return (
    <section
      id="certifications"
      className="bg-slate-950 px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            Section Heading
        ======================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
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
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            My Achievements
          </p>

          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            My{" "}
            <span className="text-cyan-400">
              Certifications
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-cyan-400" />

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-400">
            Certifications and professional training
            that represent my learning and technical
            skills.
          </p>
        </motion.div>

        {/* ======================================
            Loading
        ======================================= */}

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
          </div>
        )}

        {/* ======================================
            Error
        ======================================= */}

        {!loading && error && (
          <div className="py-16 text-center">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* ======================================
            Empty State
        ======================================= */}

        {!loading &&
          !error &&
          certifications.length === 0 && (
            <div className="py-16 text-center">
              <Award
                size={40}
                className="mx-auto text-slate-700"
              />

              <p className="mt-4 text-slate-500">
                Certifications will be added soon.
              </p>
            </div>
          )}

        {/* ======================================
            Certifications Grid
        ======================================= */}

        {!loading &&
          !error &&
          certifications.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {certifications.map(
                (certification, index) => (
                  <motion.article
                    key={certification._id}
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
                      duration: 0.5,
                      delay: index * 0.08,
                    }}
                    whileHover={{
                      y: -7,
                    }}
                    className="group rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition hover:border-cyan-400/30"
                  >

                    {/* ==================================
                        Icon
                    =================================== */}

                    <div className="flex items-start justify-between">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                        <Award size={24} />
                      </div>

                      {certification.issueDate && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar size={14} />

                          <span>
                            {certification.issueDate}
                          </span>
                        </div>
                      )}

                    </div>

                    {/* ==================================
                        Title
                    =================================== */}

                    <h3 className="mt-6 text-xl font-bold text-white transition group-hover:text-cyan-400">
                      {certification.title}
                    </h3>

                    {/* ==================================
                        Issuer
                    =================================== */}

                    <p className="mt-2 text-sm font-medium text-cyan-400">
                      {certification.issuer}
                    </p>

                    {/* ==================================
                        Description
                    =================================== */}

                    {certification.description && (
                      <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-400">
                        {certification.description}
                      </p>
                    )}

                    {/* ==================================
                        Skills
                    =================================== */}

                    {certification.skills?.length >
                      0 && (
                      <div className="mt-5 flex flex-wrap gap-2">

                        {certification.skills.map(
                          (skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>
                    )}

                    {/* ==================================
                        Credential ID
                    =================================== */}

                    {certification.credentialId && (
                      <p className="mt-5 text-xs text-slate-500">
                        Credential ID:{" "}
                        <span className="text-slate-300">
                          {
                            certification.credentialId
                          }
                        </span>
                      </p>
                    )}

                    {/* ==================================
                        Credential Link
                    =================================== */}

                    {certification.credentialUrl && (
                      <div className="mt-6 border-t border-white/5 pt-5">

                        <a
                          href={
                            certification.credentialUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                        >
                          <ExternalLink
                            size={15}
                          />

                          View Credential
                        </a>

                      </div>
                    )}

                  </motion.article>
                )
              )}

            </div>
          )}

      </div>
    </section>
  );
}

export default Certifications;