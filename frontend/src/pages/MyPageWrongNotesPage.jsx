import React from "react";
import HeaderAuthed from "../components/layout/HeaderAuthed";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";


const courses = [
  { id: "db", title: "데이터베이스", last: "2일 전", qna: 10, wrong: 6, done: 2 },
  { id: "ds", title: "자료구조", last: "2일 전", qna: 24, wrong: 6, done: 6, highlight: true },
  { id: "tech", title: "테크기업경영", last: "2일 전", qna: 30, wrong: 6, done: 5 },
  { id: "algo", title: "알고리즘", last: "2일 전", qna: 14, wrong: 6, done: 3 },
  { id: "drone", title: "드론과 로보틱스", last: "2일 전", qna: 15, wrong: 6, done: 1 },
  { id: "oop", title: "객체지향 프로그래밍", last: "2일 전", qna: 20, wrong: 6, done: 2 },
];

function WrongNoteCard({ c, onClick }) {
  return (
    <button className={`mypage-wrong-card ${c.highlight ? "is-highlight" : ""}`} onClick={onClick}>
      <div className="mypage-wrong-top">
        <div className="mypage-wrong-pill">✔ 생성 Q&A</div>
        <div className="mypage-wrong-pill">⭕ 오답 Q&A</div>
        <div className="mypage-wrong-pill">✨ 오답 리뷰 완료</div>
      </div>

      <div className="mypage-wrong-meta">
        <div>생성 Q&A : {c.qna}개</div>
        <div>오답 Q&A : {c.wrong}개</div>
        <div>오답 리뷰 완료 : {c.done}개</div>
      </div>

      <div className="mypage-wrong-bottom">
        <div className="mypage-wrong-title">{c.title}</div>
        <div className="mypage-wrong-last">마지막 학습: {c.last}</div>
      </div>

      {c.highlight && <div className="mypage-wrong-check">✓</div>}
    </button>
  );
}

export default function MyPageWrongNotesPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="main-card">
        <HeaderAuthed />

        <main className="mypage-sub">
          <div className="mypage-backline">
            <button className="mypage-back" onClick={() => navigate(-1)}>
              ←
            </button>
            <div className="mypage-back-title">오답 노트 관리</div>
          </div>

          <div className="mypage-wrong-grid">
            {courses.map((c) => (
              <WrongNoteCard key={c.id} c={c} onClick={() => alert("추후 연결")} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
