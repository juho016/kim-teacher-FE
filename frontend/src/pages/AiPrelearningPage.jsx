import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/HeaderAuthed.jsx";

export default function AiPrelearningPage() {
  const navigate = useNavigate();
  const [briefing, setBriefing] = useState(null);

  // 상태 관리: 'upload' (업로드 전) -> 'analyzing' (분석 중) -> 'result' (결과 완료) -> 'error' (실패)
  const [pageState, setPageState] = useState("upload");
  const [errorMessage, setErrorMessage] = useState("");

  // 파일 업로드 및 백엔드(FastAPI) 전송 로직
  const handleFileUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    setPageState("analyzing");

    const formData = new FormData();
    formData.append("file", file); // 백엔드에서 받을 파라미터 이름 ('file'을 확인하세요)

    try {
      // 캡처해주신 로그의 POST 주소로 전송합니다.
      // (프록시 설정에 따라 앞부분 도메인이 필요할 수 있습니다. ex: 'http://localhost:8000/prelearning/briefing-from-pdf')
      const response = await fetch('/api/prelearning/briefing-from-pdf', {
  method: 'POST',
  body: formData,
});

      if (!response.ok) {
        throw new Error(`서버 에러가 발생했습니다. (상태 코드: ${response.status})`);
      }

      const data = await response.json();
      setBriefing(data);
      setPageState("result");

    } catch (err) {
      setErrorMessage(err.message);
      setPageState("error");
    }
  };

  return (
    <>
      <style>{`
        body { margin: 0; font-family: 'Pretendard', sans-serif; background-color: #F8FAFC; }
        .page-container { display: flex; justify-content: center; padding: 40px 20px; min-height: 100vh; }
        .main-card { background: #FFFFFF; border-radius: 16px; width: 100%; max-width: 850px; padding: 40px 50px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        
        .top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; border-bottom: 1px solid #F1F5F9; padding-bottom: 20px; }
        .back-btn { background: white; border: 1px solid #E2E8F0; border-radius: 50%; width: 40px; height: 40px; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #475569; }
        .page-title { font-size: 1.6rem; font-weight: 800; color: #0F172A; margin: 0; margin-left: 16px; flex-grow: 1; }
        
        /* 업로드 섹션 */
        .upload-box { border: 2px dashed #CBD5E1; border-radius: 16px; padding: 70px 20px; text-align: center; background-color: #F8FAFC; position: relative; transition: all 0.3s; }
        .upload-box:hover { border-color: #3B82F6; background-color: #EFF6FF; }
        .file-input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
        .upload-icon { font-size: 3rem; margin-bottom: 16px; display: block; }
        
        /* 로딩 & 에러 섹션 */
        .status-container { padding: 100px 20px; text-align: center; }
        .spinner { border: 4px solid #F1F5F9; border-top: 4px solid #3B82F6; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        /* 결과 섹션 */
        .content-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .briefing-header { background: #EFF6FF; border: 1px solid #BFDBFE; padding: 24px 30px; border-radius: 12px; margin-bottom: 40px; }
        .course-tag { display: inline-block; background: #DBEAFE; color: #1D4ED8; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px; }
        .lesson-title { font-size: 1.6rem; font-weight: 800; color: #1E3A8A; margin: 0; }
        .section-title { font-size: 1.3rem; font-weight: 800; color: #0F172A; margin: 0 0 16px 0; }
        .item-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px;}
        .item-card { background: #FFFFFF; border: 1px solid #E2E8F0; padding: 18px 24px; border-radius: 10px; font-size: 1.05rem; line-height: 1.6; display: flex; gap: 12px; }
        .bg-card .item-card { border-left: 4px solid #64748B; background: #F8FAFC; }
        .core-card .item-card { border-left: 4px solid #3B82F6; }
      `}</style>

      <div className="page-container">
        <div className="main-card">
          <Header />
          <main className="content">
            <div className="top-row">
              <button className="back-btn" onClick={() => navigate(-1)}>←</button>
              <h1 className="page-title">AI 10분 예습</h1>
            </div>

            {/* 1. PDF 업로드 화면 */}
            {pageState === "upload" && (
              <div className="upload-box">
                <span className="upload-icon">📄</span>
                <h3 style={{ margin: '0 0 8px 0', color: '#0F172A' }}>분석할 교안(PDF)을 선택해주세요</h3>
                <p style={{ color: '#64748B', margin: 0 }}>클릭하여 파일을 업로드하면 AI 분석이 시작됩니다.</p>
                {/* 파일 선택 시 handleFileUpload 함수 실행 */}
                <input type="file" accept=".pdf" className="file-input" onChange={handleFileUpload} />
              </div>
            )}

            {/* 2. 로딩 화면 */}
            {pageState === "analyzing" && (
              <div className="status-container">
                <div className="spinner"></div>
                <h3 style={{ color: '#0F172A' }}>교안을 백엔드로 전송하여 분석 중입니다...</h3>
                <p style={{ color: '#64748B' }}>기반 지식과 핵심 개념을 추출하고 있습니다.</p>
              </div>
            )}

            {/* 3. 에러 화면 */}
            {pageState === "error" && (
              <div className="status-container">
                <h3 style={{ color: '#EF4444' }}>오류가 발생했습니다</h3>
                <p>{errorMessage}</p>
                <button onClick={() => setPageState("upload")} style={{ padding: '8px 16px', marginTop: '10px' }}>다시 시도</button>
              </div>
            )}

            {/* 4. 결과 화면 */}
            {pageState === "result" && briefing && (
              <div className="content-fade-in">
                <div className="briefing-header">
                  <span className="course-tag">{briefing.courseTitle}</span>
                  <h2 className="lesson-title">{briefing.lessonTitle}</h2>
                </div>

                <section className="bg-card">
                  <h3 className="section-title">📚 필수 기반 지식 체크</h3>
                  <ul className="item-list">
                    {briefing.backgroundKnowledge.map((item, idx) => (
                      <li key={idx} className="item-card"><span>{item}</span></li>
                    ))}
                  </ul>
                </section>

                <section className="core-card">
                  <h3 className="section-title">🎯 오늘 배울 핵심 개념</h3>
                  <ul className="item-list">
                    {briefing.keyConcepts.map((item, idx) => (
                      <li key={idx} className="item-card"><span>{item}</span></li>
                    ))}
                  </ul>
                </section>
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
}