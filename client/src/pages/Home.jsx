import { useEffect, useState } from "react";
import api from "../services/api";
import "./Home.css";

export default function Home() {
  const [me, setMe] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((r) => setMe(r.data.user))
      .catch(() => setMe(null));
    api.get("/categories").then((r) => {
      setCategories(r.data.categories);
      if (r.data.categories.length) setActiveCat(r.data.categories[0]);
    });
  }, []);

  useEffect(() => {
    if (!activeCat) return;
    setLoadingQ(true);
    api
      .get("/questions", { params: { category: activeCat._id } })
      .then((r) => setQuestions(r.data.questions))
      .catch(() => setQuestions([]))
      .finally(() => setLoadingQ(false));
  }, [activeCat]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="home">
      <header className="header">
        <div className="brand">TITLE</div>
        <div className="userbar">
          <span className="welcome">Welcome {me?.name || "..."}</span>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <h3 className="section-title">Categories</h3>
          <ul className="categories">
            {categories.map((c) => (
              <li key={c._id}>
                <button
                  onClick={() => setActiveCat(c)}
                  className={`category-btn ${
                    activeCat?._id === c._id ? "active" : ""
                  }`}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="content">
          <h3 className="section-title">
            {activeCat ? `Questions in ${activeCat.name}` : "Questions"}
          </h3>

          {loadingQ ? (
            <p className="muted">Loading...</p>
          ) : questions.length === 0 ? (
            <p className="muted">No questions found.</p>
          ) : (
            <ul className="questions">
              {questions.map((q) => (
                <li key={q._id} className="question-card">
                  <div className="question-title">{q.title}</div>
                  <div className="question-body">{q.body}</div>
                  <div className="question-meta">
                    Asked by {q.author?.name || "Unknown"} on{" "}
                    {new Date(q.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
