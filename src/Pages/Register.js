import { useState } from "react";
import API from "../Services/api";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "FARMER",
  });

  const [error, setError] = useState("");

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      await API.post("/auth/register", form);
      alert("Registration Successful");
      window.location.href = "/login";
    } catch (err) {
      setError("Registration failed. Email may already exist.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create an Account</h2>
        <p className="register-subtitle">
          Join the Farmer–Retailer Trading Platform
        </p>

        {error && <p className="error-text">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email Address"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="FARMER">Farmer</option>
          <option value="RETAILER">Retailer</option>
        </select>

        <button className="register-btn" onClick={submit}>
          Register
        </button>

        <p className="register-footer">
          Empowering farmers • Enabling direct trade
        </p>
      </div>
    </div>
  );
}
