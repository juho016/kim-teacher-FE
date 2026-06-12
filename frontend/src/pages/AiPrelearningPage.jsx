import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/HeaderAuthed.jsx";

// --- AI가 교안을 분석하여 생성한 예습 브리핑 데이터 ---
// 기반 지식(Prerequisites)을 먼저 깊이 있게 설명하고, 이를 바탕으로 중요 개념(Core)을 짧게 소개합니다.
const aiReportData = {
  subject: "컴퓨터구조",
  lectureTitle: "제 8장. 가상 메모리와 페이징(Paging) 기법",
  introMessage: "오늘 수업은 운영체제와 컴퓨터구조의 꽃이라 불리는 '메모리 관리'를 다룹니다. 교수님의 설명을 완벽히 소화하기 위해, 아래 두 가지 기반 지식을 먼저 확실히 다지고 넘어가세요.",

  // 1. 수업을 듣기 위해 필요한 기반 지식 (충분한 설명)
  prerequisites: [
    {
      id: 1,
      title: "기반 지식 1. 물리 주소(Physical)와 논리 주소(Logical)",
      content: "프로그램이 실행될 때 CPU가 바라보는 주소(논리 주소)와 실제 RAM 하드웨어에 꽂혀 있는 주소(물리 주소)는 엄연히 다릅니다. 과거에는 프로그램이 물리 주소에 직접 접근했지만, 여러 프로그램을 동시에 실행하는 현대 시스템에서는 메모리 충돌을 막기 위해 주소 공간을 가상으로 분리합니다. 오늘 수업에서는 CPU가 생성한 가짜 주소(논리)가 어떻게 메모리 관리 장치(MMU)를 거쳐 진짜 주소(물리)로 변환되는지 그 메커니즘을 이해하는 것이 첫 번째 관건입니다."
    },
    {
      id: 2,
      title: "기반 지식 2. 메모리 단편화(Fragmentation)의 늪",
      content: "메모리에 여러 프로그램을 올리고 내리다 보면, 빈 공간들이 조각조각 흩어지게 됩니다. 전체 남은 공간은 100MB인데, 정작 50MB짜리 프로그램 하나를 통째로 올릴 '연속된 빈 공간'이 없어 실행하지 못하는 억울한 상황을 '외부 단편화'라고 합니다. 반대로 공간을 일정한 크기로 미리 쪼개어 할당했을 때, 프로그램이 그 공간을 다 쓰지 못하고 남겨버리는 낭비를 '내부 단편화'라고 합니다. 오늘 배울 기술은 바로 이 지긋지긋한 단편화 문제를 해결하기 위해 인류가 고안해 낸 마법 같은 방법입니다."
    }
  ],

  // 2. 오늘 배울 핵심 개념 (기반 지식을 바탕으로 짧고 명확하게)
  coreConcept: {
    title: "🎯 오늘 배울 핵심 개념 : 페이징(Paging)",
    content: "위에서 살펴본 '외부 단편화' 문제를 해결하기 위해 오늘 교수님께서는 '페이징(Paging)' 기법을 소개하실 겁니다. 프로세스의 주소 공간을 '페이지(Page)'라는 일정한 크기로 잘게 쪼개고, 실제 물리 메모리도 '프레임(Frame)'이라는 같은 크기로 쪼개어, 연속적이지 않은 빈 공간 아무 곳에나 프로세스를 흩뿌려 저장할 수 있게 만드는 혁신적인 기술입니다. 주소가 어떻게 1:1로 매핑되는지 그 원리만 파악하시면 오늘 수업은 완벽합니다."
  }
};

export default function AiPrelearningPage() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState("upload");

  const handleFileUpload = (e) => {
    e.preventDefault();
    setPageState("analyzing");
    setTimeout(() => {
      setPageState("result");
    }, 1500);
  };

  return (
    <>
      <style>{`
        body { margin: 0; font-family: 'Pretendard', -apple-system, sans-serif; background-color: #F8FAFC; }
        .page-container { display: flex; justify-content: center; padding: 40px 20px; min-height: 100vh; }
        .main-card { background: #FFFFFF; border-radius: 16px; width: 100%; max-width: 850px; padding: 40px 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
        
        /* 헤더 영역 */
        .top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; border-bottom: 1px solid #F1F5F9; padding-bottom: 20px; }
        .title-group { display: flex; align-items: center; gap: 16px; }
        .back-btn { background: white; border: 1px solid #E2E8F0; border-radius: 50%; width: 40px; height: 40px; font-size: 1.2rem; cursor: pointer; transition: all 0.2s; color: #475569; display: flex; align-items: center; justify-content: center; }
        .back-btn:hover { background: #F1F5F9; color: #0F172A; }
        .page-title { font-size: 1.6rem; font-weight: 800; color: #0F172A; margin: 0; }
        
        /* 업로드 상태 스타일 */
        .upload-section { margin-top: 40px; }
        .upload-title { font-size: 1.5rem; font-weight: 800; color: #0F172A; margin-bottom: 12px; }
        .upload-sub { color: #64748B; font-size: 1.05rem; margin-bottom: 30px; line-height: 1.6; }
        .upload-box { border: 2px dashed #CBD5E1; border-radius: 16px; padding: 80px 20px; text-align: center; background-color: #F8FAFC; cursor: pointer; transition: all 0.3s; }
        .upload-box:hover { border-color: #3B82F6; background-color: #EFF6FF; }
        .upload-icon { font-size: 4rem; margin-bottom: 20px; color: #94A3B8; }
        .btn-upload { background: #0F172A; color: white; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 1.05rem; cursor: pointer; transition: background 0.2s; }
        .btn-upload:hover { background: #334155; }

        /* 로딩 상태 스타일 */
        .loading-section { text-align: center; padding: 120px 0; }
        .spinner { border: 4px solid #F1F5F9; border-top: 4px solid #3B82F6; border-radius: 50%; width: 56px; height: 56px; animation: spin 1s linear infinite; margin: 0 auto 24px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .loading-text { font-size: 1.3rem; font-weight: 700; color: #0F172A; margin-bottom: 12px; }
        .loading-sub { color: #64748B; font-size: 1.05rem; }

        /* 예습 리포트 공통 애니메이션 */
        .report-section { animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        
        /* 리포트 상단 타이틀 */
        .report-header { margin-bottom: 40px; }
        .badge-subject { display: inline-block; background: #EFF6FF; color: #2563EB; padding: 6px 12px; border-radius: 6px; font-size: 0.9rem; font-weight: 700; margin-bottom: 16px; border: 1px solid #BFDBFE; }
        .lecture-title { font-size: 1.8rem; font-weight: 800; color: #0F172A; margin: 0 0 16px 0; line-height: 1.4; }
        .intro-message { font-size: 1.05rem; color: #475569; line-height: 1.6; margin: 0; }

        /* 1. 기반 지식 영역 (어두운 테마로 몰입감 부여) */
        .prereq-container { display: flex; flex-direction: column; gap: 24px; margin-bottom: 50px; }
        .prereq-card { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 28px; border-radius: 12px; border-left: 4px solid #64748B; }
        .prereq-title { font-size: 1.25rem; font-weight: 800; color: #1E293B; margin: 0 0 12px 0; }
        .prereq-content { font-size: 1.05rem; color: #334155; line-height: 1.8; margin: 0; letter-spacing: -0.3px; text-align: justify; }

        /* 2. 오늘 배울 핵심 개념 영역 (밝고 강조된 테마) */
        .core-container { background: #EFF6FF; border: 1px solid #BFDBFE; padding: 32px; border-radius: 12px; margin-bottom: 40px; position: relative; }
        .core-title { font-size: 1.4rem; font-weight: 800; color: #1E3A8A; margin: 0 0 16px 0; }
        .core-content { font-size: 1.1rem; color: #1E40AF; line-height: 1.7; margin: 0; font-weight: 500; letter-spacing: -0.3px; text-align: justify; }

        /* 하단 액션 버튼 */
        .action-row { display: flex; justify-content: flex-end; gap: 16px; border-top: 1px solid #F1F5F9; padding-top: 30px; }
        .btn-outline { background: white; border: 1px solid #CBD5E1; color: #475569; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 1rem; }
        .btn-outline:hover { background: #F8FAFC; border-color: #94A3B8; color: #0F172A; }
        .btn-primary { background: #3B82F6; border: none; color: white; padding: 12px 32px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; font-size: 1rem; }
        .btn-primary:hover { background: #2563EB; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
      `}</style>

      <div className="page-container">
        <div className="main-card">
          <Header />

          <main className="content">
            <div className="top-row">
              <div className="title-group">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h1 className="page-title">AI 10분 예습 브리핑</h1>
              </div>
            </div>

            {/* 교안 업로드 화면 */}
            {pageState === "upload" && (
              <section className="upload-section">
                <h2 className="upload-title">수업 전 꼭 알아야 할 기반 지식, AI가 정리해 드립니다.</h2>
                <p className="upload-sub">
                  교수님의 교안(PDF, PPT)을 업로드하면, 수업 내용을 완벽히 이해하기 위해<br/>
                  미리 알고 있어야 할 선수 지식과 오늘의 핵심 개념을 연결하여 브리핑해 드립니다.
                </p>

                <div className="upload-box" onClick={handleFileUpload}>
                  <div className="upload-icon">📚</div>
                  <h3 style={{ fontSize: '1.2rem', color: '#0F172A', margin: '0 0 12px 0' }}>교안 파일을 이곳에 드래그 앤 드롭하세요</h3>
                  <button className="btn-upload">파일 선택하기</button>
                </div>
              </section>
            )}

            {/* 로딩 화면 */}
            {pageState === "analyzing" && (
              <section className="loading-section">
                <div className="spinner"></div>
                <div className="loading-text">교안의 흐름과 필수 기반 지식을 매핑하고 있습니다...</div>
                <div className="loading-sub">잠시만 기다려주세요. (약 5초 소요)</div>
              </section>
            )}

            {/* 예습 브리핑 결과 화면 */}
            {pageState === "result" && (
              <section className="report-section">
                <div className="report-header">
                  <span className="badge-subject">{aiReportData.subject}</span>
                  <h2 className="lecture-title">{aiReportData.lectureTitle}</h2>
                  <p className="intro-message">{aiReportData.introMessage}</p>
                </div>

                {/* 1. 기반 지식 (자세한 설명) */}
                <div className="prereq-container">
                  {aiReportData.prerequisites.map((item) => (
                    <div key={item.id} className="prereq-card">
                      <h3 className="prereq-title">{item.title}</h3>
                      <p className="prereq-content">{item.content}</p>
                    </div>
                  ))}
                </div>

                {/* 2. 오늘 배울 핵심 개념 (결론부, 눈에 띄게 강조) */}
                <div className="core-container">
                  <h3 className="core-title">{aiReportData.coreConcept.title}</h3>
                  <p className="core-content">{aiReportData.coreConcept.content}</p>
                </div>

                {/* 하단 액션 버튼 */}
                <div className="action-row">
                  <button className="btn-outline" onClick={() => setPageState("upload")}>다른 교안 업로드</button>
                  <button className="btn-primary" onClick={() => alert("본 학습 공간으로 이동합니다.")}>
                    예습 완료 (본 학습 시작하기)
                  </button>
                </div>
              </section>
            )}

          </main>
        </div>
      </div>
    </>
  );
}