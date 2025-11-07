import { useState } from "react";
import api from "../services/api";

export default function NewQuestionModal({
  open,
  onClose,
  categoryId,
  onCreated,
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/questions", { title, body, category: categoryId });
    setTitle("");
    setBody("");
    onCreated?.();
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={submit} className="modal-content">
        <h3>New Question</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Details"
          required
        />
        <div className="actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">Post</button>
        </div>
      </form>
    </div>
  );
}
