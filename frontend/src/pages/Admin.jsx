import { useState, useEffect } from "react";
import "./Admin.css";

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [programs, setPrograms] = useState([]);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [programForm, setProgramForm] = useState({
    date: "",
    time: "",
    title: "",
    description: "",
    image: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) fetchPrograms();
  }, [token]);

  const fetchPrograms = () => {
    fetch("/api/programs")
      .then(res => res.json())
      .then(data => setPrograms(data))
      .catch(err => console.error(err));
  };

  const handleLogin = () => {
    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          fetchPrograms();
        } else {
          alert("Login failed");
        }
      });
  };

  const handleProgramChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setProgramForm({ ...programForm, image: files[0] });
    } else {
      setProgramForm({ ...programForm, [name]: value });
    }
  };

  const handleProgramSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(programForm).forEach(key => formData.append(key, programForm[key]));

    try {
      const res = await fetch("/api/programs", {
        method: "POST",
        body: formData
      });
      const json = await res.json();
      setLoading(false);

      if (json.program) {
        alert("✅ Program uploaded!");
        setProgramForm({
          date: "",
          time: "",
          title: "",
          description: "",
          image: null
        });
        fetchPrograms();
      } else {
        alert("❌ Failed to upload");
      }
    } catch (err) {
      setLoading(false);
      alert("❌ Error: " + err.message);
    }
  };

  const deleteProgram = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    await fetch(`/api/programs/${id}`, { method: "DELETE" });
    setPrograms(programs.filter(p => p._id !== id));
  };

  if (!token) {
    return (
      <div className="admin-container">
        <h1>Admin Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      <h2>Upload Festival Program</h2>
      <form onSubmit={handleProgramSubmit} className="program-form">
        <input type="date" name="date" value={programForm.date} onChange={handleProgramChange} required />
        <input type="time" name="time" value={programForm.time} onChange={handleProgramChange} required />
        <input type="text" name="title" placeholder="Title" value={programForm.title} onChange={handleProgramChange} required />
        <textarea name="description" placeholder="Short description" value={programForm.description} onChange={handleProgramChange}></textarea>
        <input type="file" name="image" accept="image/*" onChange={handleProgramChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading…" : "Upload Program"}
        </button>
      </form>

      <h2>Existing Programs</h2>
      <table className="programs-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Time</th>
            <th>Description</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {programs.map(program => (
            <tr key={program._id}>
              <td>{program.title}</td>
              <td>{program.date}</td>
              <td>{program.time}</td>
              <td>{program.description}</td>
              <td>
                {program.imageUrl &&
                  <img src={program.imageUrl} alt="" style={{ width: "50px", borderRadius: "4px" }} />}
              </td>
              <td>
                <button onClick={() => deleteProgram(program._id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => {
          setToken("");
          localStorage.removeItem("token");
        }}
      >
        Logout
      </button>
    </div>
  );
}
