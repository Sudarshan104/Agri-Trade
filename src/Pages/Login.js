import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", { email, password });

      // ✅ Save user to localStorage
      localStorage.setItem("user", JSON.stringify(res.data));

      // 🔥 Force navbar & app to update immediately
      window.dispatchEvent(new Event("storage"));

      // ✅ Navigate based on role
      if (res.data.role === "FARMER") {
        navigate("/farmer");
      } else if (res.data.role === "RETAILER") {
        navigate("/retailer");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        {error && <p className="error-text">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
