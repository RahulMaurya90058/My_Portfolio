import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Calendar,
  MapPin,
} from "lucide-react";

const API_URL = "http://localhost:5000";

function Education() {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch Education
  // ==========================================

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/education`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to fetch education"
          );
        }

        setEducations(data.educations || []);
      } catch (error) {
        console.error(
          "Failed to load education:",
          error
        );

        setError(
          "Unable to load education right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  return (
    <section
      id="education"
      className="bg-slate-900 px-6 py-24 sm:py-32"
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
            My Education
          </p>

          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Education &{" "}
            <span className="text-cyan-400">
              Qualification
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-cyan-400" />

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-400">
            My academic background and educational
            journey.
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
          educations.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-slate-500">
                Education details will be added soon.
              </p>
            </div>
          )}

        {/* ======================================
            Education Timeline
        ======================================= */}

        {!loading &&
          !error &&
          educations.length > 0 && (
            <div className="relative">

              {/* Timeline Line */}

              <div className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-cyan-400 via-cyan-400/30 to-transparent sm:block" />

              <div className="space-y-10">

                {educations.map(
                  (education, index) => (
                    <motion.div
                      key={education._id}
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

                      <div className="absolute left-0 top-0 hidden h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-slate-950 text-cyan-400 sm:flex">
                        <GraduationCap size={18} />
                      </div>

                      {/* Education Card */}

                      <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 transition hover:border-cyan-400/30 sm:p-8">

                        {/* Top */}

                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                          <div>

                            {/* Current Badge */}

                            {education.current && (
                              <span className="inline-block rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                                Currently Studying
                              </span>
                            )}

                            {/* Degree */}

                            <h3 className="mt-4 text-2xl font-bold text-white">
                              {education.degree}
                            </h3>

                            {/* Institution */}

                            <p className="mt-2 text-lg font-medium text-cyan-400">
                              {education.institution}
                            </p>

                            {/* Field */}

                            {education.field && (
                              <p className="mt-1 text-sm text-slate-400">
                                {education.field}
                              </p>
                            )}

                          </div>

                          {/* Date */}

                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Calendar size={16} />

                            <span>
                              {education.startYear}
                              {" — "}
                              {education.current
                                ? "Present"
                                : education.endYear ||
                                  "Present"}
                            </span>
                          </div>

                        </div>

                        {/* Location */}

                        {education.location && (
                          <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                            <MapPin size={16} />

                            <span>
                              {education.location}
                            </span>
                          </div>
                        )}

                        {/* Grade */}

                        {education.grade && (
                          <div className="mt-5">
                            <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs font-medium text-cyan-400">
                              Grade:{" "}
                              {education.grade}
                            </span>
                          </div>
                        )}

                        {/* Description */}

                        {education.description && (
                          <p className="mt-6 whitespace-pre-line leading-8 text-slate-400">
                            {education.description}
                          </p>
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

export default Education;