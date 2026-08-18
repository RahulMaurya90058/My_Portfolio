import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  MapPin,
} from "lucide-react";

const API_URL = "http://localhost:5000";

function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch Experiences
  // ==========================================

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/experience`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load experiences"
          );
        }

        setExperiences(data.experiences || []);
      } catch (error) {
        console.error(
          "Failed to load experiences:",
          error
        );

        setError(
          "Unable to load experience right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section
      id="experience"
      className="bg-slate-950 px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">

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
            My Journey
          </p>

          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Experience &{" "}
            <span className="text-cyan-400">
              Training
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-cyan-400" />

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-400">
            My professional learning journey and
            practical development experience.
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
          experiences.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-slate-500">
                Experience will be added soon.
              </p>
            </div>
          )}

        {/* ======================================
            Timeline
        ======================================= */}

        {!loading &&
          !error &&
          experiences.length > 0 && (
            <div className="relative">

              {/* Timeline Line */}

              <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-cyan-400 via-cyan-400/30 to-transparent sm:block" />

              <div className="space-y-10">

                {experiences.map(
                  (experience, index) => (
                    <motion.div
                      key={experience._id}
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
                        duration: 0.6,
                        delay: index * 0.1,
                      }}
                      className="relative sm:pl-16"
                    >

                      {/* Timeline Icon */}

                      <div className="absolute left-0 top-0 hidden h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-slate-900 text-cyan-400 sm:flex">
                        <Briefcase size={18} />
                      </div>

                      {/* Experience Card */}

                      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition hover:border-cyan-400/30 sm:p-8">

                        {/* Top */}

                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                          <div>

                            {/* Employment Type */}

                            <span className="inline-block rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                              {experience.employmentType}
                            </span>

                            {/* Job Title */}

                            <h3 className="mt-4 text-2xl font-bold text-white">
                              {experience.jobTitle}
                            </h3>

                            {/* Company */}

                            <p className="mt-2 text-lg font-medium text-cyan-400">
                              {experience.company}
                            </p>

                          </div>

                          {/* Date */}

                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Calendar size={16} />

                            <span>
                              {experience.startDate}{" "}
                              —{" "}
                              {experience.current
                                ? "Present"
                                : experience.endDate ||
                                  "Present"}
                            </span>
                          </div>

                        </div>

                        {/* Location */}

                        {experience.location && (
                          <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                            <MapPin size={16} />

                            <span>
                              {experience.location}
                            </span>
                          </div>
                        )}

                        {/* Description */}

                        {experience.description && (
                          <p className="mt-6 whitespace-pre-line leading-8 text-slate-400">
                            {experience.description}
                          </p>
                        )}

                        {/* Technologies */}

                        {experience.technologies?.length >
                          0 && (
                          <div className="mt-6 flex flex-wrap gap-2">

                            {experience.technologies.map(
                              (technology) => (
                                <span
                                  key={technology}
                                  className="rounded-full border border-white/10 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-300"
                                >
                                  {technology}
                                </span>
                              )
                            )}

                          </div>
                        )}

                      </div>

                    </motion.div>
                  )
                )}

              </div>
            </div>
          )}

      </div>
    </section>
  );
}

export default Experience;