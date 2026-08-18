import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Education from "../components/Education";
import Certifications from "../components/Certifications";
import Achievements from "../components/Achievements";
import Resume from "../components/Resume";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* Temporary sections */}
        <About />

        <Skills />

        <Projects />

        <Experience />

        <Education />

        <Certifications />

        <Achievements />

        <Resume />

        <Contact />

              </main>

        <Footer />

    </>
  );
}

export default Home;