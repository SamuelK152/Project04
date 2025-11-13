import { useEffect, useState } from "react";
import api from "../services/api";

function getId(x) {
  if (!x) return undefined;
  if (typeof x === "string") return x;
  return x._id || x.id;
}

export default function QuestionDetail({ question, me, onBack, onDeleted }) {
  const [answers, setAnswers] = useState([]);
  const [answerBody, setAnswerBody] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  const myId = getId(me);

  const loadAnswers = async () => {
    const { data } = await api.get("/answers", {
      params: { question: question._id },
    });
    setAnswers(data.answers || []);
  };

  useEffect(() => {
    if (question?._id) loadAnswers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?._id]);

  const postAnswer = async (e) => {
    e.preventDefault();
    if (!answerBody.trim()) return;
    await api.post("/answers", { question: question._id, body: answerBody });
    setAnswerBody("");
    await loadAnswers();
  };

  const addComment = async (answerId) => {
    const body = (commentInputs[answerId] || "").trim();
    if (!body) return;
    await api.post(`/answers/${answerId}/comments`, { body });
    setCommentInputs((s) => ({ ...s, [answerId]: "" }));
    await loadAnswers();
  };

  const deleteAnswer = async (answerId) => {
    await api.delete(`/answers/${answerId}`);
    await loadAnswers();
  };

  const deleteQuestion = async () => {
    await api.delete(`/questions/${question._id}`);
    onDeleted?.();
  };

  const deleteComment = async (answerId, commentId) => {
    await api.delete(`/answers/${answerId}/comments/${commentId}`);
    await loadAnswers();
  };

  const isQuestionOwner = myId && getId(question.author) === myId;

  return (
    <section className="content">
      <div className="content-header">
        <button className="btn" onClick={onBack}>
          ← Back
        </button>
        <div style={{ flex: 1 }} />
        {isQuestionOwner && (
          <button className="btn btn-danger" onClick={deleteQuestion}>
            Delete Question
          </button>
        )}
      </div>

      <div className="question-card">
        <div className="question-title">{question.title}</div>
        <div className="question-body">{question.body}</div>
        <div className="question-meta">
          Asked by {question.author?.name || "Unknown"} on{" "}
          {new Date(question.createdAt).toLocaleString()}
        </div>
      </div>

      <form onSubmit={postAnswer} className="answer-form">
        <h3>Write an answer</h3>
        <textarea
          value={answerBody}
          onChange={(e) => setAnswerBody(e.target.value)}
          placeholder="Write your answer..."
          required
        />
        <div className="actions">
          <button type="submit" className="btn btn-primary">
            Post Answer
          </button>
        </div>
      </form>

      <div className="answers">
        <h3>Answers</h3>
        {answers.length === 0 ? (
          <p className="muted">No answers yet.</p>
        ) : (
          answers.map((a) => {
            const isAnswerOwner = myId && getId(a.author) === myId;
            return (
              <div key={a._id} className="answer">
                <div className="answer-header">
                  <div className="meta">
                    {a.author?.name} • {new Date(a.createdAt).toLocaleString()}
                  </div>
                  {isAnswerOwner && (
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteAnswer(a._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="answer-body">{a.body}</div>

                <div className="comments">
                  {(a.comments || []).map((c) => {
                    const isCommentOwner = myId && getId(c.author) === myId;
                    return (
                      <div key={c._id} className="comment">
                        <div className="comment-meta">
                          {c.author?.name} •{" "}
                          {new Date(c.createdAt).toLocaleString()}
                          {isCommentOwner && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              style={{ marginLeft: 8 }}
                              onClick={() => deleteComment(a._id, c._id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <div className="comment-body">{c.body}</div>
                      </div>
                    );
                  })}
                  <div className="comment-form">
                    <input
                      className="comment-input"
                      type="text"
                      value={commentInputs[a._id] || ""}
                      onChange={(e) =>
                        setCommentInputs((s) => ({
                          ...s,
                          [a._id]: e.target.value,
                        }))
                      }
                      placeholder="Add a comment..."
                    />
                    <button
                      className="btn"
                      onClick={() => addComment(a._id)}
                      type="button"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
