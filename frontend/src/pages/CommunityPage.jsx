import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/HeaderAuthed.jsx"; // 헤더 경로는 프로젝트에 맞게 확인해주세요

// --- 더미 데이터 설정 ---

// 1. 나의 신청 내역 (진행 확정된 스터디)
const myStudyGroups = [
  {
    id: "m1",
    subject: "컴퓨터구조",
    week: "4주차",
    concept: "캐시 메모리(Cache)와 페이징 기법",
    time: "6월 18일 (목) 18:00 - 20:00",
    location: "AI공학관 402호",
    status: "진행 확정"
  },
  {
    id: "m2",
    subject: "데이터베이스",
    week: "3주차",
    concept: "B-Tree 인덱싱 심화 및 쿼리 최적화",
    time: "6월 20일 (토) 14:00 - 17:00",
    location: "자작나무 라운지 - 스터디룸2",
    status: "진행 확정"
  }
];

// 2. 모집 중인 학습 공동체 목록
const availableGroups = [
  {
    id: "a1",
    subject: "알고리즘",
    week: "5주차",
    concept: "Dijkstra & A* 최단경로 알고리즘",
    leader: "주호",
    currentCount: 5,
    maxCount: 8,
    time: "6월 21일 (일) 13:00",
    location: "24시 카페 (정문 앞)",
    isConfirmed: true // 5명 이상 모여서 진행 확정됨
  },
  {
    id: "a2",
    subject: "추천시스템",
    week: "2주차",
    concept: "협업 필터링과 향상도(Lift) 독립성 분석",
    leader: "희준",
    currentCount: 4,
    maxCount: 4,
    time: "6월 22일 (월) 19:00",
    location: "중앙도서관 그룹룸 B",
    isConfirmed: true
  },
  {
    id: "a3",
    subject: "데이터베이스",
    week: "1주차",
    concept: "정규화(Normalization) 기초 스터디",
    leader: "희태",
    currentCount: 2,
    maxCount: 6,
    time: "6월 24일 (수) 18:30",
    location: "AI공학관 1층 로비",
    isConfirmed: false // 아직 인원이 적어 모집 중
  },
  {
    id: "a4",
    subject: "컴퓨터구조",
    week: "2주차",
    concept: "ARM 어셈블리와 파이프라인 해부",
    leader: "도윤",
    currentCount: 6,
    maxCount: 8,
    time: "6월 25일 (목) 17:00",
    location: "온라인 (Google Meet)",
    isConfirmed: true
  }
];

// 과목 필터 카테고리
const categories = ["전체", "데이터베이스", "컴퓨터구조", "알고리즘", "추천시스템"];

export default function CommunityPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("전체");

  // 필터링 로직
  const filteredGroups = activeTab === "전체"
    ? availableGroups
    : availableGroups.filter(g => g.subject === activeTab);

  return (
    <>
      {/* --- 스타일 영역 (단일 파일로 깔끔하게 렌더링) --- */}
      <style>{`
        body { margin: 0; font-family: 'Pretendard', sans-serif; background-color: #F3F4F6; }
        .page-container { display: flex; justify-content: center; padding: 40px 20px; min-height: 100vh; }
        .main-card { background: #FFFFFF; border-radius: 16px; width: 100%; max-width: 1100px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        
        /* 상단 헤더 */
        .top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; border-bottom: 1px solid #E5E7EB; padding-bottom: 20px; }
        .title-group { display: flex; align-items: center; gap: 16px; }
        .back-btn { background: #F3F4F6; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 1.2rem; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; }
        .back-btn:hover { background: #E5E7EB; }
        .page-title { font-size: 1.8rem; font-weight: 800; color: #111827; margin: 0; }
        .create-btn { background: #3B82F6; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
        .create-btn:hover { background: #2563EB; }

        /* 공통 섹션 타이틀 */
        .section-title { font-size: 1.3rem; font-weight: 700; color: #111827; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px; }
        .section-title span { color: #3B82F6; }

        /* 나의 신청 내역 (가로형 리스트) */
        .my-groups-section { margin-bottom: 50px; }
        .my-group-card { border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; background: #FAFAFA; transition: border-color 0.2s; }
        .my-group-card:hover { border-color: #3B82F6; background: #FFFFFF; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.05); }
        .my-group-info { display: flex; flex-direction: column; gap: 6px; }
        .my-group-meta { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; }
        .subject-badge { background: #EFF6FF; color: #2563EB; padding: 4px 8px; border-radius: 6px; font-weight: 700; }
        .week-text { color: #6B7280; font-weight: 600; }
        .concept-title { font-size: 1.15rem; font-weight: 700; color: #111827; margin: 4px 0; }
        .details-row { display: flex; gap: 20px; color: #4B5563; font-size: 0.95rem; }
        .details-row span { display: flex; align-items: center; gap: 6px; }
        .status-confirmed { background: #DCFCE7; color: #16A34A; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 0.95rem; border: 1px solid #BBF7D0; }

        /* 필터 탭 */
        .filter-tabs { display: flex; gap: 10px; margin-bottom: 24px; overflow-x: auto; padding-bottom: 8px; }
        .tab-btn { background: #F3F4F6; border: 1px solid transparent; padding: 8px 16px; border-radius: 20px; color: #4B5563; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .tab-btn:hover { background: #E5E7EB; }
        .tab-btn.active { background: #3B82F6; color: white; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3); }

        /* 그리드 레이아웃 (새로운 공동체 찾기) */
        .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .group-card { background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 14px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; display: flex; flex-direction: column; cursor: pointer; }
        .group-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-color: #D1D5DB; }
        
        .card-header { padding: 20px 20px 16px; border-bottom: 1px dashed #E5E7EB; }
        .card-header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .leader-info { font-size: 0.9rem; color: #6B7280; display: flex; align-items: center; gap: 6px; }
        .leader-avatar { width: 24px; height: 24px; background: #E5E7EB; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; color: #4B5563; }
        .card-title { font-size: 1.15rem; font-weight: 700; color: #111827; margin: 0 0 8px 0; line-height: 1.4; }
        
        .card-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; flex-grow: 1; }
        .info-line { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; color: #4B5563; }
        .icon { opacity: 0.7; }

        /* 인원 프로그레스 바 영역 */
        .progress-section { margin-top: auto; padding-top: 16px; }
        .progress-header { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px; font-weight: 600; }
        .count-text { color: #3B82F6; }
        .count-text.full { color: #DC2626; } /* 꽉 찼을 때 빨간색 */
        .progress-bar-bg { width: 100%; height: 8px; background: #F3F4F6; border-radius: 4px; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: #3B82F6; border-radius: 4px; transition: width 0.3s ease; }
        .progress-bar-fill.full { background: #DC2626; }

        /* 카드 하단 버튼 및 배지 영역 */
        .card-footer { padding: 16px 20px; background: #FAFAFA; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; }
        .status-badge { font-size: 0.85rem; font-weight: 700; padding: 6px 12px; border-radius: 6px; }
        .badge-recruiting { background: #EFF6FF; color: #2563EB; }
        .badge-confirmed { background: #DCFCE7; color: #16A34A; }
        .badge-closed { background: #FEE2E2; color: #DC2626; }
        
        .apply-btn { background: #111827; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .apply-btn:hover { background: #374151; }
        .apply-btn:disabled { background: #D1D5DB; cursor: not-allowed; }
      `}</style>

      <div className="page-container">
        <div className="main-card">
          <Header />

          <main className="content">
            {/* 상단 타이틀 영역 */}
            <div className="top-row">
              <div className="title-group">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h1 className="page-title">학습 커뮤니티</h1>
              </div>
              <button className="create-btn">+ 새 스터디 개설</button>
            </div>

            {/* 나의 신청 내역 섹션 */}
            <section className="my-groups-section">
              <h2 className="section-title"><span>📝</span> 나의 스터디 일정</h2>
              <div className="my-groups-list">
                {myStudyGroups.map(group => (
                  <div key={group.id} className="my-group-card">
                    <div className="my-group-info">
                      <div className="my-group-meta">
                        <span className="subject-badge">{group.subject}</span>
                        <span className="week-text">{group.week}</span>
                      </div>
                      <h3 className="concept-title">{group.concept}</h3>
                      <div className="details-row">
                        <span>🗓️ {group.time}</span>
                        <span>📍 {group.location}</span>
                      </div>
                    </div>
                    <div className="status-confirmed">
                      ✓ {group.status}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 새로운 커뮤니티 찾기 섹션 */}
            <section className="discover-section">
              <h2 className="section-title"><span>🔍</span> 새로운 학습 공동체 찾기</h2>

              {/* 과목 필터 탭 */}
              <div className="filter-tabs">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
                    onClick={() => setActiveTab(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 스터디 모집 카드 그리드 */}
              <div className="grid-container">
                {filteredGroups.map(group => {
                  const isFull = group.currentCount >= group.maxCount;
                  const percent = (group.currentCount / group.maxCount) * 100;

                  return (
                    <div key={group.id} className="group-card">
                      <div className="card-header">
                        <div className="card-header-top">
                          <span className="subject-badge">{group.subject} · {group.week}</span>
                          <div className="leader-info">
                            <div className="leader-avatar">{group.leader.charAt(0)}</div>
                            {group.leader}
                          </div>
                        </div>
                        <h3 className="card-title">{group.concept}</h3>
                      </div>

                      <div className="card-body">
                        <div className="info-line">
                          <span className="icon">🕒</span> {group.time}
                        </div>
                        <div className="info-line">
                          <span className="icon">📍</span> {group.location}
                        </div>

                        {/* 모집 인원 프로그레스 바 */}
                        <div className="progress-section">
                          <div className="progress-header">
                            <span className="progress-label">모집 인원</span>
                            <span className={`count-text ${isFull ? 'full' : ''}`}>
                              {group.currentCount} / {group.maxCount}명
                            </span>
                          </div>
                          <div className="progress-bar-bg">
                            <div
                              className={`progress-bar-fill ${isFull ? 'full' : ''}`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="card-footer">
                        {/* 상태 배지 로직 */}
                        <div className={`status-badge ${isFull ? 'badge-closed' : (group.isConfirmed ? 'badge-confirmed' : 'badge-recruiting')}`}>
                          {isFull ? '모집 마감' : (group.isConfirmed ? '진행 확정' : '모집 중')}
                        </div>

                        <button className="apply-btn" disabled={isFull}>
                          {isFull ? '마감됨' : '신청하기'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </main>
        </div>
      </div>
    </>
  );
}