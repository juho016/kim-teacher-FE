import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderAuthed from "../components/layout/HeaderAuthed.jsx";

const AiRoomPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([
    { id: "c1", role: "ai", text: "안녕하세요! 학습 주제를 입력하면 강의를 준비해드릴게요." },
  ]);

  const title = useMemo(() => `김선생님 AI 학습방`, []);

  const send = () => {
    const text = message.trim();
    if (!text) return;

    setChat((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text },
      { id: `a-${Date.now()}-2`, role: "ai", text: "좋아요! 지금 답변을 준비 중이에요. (더미 응답)" },
    ]);
    setMessage("");
  };

  return (
    <div className="page-container">
      <div className="main-card">
        <HeaderAuthed />

        <div className="content">
          <div className="airoom-detail-top">
            <button className="back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
              ←
            </button>
            <h2 className="airoom-detail-title">{title}</h2>
          </div>

          <div className="airoom-split">
            {/* LEFT */}
            <div className="airoom-left">
              <div className="airoom-topic">
                <label className="airoom-label">학습 주제:</label>
                <input
                  className="airoom-input"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="학습 주제를 입력하세요"
                />
              </div>

              <div className="airoom-video">
                <div className="airoom-video-inner">
                  <div className="airoom-video-text">강의 준비중 입니다.</div>
                </div>
              </div>

              <div className="airoom-chatbar">
                <input
                  className="airoom-chatinput"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="AI 선생님에게 질문해보세요"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                />
                <button className="btn btn-primary airoom-send" onClick={send}>
                  전송
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="airoom-right">
              <div className="airoom-right-title">채팅 및 Q&amp;A</div>

              <div className="airoom-chatlog">
                {chat.map((c) => (
                  <div
                    key={c.id}
                    className={`airoom-bubble ${c.role === "user" ? "user" : "ai"}`}
                  >
                    {c.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="airoom-debug">roomId: {roomId}</div>
        </div>
      </div>
    </div>
  );
};

export default AiRoomPage;
