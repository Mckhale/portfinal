import { useEffect, useState } from 'react'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/newportfoli-api'

export default function Admin() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', description: '' })

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${BASE_URL}/projects-list.php`, {
        headers: { 'Accept': 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setProjects(Array.isArray(data) ? data : [])
    } catch (e) {
      setError('Backend not reachable yet. Follow the PHP setup below.')
    } finally {
      setLoading(false)
    }
  }

  async function createProject(e) {
    e.preventDefault()
    try {
      setError('')
      const res = await fetch(`${BASE_URL}/project-create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await loadProjects()
      setForm({ title: '', description: '' })
    } catch (e) {
      setError('Create failed. Check PHP endpoint and CORS.')
    }
  }

  async function updateProject(id, partial) {
    try {
      setError('')
      const res = await fetch(`${BASE_URL}/project-update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...partial }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await loadProjects()
    } catch (e) {
      setError('Update failed. Verify PHP and DB permissions.')
    }
  }

  async function deleteProject(id) {
    try {
      setError('')
      const res = await fetch(`${BASE_URL}/project-delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await loadProjects()
    } catch (e) {
      setError('Delete failed. Ensure endpoint exists and uses prepared statements.')
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Admin Panel</h1>
      <p>Manage projects. Backend assumed at: <code>{BASE_URL}</code></p>
      {error && (
        <div style={{ background: '#ffefe0', color: '#663c00', padding: 12, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <form onSubmit={createProject} style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Add Project</button>
      </form>

      <div>
        <h2>Projects {loading && '(Loading...)'}</h2>
        {!projects?.length && !loading && <p>No projects yet.</p>}
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
          {projects.map((p) => (
            <li key={p.id} style={{ border: '1px solid #ddd', padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{p.title}</strong>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => updateProject(p.id, { title: prompt('New title', p.title) || p.title })}>Edit</button>
                  <button onClick={() => deleteProject(p.id)}>Delete</button>
                </div>
              </div>
              <p style={{ marginTop: 8 }}>{p.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}