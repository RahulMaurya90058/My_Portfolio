import { motion } from "framer-motion";
import { Code2, Database, Globe, Server } from "lucide-react";

const highlights = [
  {
    icon: Code2,
    title: "Frontend Development",
    description:
      "Building responsive and interactive interfaces using React, JavaScript and Tailwind CSS.",
  },
  {
    icon: Server,
    title: "Backend Development",
    description:
      "Creating scalable REST APIs and backend services using Node.js and Express.js.",
  },
  {
    icon: Database,
    title: "Database",
    description:
      "Working with MongoDB, Mongoose, MySQL and database-driven applications.",
  },
  {
    icon: Globe,
    title: "Full Stack Development",
    description:
      "Connecting frontend, backend and database into complete full-stack applications.",
  },
];

function About() {
  return (
    <section
      id="about"
      className="bg-slate-900 px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            About Me
          </p>

          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Building Ideas Into{" "}
            <span className="text-cyan-400">Digital Experiences</span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-cyan-400" />
        </motion.div>

        {/* Main About Content */}
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-3xl font-bold text-white">
              Hi, I'm Rahul Maurya 👋
            </h3>

            <p className="mt-6 leading-8 text-slate-400">
              I'm a passionate MERN Stack Developer interested in building
              modern and practical web applications. I enjoy turning ideas
              into clean, responsive and user-friendly digital experiences.
            </p>

            <p className="mt-5 leading-8 text-slate-400">
              My development journey includes working with React, JavaScript,
              Node.js, Express.js, MongoDB and other modern web technologies.
              I also enjoy learning new technologies and improving my
              problem-solving and development skills.
            </p>

            <p className="mt-5 leading-8 text-slate-400">
              I am currently focused on strengthening my full-stack
              development skills and building projects that solve real-world
              problems.
            </p>

            {/* Quick Info */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-sm text-slate-500">Role</p>
                <p className="mt-1 font-semibold text-white">
                  MERN Developer
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-sm text-slate-500">Focus</p>
                <p className="mt-1 font-semibold text-white">
                  Full Stack
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-sm text-slate-500">Projects</p>
                <p className="mt-1 font-semibold text-white">
                  Multiple
                </p>
              </div>
            </div>
          </motion.div>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid gap-5 sm:grid-cols-2"
          >
            {highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{ y: -5 }}
                  className="group rounded-2xl border border-white/10 bg-slate-950/50 p-6 transition hover:border-cyan-400/30"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 transition group-hover:bg-cyan-400 group-hover:text-slate-950">
                    <Icon size={24} />
                  </div>

                  <h4 className="text-lg font-semibold text-white">
                    {item.title}
                  </h4>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;