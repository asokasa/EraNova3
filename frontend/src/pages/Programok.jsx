import { useEffect, useState } from "react";
import "./Programok.css";
import My_Footer from "../components/My_Footter";

export default function Programok() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetch("/api/programs")
      .then((res) => res.json())
      .then((data) => {
        setPrograms(data);
        setLoading(false);
        if (data.length > 0) {
          setSelectedDate(data[0].date);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="loading">Loading programs…</p>;
  }

  if (!programs.length) {
    return <p className="no-programs">No programs yet.</p>;
  }

  const dates = [...new Set(programs.map(p => p.date))];

  const filtered = programs
    .filter(p => p.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="programok-container">
      
      <h2>PROGRAMOK</h2>

      <div className="date-buttons">
        {dates.map(date => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`date-button ${date === selectedDate ? "active" : ""}`}
          >
            {date}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="no-programs">No programs for {selectedDate}.</p>
      ) : (
        <div className="program-grid">
          {filtered.map(p => (
            <div key={p._id} className="program-card">
                <div className="program-details">
                    <h2>{p.title}</h2>
                    
                    <p>{p.description}</p>
                    
                    <p><strong>Időpont:</strong> {p.time}</p>
                    
                </div>
                <div className="program-image-wrapper">
                    <img src={p.imageUrl || "/program_default_pic.png"} alt={p.title} className="program-image" />
                </div>
            </div>
          ))}
        </div>
      )}
        <div class="custom-shape-divider-bottom-1752702800">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
            </svg>
        </div>
        <My_Footer />  
    </div>
    
  );
}
