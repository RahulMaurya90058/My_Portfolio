import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Braces,
  Database,
  GitBranch,
  Globe,
  Server,
  Wrench,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const categoryIcons = {
  Frontend: Globe,
  Backend: Server,
  Database: Database,
  Programming: Braces,
  Tools: GitBranch,
  Other: Wrench,
};

const categoryOrder = [
  "Frontend",
  "Backend",
  "Database",
  "Programming",
  "Tools",
  "Other",
];

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/skills`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load skills"
          );
        }

        setSkills(data.skills || []);
      } catch (error) {
        console.error(
          "Failed to load skills:",
          error
        );

        setError(
          "Unable to load skills right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // ==========================================
  // Group Skills By Category
  // ==========================================

  const skillCategories = categoryOrder
    .map((category) => {
      const categorySkills = skills
        .filter(
          (skill) =>
            skill.category === category
        )
        .sort(
          (a, b) =>
            (a.order ?? 0) -
            (b.order ?? 0)
        );

      if (categorySkills.length === 0) {
        return null;
      }

      return {
        title: category,
        icon:
          categoryIcons[category] || Wrench,
        skills: categorySkills,
      };
    })
    .filter(Boolean);

  return (
    <section
      id="skills"
      className="bg-slate-950 px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            Heading
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
            My Skills
          </p>

          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Technologies I{" "}
            <span className="text-cyan-400">
              Work With
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-cyan-400" />

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-400">
            A collection of technologies and tools I
            use to build modern, responsive and
            full-stack web applications.
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
          skillCategories.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-slate-500">
                Skills will be added soon.
              </p>
            </div>
          )}

        {/* ======================================
            Skills Grid
        ======================================= */}

        {!loading &&
          !error &&
          skillCategories.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {skillCategories.map(
                (category, index) => {
                  const Icon = category.icon;

                  return (
                    <motion.div
                      key={category.title}
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
                        delay:
                          index * 0.08,
                      }}
                      whileHover={{
                        y: -6,
                      }}
                      className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition hover:border-cyan-400/30"
                    >

                      {/* Category Header */}

                      <div className="mb-7 flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                          <Icon size={24} />
                        </div>

                        <h3 className="text-lg font-semibold text-white">
                          {category.title}
                        </h3>

                      </div>

                      {/* Skills */}

                      <div className="space-y-5">

                        {category.skills.map(
                          (skill) => (
                            <div
                              key={skill._id}
                            >

                              <div className="mb-2 flex items-center justify-between">

                                <span className="text-sm font-medium text-slate-300">
                                  {skill.name}
                                </span>

                                <span className="text-xs text-slate-500">
                                  {skill.level}%
                                </span>

                              </div>

                              <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                                <motion.div
                                  initial={{
                                    width: 0,
                                  }}
                                  whileInView={{
                                    width: `${skill.level}%`,
                                  }}
                                  viewport={{
                                    once: true,
                                  }}
                                  transition={{
                                    duration: 1,
                                    delay: 0.2,
                                  }}
                                  className="h-full rounded-full bg-cyan-400"
                                />

                              </div>

                            </div>
                          )
                        )}

                      </div>

                    </motion.div>
                  );
                }
              )}

            </div>
          )}

      </div>
    </section>
  );
}

export default Skills;