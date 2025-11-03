import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import api from "./services/api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function Home() {
  const [me, setMe] = useState(null);
  useEffect(() => {
    api
      .get("/auth/me")
      .then((r) => setMe(r.data.user))
      .catch(() => setMe(null));
  }, []);
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    <div style={{ maxWidth: 720, margin: "2rem auto" }}>
      <h2>Q&amp;A Home</h2>
      {me ? (
        <p>
          Welcome, {me.name} ({me.email})
        </p>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={logout} style={{ marginTop: 12 }}>
        Logout
      </button>
      <div style={{ marginTop: 24 }}>
        {/* Replace with Q&A UI */}
        <p>This is a protected page. Only logged-in users can see this.</p>
        <Link to="/">Refresh</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
