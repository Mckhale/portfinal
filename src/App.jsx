import { useEffect } from "react";
import styles from "./App.module.css";
import { About } from "./components/About/About";
import { Contact } from "./components/Contact/Contact";
import { Experience } from "./components/Experience/Experience";
import { Hero } from "./components/Hero/Hero";
import { Navbar } from "./components/Navbar/Navbar";
import { Projects } from "./components/Projects/Projects";

function App() {
  // Set up scroll reveal for elements marked with [data-reveal]
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add("show");
          } else {
            el.classList.remove("show");
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealEls = document.querySelectorAll(".reveal[data-reveal]");
    revealEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  return (
    <div className={styles.App}>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </div>
  );
}

export default App;
