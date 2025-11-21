import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Auth.css";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/account/register", formData);
      if (res.status === 201) {
        alert(res.data.message);
        navigate("/Login");
      } else {
        alert("Failed to create account");
      }
    } catch {
      alert("Error signing up");
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <p>Don't have an account? </p>

      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          type="text"
          placeholder="Firstname"
          onChange={handleChange}
          required
        />
        <input
          name="lastName"
          type="text"
          placeholder="Lastname"
          onChange={handleChange}
          required
        />
        <input
          name="username"
          type="text"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Signup</button>

        <p>
          Already have an account? <Link to="/Login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
