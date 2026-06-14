import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/HeaderAuthed.jsx";

export default function CommunityPage() {
  const navigate = useNavigate();

  // --- 상태 관리 ---
  const [activeTab, setActiveTab] = useState("전체");
  const [myStudyGroups, setMyStudyGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 스터디 개설 폼 관련 상태
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    week: "",
    concept: "",
    time: "",
    location: "",
    maxCount: 4
  });

  // --- 백엔드 데이터 로드 ---
  const fetchCommunityData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/community/dashboard');
      if (response.ok) {
        const data = await response.json();
        setMyStudyGroups(data.my_groups || []);
        setAvailableGroups(data.available_groups || []);
      }
    } catch (error) {
      console.error("API 통신 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, []);

  // --- 이벤트 핸들러 ---
  const handleApply = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/community/groups/${groupId}/apply`, {
        method: 'POST',
      });
      if (response.ok) {
        alert("스터디 신청이 완료되었습니다!");
        fetchCommunityData(); // 새로고침 없이 리스트 다시 불러오기
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "신청에 실패했습니다.");
      }
    } catch (error) {
      alert("서버 통신 오류가 발생했습니다.");
    }
  };

  // 폼 입력값 변경 핸들러
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 스터디 개설 제출 핸들러
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/community/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: formData.subject,
          week: formData.week,
          concept: formData.concept,
          time: formData.time,
          location: formData.location,
          max_count: parseInt(formData.maxCount, 10)
        })
      });

      if (response.ok) {
        alert("성공적으로 스터디를 개설했습니다!");
        setIsCreateMode(false); // 폼 닫기
        setFormData({ subject: "", week: "", concept: "", time: "", location: "", maxCount: 4 }); // 폼 초기화
        fetchCommunityData(); // 리스트 갱신
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "개설에 실패했습니다.");
      }
    } catch (error) {
      alert("서버 통신 오류가 발생했습니다.");
    }
  };

  // 과목(subject) 기준 동적 필터 카테고리 생성
  const dynamicCategories = ["전체", ...new Set(availableGroups.map(g => g.subject))];
  const filteredGroups = activeTab === "전체"
    ? availableGroups
    : availableGroups.filter(g => g.subject === activeTab);

  return (
    <>
      <style>{`
        body { margin: 0; font-family: 'Pretendard', sans-serif; background-color: #F3F4F6; }
        .page-container { display: flex; justify-content: center; padding: 40px 20px; min-height: 100vh; }
        .main-card { background: #FFFFFF; border-radius: 16px; width: 100%; max-width: 1100px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        
        .top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; border-bottom: 1px solid #E5E7EB; padding-bottom: 20px; }
        .title-group { display: flex; align-items: center; gap: 16px; }
        .back-btn { background: #F3F4F6; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 1.2rem; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; }
        .back-btn:hover { background: #E5E7EB; }
        .page-title { font-size: 1.8rem; font-weight: 800; color: #111827; margin: 0; }
        
        /* 개설 버튼 */
        .create-btn { background: #3B82F6; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 6px; }
        .create-btn:hover { background: #2563EB; }
        .create-btn.cancel { background: #F3F4F6; color: #4B5563; }
        .create-btn.cancel:hover { background: #E5E7EB; }

        /* --- 스터디 개설 폼 확장 영역 --- */
        .create-form-container { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 30px; margin-bottom: 40px; animation: slideDown 0.3s ease-out; overflow: hidden; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .form-header { margin-bottom: 24px; border-bottom: 1px dashed #CBD5E1; padding-bottom: 16px; }
        .form-title { font-size: 1.3rem; font-weight: 800; color: #0F172A; margin: 0 0 8px 0; }
        .form-sub { font-size: 0.95rem; color: #64748B; margin: 0; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-label { display: block; font-weight: 700; font-size: 0.95rem; color: #334155; margin-bottom: 8px; }
        .form-input { width: 100%; padding: 12px 16px; border: 1px solid #CBD5E1; border-radius: 8px; font-size: 1rem; outline: none; transition: border-color 0.2s; box-sizing: border-box; font-family: inherit; }
        .form-input:focus { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; }
        .btn-submit { background: #111827; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: background 0.2s; }
        .btn-submit:hover { background: #374151; }

        /* 공통 섹션 스타일 */
        .section-title { font-size: 1.3rem; font-weight: 700; color: #111827; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px; }
        .section-title span { color: #3B82F6; }
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
        
        .filter-tabs { display: flex; gap: 10px; margin-bottom: 24px; overflow-x: auto; padding-bottom: 8px; }
        .tab-btn { background: #F3F4F6; border: 1px solid transparent; padding: 8px 16px; border-radius: 20px; color: #4B5563; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .tab-btn:hover { background: #E5E7EB; }
        .tab-btn.active { background: #3B82F6; color: white; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3); }
        
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
        .progress-section { margin-top: auto; padding-top: 16px; }
        .progress-header { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px; font-weight: 600; }
        .count-text { color: #3B82F6; }
        .count-text.full { color: #DC2626; } 
        .progress-bar-bg { width: 100%; height: 8px; background: #F3F4F6; border-radius: 4px; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: #3B82F6; border-radius: 4px; transition: width 0.3s ease; }
        .progress-bar-fill.full { background: #DC2626; }
        .card-footer { padding: 16px 20px; background: #FAFAFA; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; }
        .status-badge { font-size: 0.85rem; font-weight: 700; padding: 6px 12px; border-radius: 6px; }
        .badge-recruiting { background: #EFF6FF; color: #2563EB; }
        .badge-confirmed { background: #DCFCE7; color: #16A34A; }
        .badge-closed { background: #FEE2E2; color: #DC2626; }
        .apply-btn { background: #111827; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .apply-btn:hover { background: #374151; }
        .apply-btn:disabled { background: #D1D5DB; cursor: not-allowed; }
        .loading-text { text-align: center; padding: 50px; color: #6B7280; font-size: 1.1rem; }
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
              <button
                className={`create-btn ${isCreateMode ? 'cancel' : ''}`}
                onClick={() => setIsCreateMode(!isCreateMode)}
              >
                {isCreateMode ? '접기 ↑' : '+ 새 스터디 개설'}
              </button>
            </div>

            {/* --- 스터디 개설 확장 폼 --- */}
            {isCreateMode && (
              <div className="create-form-container">
                <div className="form-header">
                  <h2 className="form-title">🚀 새로운 학습 공동체 만들기</h2>
                  <p className="form-sub">팀원들과 함께 공부할 주제와 일정을 상세히 적어주세요.</p>
                </div>

                <form onSubmit={handleCreateSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">과목명</label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleFormChange} className="form-input" placeholder="예: 데이터베이스" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">해당 주차</label>
                      <input type="text" name="week" value={formData.week} onChange={handleFormChange} className="form-input" placeholder="예: 3주차" required />
                    </div>
                    <div className="form-group full-width">
                      <label className="form-label">핵심 스터디 개념 (주제)</label>
                      <input type="text" name="concept" value={formData.concept} onChange={handleFormChange} className="form-input" placeholder="예: 정규화(Normalization) 과정과 B-Tree 인덱싱" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">모임 시간</label>
                      <input type="text" name="time" value={formData.time} onChange={handleFormChange} className="form-input" placeholder="예: 6월 20일 (토) 14:00" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">모임 장소</label>
                      <input type="text" name="location" value={formData.location} onChange={handleFormChange} className="form-input" placeholder="예: AI공학관 402호" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">최대 모집 인원</label>
                      <input type="number" name="maxCount" value={formData.maxCount} onChange={handleFormChange} className="form-input" min="2" max="20" required />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="create-btn cancel" onClick={() => setIsCreateMode(false)}>취소하기</button>
                    <button type="submit" className="btn-submit">스터디 등록하기</button>
                  </div>
                </form>
              </div>
            )}

            {isLoading ? (
              <div className="loading-text">데이터를 불러오는 중입니다...</div>
            ) : (
              <>
                {/* 나의 신청 내역 섹션 */}
                {myStudyGroups.length > 0 && (
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
                            ✓ 진행 확정
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 새로운 커뮤니티 찾기 섹션 */}
                <section className="discover-section">
                  <h2 className="section-title"><span>🔍</span> 새로운 학습 공동체 찾기</h2>

                  {/* 과목 필터 탭 */}
                  <div className="filter-tabs">
                    {dynamicCategories.map(cat => (
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
                            <div className={`status-badge ${isFull ? 'badge-closed' : (group.isConfirmed ? 'badge-confirmed' : 'badge-recruiting')}`}>
                              {isFull ? '모집 마감' : (group.isConfirmed ? '진행 확정' : '모집 중')}
                            </div>

                            <button
                              className="apply-btn"
                              disabled={isFull}
                              onClick={() => handleApply(group.id)}
                            >
                              {isFull ? '마감됨' : '신청하기'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}