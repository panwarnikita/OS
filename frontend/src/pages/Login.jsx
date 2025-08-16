import { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      onLogin(data.token);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 360, margin: "80px auto" }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {msg && <p>{msg}</p>}
      <p>New? <Link to="/register">Create account</Link></p>
    </div>
  );
}
