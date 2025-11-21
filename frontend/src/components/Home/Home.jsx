import React from "react";

import Navbar from "../Navbar/Navbar.jsx";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <div>
        <Navbar />
        <span className="home"></span>
      </div>
      <footer className="footer">&copy; 2025 Blog Post. All rights reserved.</footer>
    </div>
  );
};

export default Home;
