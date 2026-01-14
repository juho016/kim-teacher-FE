import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PdfUploadPage.css';

export default function PdfUploadPage() {
  const navigate = useNavigate();

  const handleAnalysis = () => {
    navigate('/pdf-analysis');
  };

  return (
    <div className="pdf-upload-page">
      <div className="upload-container">
        <div className="header-section">
          <div className="icon-wrapper">
            <span style={{ fontSize: '30px' }}>📄</span>
          </div>
          <h1 className="title">PDF 학습 도우미</h1>
          <p className="subtitle">PDF를 업로드하면 AI가 학습을 도와드립니다.</p>
        </div>

        <div className="upload-box">
          <span style={{ fontSize: '40px', marginBottom: '1rem', display: 'block' }}>⬆️</span>
          <p className="upload-text">PDF 파일을 드래그하거나 클릭하세요</p>
          <p className="upload-limit">최대 50MB까지 업로드 가능</p>
          <button className="btn btn-select-file">파일 선택</button>
        </div>

        <div className="action-buttons">
          <button className="btn btn-action" onClick={handleAnalysis}>개념 추출</button>
          <button className="btn btn-action" onClick={handleAnalysis}>Q&A 생성</button>
          <button className="btn btn-action" onClick={handleAnalysis}>퀴즈 생성</button>
        </div>
      </div>
    </div>
  );
}
