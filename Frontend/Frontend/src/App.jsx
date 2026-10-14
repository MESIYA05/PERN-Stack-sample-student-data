
import { useEffect, useState } from "react";
import api from "./services/api";
import "./index.css";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    class_name: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadStudents() {
    try {
      setError("");
      const response = await api.get("/students");
      setStudents(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not load students. Check the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/students", form);

      setStudents((current) => [
        response.data.data,
        ...current,
      ]);

      setForm({
        full_name: "",
        email: "",
        class_name: "",
      });

      setMessage("Student added successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not add student."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/students/${id}`);

      setStudents((current) =>
        current.filter((student) => student.id !== id)
      );

      setMessage("Student deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not delete student."
      );
    }
  }

  return (
    <main className="container">
      <header className="header">
        <p className="eyebrow">KARKKAI SCHOOL MANAGEMENT</p>
        <h1>Student Management</h1>
        <p>Manage student records using React and PostgreSQL.</p>
      </header>

      {error && <p className="alert error">{error}</p>}
      {message && <p className="alert success">{message}</p>}

      <section className="card">
        <h2>Add a student</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="full_name">Full name</label>
          <input
            id="full_name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Enter student name"
            required
            maxLength={120}
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="student@example.com"
            required
            maxLength={255}
          />

          <label htmlFor="class_name">Class</label>
          <input
            id="class_name"
            name="class_name"
            value={form.class_name}
            onChange={handleChange}
            placeholder="Example: Class 10"
            required
            maxLength={50}
          />

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Add student"}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Students ({students.length})</h2>

        {loading ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No students found. Add your first student above.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.full_name}</td>
                    <td>{student.email}</td>
                    <td>{student.class_name}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
