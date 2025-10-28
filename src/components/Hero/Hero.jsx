import React, { useState } from "react";
import styles from "./Hero.module.css";

export const Hero = () => {
  const [setup, setSetup] = useState("");
  const [punchline, setPunchline] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchJoke = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://official-joke-api.appspot.com/random_joke");
      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      setSetup(data.setup);      
      setPunchline(data.punchline); 
    } catch (err) {
      console.error("Error fetching joke:", err);
      alert("Failed to fetch joke. Please check your internet connection or try again later.");
      setSetup("Failed to fetch joke. Try again!");
      setPunchline("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Hi, I'm Mckhale</h1>
        <p className={styles.description}>
           I'm a 4th-year IT student passionate about web development and software engineering.  
           Currently preparing for my OJT, I'm eager to apply my skills in React, NodeJS, and database management  
           while learning from real-world projects.
        </p>

        <div className={styles.quoteBox}>
          <p className={styles.quoteText}>
            {setup ? `"${setup}"` : "Press the button to be happy!"}
          </p>
          {punchline && <p className={styles.quoteAuthor}>— {punchline}</p>}
        </div>

        <button onClick={fetchJoke} className={styles.quoteBtn} disabled={loading}>
          {loading ? "Loading..." : "Random Jokes!"}
        </button>

        <a href="mailto:myemail@email.com" className={styles.contactBtn}>
          Contact Me
        </a>
      </div>

      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};
