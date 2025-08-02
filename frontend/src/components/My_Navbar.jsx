import { Link } from "react-router-dom";
import { useState } from "react";
import "./My_Navbar.css";

export default function My_Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <div className="header">
      <div className="logo_cont">
        <img className="sarga" src="/home_shapes/Logo_sarga.png" alt="" />
        <Link to="/">
          <img
            src="/home_shapes/EraNova_Logo.png"
            alt="Logo"
            className="logo"
          />
        </Link>
      </div>

      <div className="header_nav">
        <img src="/home_shapes/Navbar_sarga.png" alt="" />
        <button
          className="nav_toggle"
          aria-label="Toggle navigation menu"
          onClick={toggleMenu}
        >
          ☰
        </button>
        <nav className={menuOpen ? "open" : ""}>
          <ul>
            <li>
              <Link to="/" onClick={handleLinkClick}>
                Főoldal
              </Link>
            </li>
            <li>
              <Link to="/programok" onClick={handleLinkClick}>
                Programok
              </Link>
            </li>
            <li>
              <Link to="/info" onClick={handleLinkClick}>
                A fesztiválról
              </Link>
            </li>
            <li>
              <Link to="/tamogatas" onClick={handleLinkClick}>
                Támogatás
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}