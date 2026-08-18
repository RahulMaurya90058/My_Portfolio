import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  ExternalLink,
  X,
} from "lucide-react";

// const API_URL = "http://localhost:5000";
const API_URL = import.meta.env.VITE_API_URL;

function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] =
    useState(null);

  // ==========================================
  // Fetch Achievements
  // ==========================================

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/achievements`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to fetch achievements"
          );
        }

        setAchievements(data.achievements || []);
      } catch (error) {
        console.error(
          "Failed to load achievements:",
          error
        );

        setError(
          "Unable to load achievements right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // ==========================================
  // Close Image Modal
  // ==========================================

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <section
      id="achievements"
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
            Achievements
          </p>

          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            My{" "}
            <span className="text-cyan-400">
              Achievements
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-cyan-400" />

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-400">
            Awards, recognitions and achievements
            that represent my learning journey and
            technical growth.
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
          achievements.length === 0 && (
            <div className="py-16 text-center">

              <Award
                size={42}
                className="mx-auto text-slate-700"
              />

              <p className="mt-5 text-slate-500">
                Achievements will be added soon.
              </p>

            </div>
          )}

        {/* ======================================
            Achievement Cards
        ======================================= */}

        {!loading &&
          !error &&
          achievements.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2">

              {achievements.map(
                (achievement, index) => (
                  <motion.article
                    key={achievement._id}
                    initial={{
                      opacity: 0,
                      y: 35,
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
                      delay: index * 0.1,
                    }}
                    whileHover={{
                      y: -6,
                    }}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 transition hover:border-cyan-400/30"
                  >

                    {/* ==================================
                        Achievement Image
                    =================================== */}

                    {achievement.image ? (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            achievement.image
                          )
                        }
                        className="group relative block w-full cursor-pointer overflow-hidden text-left"
                        aria-label={`View ${achievement.title} image`}
                      >

                        <div className="aspect-video overflow-hidden bg-slate-950">

                          <img
                            src={achievement.image}
                            alt={
                              achievement.title
                            }
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                        </div>

                        {/* Image Overlay */}

                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 transition duration-300 group-hover:bg-slate-950/50">

                          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white opacity-0 backdrop-blur-md transition duration-300 group-hover:opacity-100">
                            View Image
                          </span>

                        </div>

                      </button>
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-slate-950">

                        <Award
                          size={45}
                          className="text-slate-700"
                        />

                      </div>
                    )}

                    {/* ==================================
                        Content
                    =================================== */}

                    <div className="p-6 sm:p-7">

                      {/* Category + Date */}

                      <div className="flex flex-wrap items-center justify-between gap-3">

                        <span className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-400">

                          <Award size={14} />

                          {achievement.category ||
                            "Achievement"}

                        </span>

                        {achievement.date && (
                          <span className="inline-flex items-center gap-2 text-sm text-slate-500">

                            <Calendar size={15} />

                            {achievement.date}

                          </span>
                        )}

                      </div>

                      {/* Title */}

                      <h3 className="mt-5 text-2xl font-bold text-white">
                        {achievement.title}
                      </h3>

                      {/* Organization */}

                      <p className="mt-2 font-medium text-cyan-400">
                        {achievement.organization}
                      </p>

                      {/* Description */}

                      {achievement.description && (
                        <p className="mt-4 leading-7 text-slate-400">
                          {achievement.description}
                        </p>
                      )}

                      {/* Credential ID */}

                      {achievement.credentialId && (
                        <div className="mt-5 rounded-lg border border-white/10 bg-slate-950/50 px-4 py-3">

                          <p className="text-xs uppercase tracking-wider text-slate-500">
                            Credential ID
                          </p>

                          <p className="mt-1 break-all text-sm font-medium text-slate-300">
                            {
                              achievement.credentialId
                            }
                          </p>

                        </div>
                      )}

                      {/* Credential Link */}

                      {achievement.credentialUrl && (
                        <a
                          href={
                            achievement.credentialUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                        >
                          View Credential

                          <ExternalLink
                            size={16}
                          />
                        </a>
                      )}

                    </div>

                  </motion.article>
                )
              )}

            </div>
          )}

      </div>

      {/* ========================================
          Image Modal
      ========================================= */}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
          onClick={closeImage}
        >

          <div
            className="relative max-h-[90vh] max-w-5xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Close Button */}

            <button
              type="button"
              onClick={closeImage}
              className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg transition hover:bg-cyan-400"
              aria-label="Close image preview"
            >
              <X size={20} />
            </button>

            {/* Image */}

            <img
              src={selectedImage}
              alt="Achievement preview"
              className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
            />

          </div>

        </div>
      )}

    </section>
  );
}

export default Achievements;