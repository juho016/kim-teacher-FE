import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PdfAnalysisResultPage.css';

// SVG Icons components to replace lucide-react
const CheckCircle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const FileText = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const Lightbulb = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="9" y1="18" x2="15" y2="18"></line>
    <line x1="10" y1="22" x2="14" y2="22"></line>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 16.5 8 4.5 4.5 0 0 0 12 3.5 4.5 4.5 0 0 0 7.5 8c0 1.68.73 2.85 1.5 3.5.76.76 1.23 1.52 1.41 2.5"></path>
  </svg>
);

const GraduationCap = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

const ChevronRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const Check = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const Star = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const ArrowRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const structureData = [
  {
    id: 1,
    title: "1. 추천 시스템 개요 (1p ~ 10p)",
    children: [
      { id: 11, title: "추천 시스템 가치·프로세스·평점 행렬 소개 (1p ~ 9p)", type: "concept" }
    ]
  },
  {
    id: 2,
    title: "2. 협업 필터링 (11p ~ 115p)",
    children: [
      { id: 21, title: "메모리 기반 CF (user-based / item-based) (16p ~ 60p)", type: "concept" },
      { id: 22, title: "예제 1 : User-based (21p ~ 39p)", type: "example" },
      { id: 23, title: "예제 2 : Item-based CF (45p ~ 56p)", type: "example" }
    ]
  }
];

export default function PdfAnalysisResultPage() {
  const navigate = useNavigate();

  return (
    <div className="analysis-page">
      <div className="analysis-container">
        
        {/* Left Panel: Summary */}
        <div className="panel summary-panel">
          <div className="summary-header">
            <CheckCircle className="success-icon" />
            <h1 className="summary-title">분석 완료!</h1>
            <p className="file-name">Assignment2.pdf</p>
          </div>

          <div className="type-box">
            <span className="type-label">교안 유형 :</span>
            <span className="type-value">예제 중심 개념설명</span>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">개념</span>
              <span className="stat-value blue">12</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">질문</span>
              <span className="stat-value green">24</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">페이지</span>
              <span className="stat-value pink">119</span>
            </div>
          </div>

          <div className="generated-list">
            <h3 className="list-title">생성된 학습 자료</h3>
            <div className="list-item clickable" onClick={() => navigate('/concept')}>
              <div className="item-left">
                <FileText className="item-icon" />
                <span>핵심 개념 추출</span>
              </div>
              <Check className="check-icon" />
            </div>
            <div className="list-item">
              <div className="item-left">
                <Lightbulb className="item-icon" />
                <span>Q&A 생성</span>
              </div>
              <Check className="check-icon" />
            </div>
            <div className="list-item">
              <div className="item-left">
                <GraduationCap className="item-icon" />
                <span>학습 퀴즈</span>
              </div>
              <Check className="check-icon" />
            </div>
          </div>

          <button className="btn-start-learning" onClick={() => navigate('/concept')}>
            <span>학습 시작하기</span>
            <ArrowRight className="btn-icon" />
          </button>
        </div>

        {/* Right Panel: Structure Analysis */}
        <div className="panel structure-panel">
          <div className="structure-header">
            <Star className="star-icon" />
            <h2 className="structure-title">교안 구조 분석</h2>
          </div>

          <div className="structure-content">
            {structureData.map((chapter) => (
              <div key={chapter.id} className="chapter-item">
                <div className="chapter-title">{chapter.title}</div>
                {chapter.children && (
                  <div className="chapter-children">
                    {chapter.children.map((child) => (
                      <div key={child.id} className="child-item">
                        {child.type === 'concept' ? (
                          <Lightbulb className="child-icon concept" />
                        ) : (
                          <div className="child-icon-placeholder"></div>
                        )}
                        <span className="child-text">{child.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
