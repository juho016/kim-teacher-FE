import React from "react";
import HeaderAuthed from "../components/layout/HeaderAuthed";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";


const courses = [
  { id: "db", title: "데이터베이스", last: "2일 전", total: 8, done: 5, rate: 78 },
  { id: "ds", title: "자료구조", last: "5일 전", total: 16, done: 5, rate: 31 },
  { id: "os", title: "컴퓨터 구조", last: "2일 전", total: 20, done: 1, rate: 5 },
  { id: "tech", title: "테크기업경영", last: "2일 전", total: 8, done: 7, rate: 99 },
  { id: "algo", title: "알고리즘", last: "10일 전", total: 8, done: 4, rate: 50 },
  { id: "drone", title: "드론과 로보틱스", last: "2일 전", total: 8, done: 5, rate: 78 },
  { id: "ml", title: "머신러닝", last: "2일 전", total: 8, done: 8, rate: 100, doneAll: true },
];

function CourseProgressCard({ course, onClick }) {
  return (
    <button
      className={`mypage-progress-card ${course.doneAll ? "is-done" : ""}`}
      onClick={onClick}
    >
      <div className="mypage-progress-meta">
        <div className="mypage-progress-dotlist">
          <div>· 목표 교안 갯수: {course.total}</div>
          <div>· 진행 교안 수: {course.done}</div>
          <div>· 전체 진도율: {course.rate}%</div>
        </div>
      </div>

      <div className="mypage-progress-bar">
        <div className="mypage-progress-bar-fill" style={{ width: `${course.rate}%` }} />
      </div>

      <div className="mypage-progress-bottom">
        <div className="mypage-progress-title">{course.title}</div>
        <div className="mypage-progress-last">마지막 학습: {course.last}</div>
      </div>

      {course.doneAll && <div className="mypage-progress-check">✓</div>}
    </button>
  );
}

export default function MyPageProgressStatusPage() {
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
            <div className="mypage-back-title">학습 진도 현황</div>
          </div>

          <div className="mypage-progress-grid">
            {courses.map((c) => (
              <CourseProgressCard
                key={c.id}
                course={c}
                onClick={() => navigate(`/mypage/progress-status/${c.id}`)}
              />
            ))}

            <button className="mypage-progress-card mypage-addcard" onClick={() => alert("추후 구현")}>
              <div className="mypage-addcard-text">진도 기록 등록하기</div>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
