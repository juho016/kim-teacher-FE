import React from "react";
import HeaderAuthed from "../components/layout/HeaderAuthed";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";


const menusLeft = [
  { key: "progress", title: "학습 진도 현황", path: "/mypage/progress-status", icon: "📈" },
  { key: "wrong", title: "오답 노트 관리", path: "/mypage/wrong-notes", icon: "📝" },
  { key: "report", title: "취약점 분석 리포트", path: "/mypage/progress-status", icon: "📊" }, // 임시 연결
  { key: "style", title: "학습 스타일 분석", path: "/mypage/progress-status", icon: "🧠" }, // 임시 연결
];

const menusRight = [
  { key: "profile", title: "프로필 관리", path: "/mypage", icon: "👤" },
  { key: "goal", title: "학습 목표 설정", path: "/mypage", icon: "🎯" },
  { key: "lang", title: "언어 설정", path: "/mypage", icon: "🌐" },
  { key: "alarm", title: "알림 설정", path: "/mypage", icon: "🔔" },
];

function MenuCard({ icon, title, onClick }) {
  return (
    <button className="mypage-menu-card" onClick={onClick}>
      <div className="mypage-menu-left">
        <div className="mypage-menu-icon">{icon}</div>
        <div className="mypage-menu-title">{title}</div>
      </div>
      <div className="mypage-menu-arrow">→</div>
    </button>
  );
}

export default function MyPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="main-card">
        <HeaderAuthed />

        <main className="mypage-main">
          <div className="mypage-backline">
            <button className="mypage-back" onClick={() => navigate(-1)}>
              ←
            </button>
            <div className="mypage-back-title">마이페이지</div>
          </div>

          <div className="mypage-grid">
            <div className="mypage-col">
              {menusLeft.map((m) => (
                <MenuCard
                  key={m.key}
                  icon={m.icon}
                  title={m.title}
                  onClick={() => navigate(m.path)}
                />
              ))}
            </div>

            <div className="mypage-col">
              {menusRight.map((m) => (
                <MenuCard
                  key={m.key}
                  icon={m.icon}
                  title={m.title}
                  onClick={() => navigate(m.path)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
