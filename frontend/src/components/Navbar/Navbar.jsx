import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar({}) {
  return (
    <nav className="navbar">
      <div>
        <h1 className="logo">Blog Post</h1>
      </div>
      <ul className="links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
      <div className="buttons">
        <Link to="/signup">
          <button className="button">Signup</button>
        </Link>
        <Link to="/login">
          <button className="button">Login </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
