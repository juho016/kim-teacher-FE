import { useNavigate, useLocation } from "react-router-dom";

export default function HeaderAuthed() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="header-authed">
      <div className="header-left">
        <div className="logo-badge">*</div>
        <div className="header-logo">김선생</div>
      </div>

      <nav className="tabs">
        <button
          className={`tab ${isActive("/home-login") ? "active" : ""}`}
          onClick={() => navigate("/home-login")}
          type="button"
        >
          홈

        </button>

        <button
          className={`tab ${isActive("/ai-room") ? "active" : ""}`}
          onClick={() => navigate("/ai-room")}
          type="button"
        >
          AI 학습방
        </button>

        <button
          className={`tab ${isActive("/mypage") ? "active" : ""}`}
          onClick={() => navigate("/mypage")}
          type="button"
        >
          마이페이지
        </button>
      </nav>
    </header>
  );
}
