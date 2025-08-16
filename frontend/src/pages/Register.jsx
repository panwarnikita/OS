import { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Register({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", { email, password, name });
      onLogin(data.token);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Register failed");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 360, margin: "80px auto" }}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button type="submit">Create</button>
      </form>
      {msg && <p>{msg}</p>}
      <p>Have account? <Link to="/login">Login</Link></p>
    </div>
  );
}
