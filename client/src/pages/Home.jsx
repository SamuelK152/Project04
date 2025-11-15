import { useEffect, useState } from "react";
import api from "../services/api";
import "./home.css";
import QuestionDetail from "../components/QuestionDetail";

export default function Home() {
  const [me, setMe] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showNewQForm, setShowNewQForm] = useState(false);
  const [newQTitle, setNewQTitle] = useState("");
  const [newQBody, setNewQBody] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api
      .get("/auth/me")
      .then((r) => setMe(r.data.user))
      .catch(() => setMe(null));
  }, []);
  useEffect(() => {
    api.get("/categories").then((r) => {
      setCategories(r.data.categories);
      if (r.data.categories.length) setActiveCat(r.data.categories[0]);
    });
  }, []);

  const loadQuestions = async (categoryId) => {
    if (!categoryId) return;
    setLoadingQ(true);
    try {
      const { data } = await api.get("/questions", {
        params: { category: categoryId },
      });
      setQuestions(data.questions);
    } catch {
      setQuestions([]);
    } finally {
      setLoadingQ(false);
    }
  };

  useEffect(() => {
    if (!activeCat) return;
    loadQuestions(activeCat._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCat?._id]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/Project04/login";
  };

  const createQuestion = async (e) => {
    e.preventDefault();
    if (!activeCat) return;
    await api.post("/questions", {
      title: newQTitle,
      body: newQBody,
      category: activeCat._id,
    });
    setNewQTitle("");
    setNewQBody("");
    setShowNewQForm(false);
    await loadQuestions(activeCat._id);
  };

  const onBackFromDetail = async () => {
    setSelectedQuestion(null);
    if (activeCat) await loadQuestions(activeCat._id);
  };

  return (
    <>
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
                  onClick={() => {
                    setActiveCat(c);
                    setSelectedQuestion(null);
                    setShowNewQForm(false);
                  }}
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

        {!selectedQuestion ? (
          <section className="content">
            <div className="question-list-header">
              <h2 className="section-title">
                {activeCat ? `Questions in ${activeCat.name}` : "Questions"}
              </h2>
              {activeCat && (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowNewQForm((s) => !s)}
                >
                  {showNewQForm ? "Close" : "New Question"}
                </button>
              )}
            </div>

            {showNewQForm && (
              <form onSubmit={createQuestion} className="new-question-form">
                <input
                  value={newQTitle}
                  onChange={(e) => setNewQTitle(e.target.value)}
                  placeholder="Title"
                  required
                />
                <textarea
                  value={newQBody}
                  onChange={(e) => setNewQBody(e.target.value)}
                  placeholder="Details"
                  required
                />
                <div className="actions">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setShowNewQForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Post
                  </button>
                </div>
              </form>
            )}

            {loadingQ ? (
              <p className="muted">Loading...</p>
            ) : questions.length === 0 ? (
              <p className="muted">No questions found.</p>
            ) : (
              <ul className="questions">
                {questions.map((q) => (
                  <li
                    key={q._id}
                    className="question-card"
                    role="button"
                    onClick={() => setSelectedQuestion(q)}
                  >
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
        ) : (
          <QuestionDetail
            question={selectedQuestion}
            me={me}
            onBack={onBackFromDetail}
            onDeleted={onBackFromDetail}
          />
        )}
      </main>
    </>
  );
}
