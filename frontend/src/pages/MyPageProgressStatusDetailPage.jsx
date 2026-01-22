import React from "react";
import HeaderAuthed from "../components/layout/HeaderAuthed";
import { useNavigate, useParams } from "react-router-dom";
import "./MyPage.css";


const courseNameMap = {
  ml: "머신러닝",
  db: "데이터베이스",
  ds: "자료구조",
  os: "컴퓨터 구조",
  tech: "테크기업경영",
  algo: "알고리즘",
  drone: "드론과 로보틱스",
};

export default function MyPageProgressStatusDetailPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const title = courseNameMap[courseId] ?? "과목";

  return (
    <div className="page-container">
      <div className="main-card">
        <HeaderAuthed />

        <main className="mypage-sub">
          <div className="mypage-backline">
            <button className="mypage-back" onClick={() => navigate(-1)}>
              ←
            </button>
            <div className="mypage-back-title">{title} 진도 상세</div>
          </div>

          <div className="mypage-detail-wrap">
            <div className="mypage-detail-left">
              <div className="mypage-detail-badge">✓ {title} 교안 학습 완료!</div>

              <div className="mypage-detail-chip">교안 유형 : 예제 중심 개념설명</div>

              <div className="mypage-detail-stats">
                <div className="mypage-detail-stat">
                  <div className="label">목표</div>
                  <div className="value">12</div>
                </div>
                <div className="mypage-detail-stat">
                  <div className="label">완료</div>
                  <div className="value">24</div>
                </div>
                <div className="mypage-detail-stat">
                  <div className="label">학습량</div>
                  <div className="value">119</div>
                </div>
              </div>

              <div className="mypage-detail-card">
                <div className="mypage-detail-card-title">성장한 학습 과목</div>
                <ul className="mypage-detail-list">
                  <li>✅ 핵심 개념 학습</li>
                  <li>✅ 연습 문제</li>
                  <li>✅ 학습 리포트</li>
                </ul>
              </div>
            </div>

            <div className="mypage-detail-right">
              <div className="mypage-detail-panel-title">🔥 교안 구조 분석</div>

              <div className="mypage-detail-panel">
                <div className="mypage-detail-panel-section">
                  <div className="sec-title">1. 추천 교안 (1p ~ 10p)</div>
                  <div className="sec-item">- 추천 교안: 기본 개념 정리</div>
                </div>

                <div className="mypage-detail-panel-section">
                  <div className="sec-title">2. 핵심 설명 (11p ~ 60p)</div>
                  <div className="sec-item">- 예제 기반 설명</div>
                  <div className="sec-item">- 자주 틀리는 포인트 정리</div>
                </div>

                <div className="mypage-detail-panel-section">
                  <div className="sec-title">3. 문제풀이 (61p ~ 120p)</div>
                  <div className="sec-item">- 확인 문제</div>
                  <div className="sec-item">- 심화 문제</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
