import { useEffect, useState } from "react";
import appStyles from "../App.module.css";
import styles from "./Admin.module.css";
import { Navbar } from "../components/Navbar/Navbar";
import localProjects from "../data/projects.json";
import { getImageUrl } from "../utils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost/portfinal-api";

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", imageFile: null });
  const [previewUrl, setPreviewUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", description: "", repo_url: "", live_url: "" });

  // Ensure reveal elements show on this page too
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

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${BASE_URL}/projects-list.php`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Backend not reachable — showing current local projects.");
      setProjects(localProjects);
    } finally {
      setLoading(false);
    }
  }

  async function createProject(e) {
    e.preventDefault();
    try {
      setError("");
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      if (form.imageFile) fd.append("imageFile", form.imageFile);

      const res = await fetch(`${BASE_URL}/project-create.php`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadProjects();
      setForm({ title: "", description: "", imageFile: null });
      setPreviewUrl("");
    } catch (e) {
      setError("Create failed. Ensure PHP handles file uploads and CORS.");
    }
  }

  async function updateProject(id, partial) {
    try {
      setError("");
      const res = await fetch(`${BASE_URL}/project-update.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...partial }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadProjects();
      setEditingId(null);
    } catch (e) {
      setError("Update failed. Verify PHP and DB permissions.");
    }
  }

  async function deleteProject(id) {
    try {
      setError("");
      const res = await fetch(`${BASE_URL}/project-delete.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadProjects();
    } catch (e) {
      setError("Delete failed. Ensure endpoint exists and uses prepared statements.");
    }
  }

  return (
    <div className={appStyles.App}>
      <Navbar />
      <section className={`${styles.container} reveal`} data-reveal id="admin">
        <h1 className={styles.title}>Admin Panel</h1>
        <p className={styles.subtitle}>
          Manage projects. Backend assumed at: <code>{BASE_URL}</code>
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={createProject} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className={styles.textarea}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className={styles.fileInput}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setForm({ ...form, imageFile: file });
            setPreviewUrl(file ? URL.createObjectURL(file) : "");
          }}
        />
        {previewUrl && (
          <div className={styles.previewContainer}>
            <img className={styles.preview} src={previewUrl} alt="Preview" />
          </div>
        )}
        <button className={styles.button} type="submit">Add Project</button>
      </form>

        <div className={styles.listHeader}>
          <h2 className={styles.listTitle}>Projects {loading && "(Loading...)"}</h2>
        </div>
        {!projects?.length && !loading && <p className={styles.empty}>No projects yet.</p>}
        <ul className={styles.list}>
          {projects.map((p, idx) => (
            <li key={p.id ?? `${p.title}-${idx}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <strong className={styles.cardTitle}>{p.title}</strong>
                <div className={styles.actions}>
                  {editingId === p.id ? (
                    <>
                      <button
                        className={styles.actionBtn}
                        onClick={() => updateProject(p.id, editValues)}
                      >
                        Save
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => {
                          setEditingId(null);
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className={styles.actionBtn}
                      onClick={() => {
                        setEditingId(p.id);
                        setEditValues({
                          title: p.title || "",
                          description: p.description || "",
                          repo_url: p.repo_url || "",
                          live_url: p.live_url || "",
                        });
                      }}
                    >
                      Edit
                    </button>
                  )}
                  <button className={styles.actionBtn} onClick={() => deleteProject(p.id)}>Delete</button>
                </div>
              </div>
              {p.imageSrc && (
                <img className={styles.cardImage} src={getImageUrl(p.imageSrc)} alt={p.title} />
              )}
              {editingId === p.id ? (
                <div className={styles.editContainer}>
                  <input
                    className={styles.input}
                    placeholder="Title"
                    value={editValues.title}
                    onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                  />
                  <textarea
                    className={styles.textarea}
                    placeholder="Description"
                    value={editValues.description}
                    onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                  />
                  <input
                    className={styles.input}
                    placeholder="Repo URL (optional)"
                    value={editValues.repo_url}
                    onChange={(e) => setEditValues({ ...editValues, repo_url: e.target.value })}
                  />
                  <input
                    className={styles.input}
                    placeholder="Live URL (optional)"
                    value={editValues.live_url}
                    onChange={(e) => setEditValues({ ...editValues, live_url: e.target.value })}
                  />
                </div>
              ) : (
                <p className={styles.cardDesc}>{p.description}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}