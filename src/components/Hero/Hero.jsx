import React, { useState } from "react";
import styles from "./Hero.module.css";

export const Hero = () => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      // Use the random quotes API
      const res = await fetch("https://api.api-ninjas.com/v2/randomquotes", {
        headers: {
          "X-Api-Key": "5WntJ1R1pUxgaOJMDp8v6g==68aghYofWQKz9wrO",
        },
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      const quoteData = data[0];
      setQuote(quoteData.quote);
      setAuthor(quoteData.author);
    } catch (err) {
      console.error("Error fetching quote:", err);
      setQuote("Failed to fetch quote. Please try again later.");
      setAuthor("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`${styles.container} reveal`} data-reveal>
      <div className={styles.content}>
        <h1 className={styles.title}>Hi, I'm Mckhale</h1>
        <p className={styles.description}>
          I'm a 4th-year IT student passionate about web development and software engineering.
          Currently preparing for my OJT, I'm eager to apply my skills in React, NodeJS, and
          database management while learning from real-world projects.
        </p>

        <div className={styles.quoteBox}>
          <p className={styles.quoteText}>
            {quote ? `"${quote}"` : "Press the button for motivation!"}
          </p>
          {author && <p className={styles.quoteAuthor}>— {author}</p>}
        </div>

        <button onClick={fetchQuote} className={styles.quoteBtn} disabled={loading}>
          {loading ? "Loading..." : "Get Quote"}
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
