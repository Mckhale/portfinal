import React, { useState } from "react";
import styles from "./Contact.module.css";
import { getImageUrl } from "../../utils";

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e) {
    e.preventDefault();
    // You can wire this up to your backend or email service later
    alert("Thanks! I’ll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <section id="contact" className={`${styles.container} reveal`} data-reveal>
      <h2 className={styles.title}>Contact Me</h2>
      <p className={styles.subtitle}>I'm excited to work with you!</p>

      <div className={`${styles.panel} ${styles.box}`}>
        <div className={styles.grid}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <textarea
            className={styles.textarea}
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <button type="submit" className={styles.submit}>Submit</button>
        </form>

        <div className={styles.details}>
          <ul className={styles.detailList}>
            <li className={styles.detailItem}>
              <span className={styles.iconBadge} aria-hidden>📍</span>
              <div className={styles.detailText}>
                <div>851 Baden Ave</div>
                <div>South San Francisco,</div>
                <div>California(CA), 94080</div>
              </div>
            </li>
            <li className={styles.detailItem}>
              <span className={styles.iconBadge} aria-hidden>📞</span>
              <a href="tel:1234567890" className={styles.detailLink}>123-456-789-0</a>
            </li>
            <li className={styles.detailItem}>
              <img className={styles.imgIcon} src={getImageUrl("contact/emailIcon.png")} alt="Email" />
              <a href="mailto:info@my.com" className={styles.detailLink}>info@my.com</a>
            </li>
          </ul>
        </div>
        </div>
      </div>
    </section>
  );
};
