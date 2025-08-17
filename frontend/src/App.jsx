import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "./api";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Desktop from "./pages/Desktop.jsx";
import axios from "axios";


export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  function onLogin(t) {
    localStorage.setItem("token", t);
    setToken(t);
    navigate("/desktop");
  }

  function onLogout() {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? "/desktop" : "/login"} />} />
      <Route path="/login" element={<Login onLogin={onLogin} />} />
      <Route path="/register" element={<Register onLogin={onLogin} />} />
      <Route path="/desktop" element={<Desktop onLogout={onLogout} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
