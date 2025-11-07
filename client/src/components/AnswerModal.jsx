import { useState, useEffect } from "react";
import api from "../services/api";

export default function AnswerModal({ open, onClose, question, onUpdated }) {
  const [body, setBody] = useState("");
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!open || !question?._id) return;
    api
      .get("/answers", { params: { question: question._id } })
      .then((res) => setAnswers(res.data.answers || []));
  }, [open, question]);

  if (!open || !question) return null;

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/answers", { question: question._id, body });
    setBody("");
    const { data } = await api.get("/answers", {
      params: { question: question._id },
    });
    setAnswers(data.answers || []);
    onUpdated?.();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Answers</h3>
        <div className="answers">
          {answers.map((a) => (
            <div key={a._id} className="answer">
              <div className="meta">
                {a.author?.name} • {new Date(a.createdAt).toLocaleString()}
              </div>
              <div>{a.body}</div>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="answer-form">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your answer..."
            required
          />
          <div className="actions">
            <button type="button" onClick={onClose}>
              Close
            </button>
            <button type="submit">Post Answer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
