import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PdfUploadPage.css';

export default function PdfUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // 상태 관리
  const [file, setFile] = useState(null);
  const [existingCourses, setExistingCourses] = useState([]); // 백엔드에서 불러온 과목 목록
  const [selectedCourse, setSelectedCourse] = useState(""); // 선택된 기존 과목
  const [isNewCourse, setIsNewCourse] = useState(false); // 신규 과목 입력 모드 활성화 여부
  const [newCourseName, setNewCourseName] = useState(""); // 새로 입력한 과목명

  // 페이지 렌더링 시 기존 과목 목록 불러오기
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // 백엔드 API 엔드포인트 (백엔드 파트 참고)
        const response = await fetch('http://localhost:8000/pdf/courses');
        if (response.ok) {
          const data = await response.json();
          setExistingCourses(data.courses || []);
        }
      } catch (error) {
        console.error('과목 목록을 불러오는 중 오류 발생:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // 과목 칩 클릭 핸들러
  const handleCourseSelect = (courseName) => {
    setIsNewCourse(false);
    setSelectedCourse(courseName);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('PDF 파일을 선택하세요.');
      return;
    }

    // 최종 전송할 과목명 결정 및 검증
    const finalCourseName = isNewCourse ? newCourseName.trim() : selectedCourse;
    if (!finalCourseName) {
      alert('과목을 선택하거나 새로 입력해 주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('course_name', finalCourseName); // 과목명 추가

    try {
      const response = await fetch('http://localhost:8000/pdf/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log('업로드 성공:', data);
        navigate(`/pdf-analysis?pdf_id=${data.pdf_id}`);
      } else {
        alert(data.detail || '업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('업로드 오류:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
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

        {/* --- 과목 선택 섹션 --- */}
        <div className="course-section">
          <h3 className="course-title">📚 학습할 과목을 선택하세요</h3>
          <div className="course-chips-container">
            {existingCourses.map((course) => (
              <button
                key={course}
                className={`course-chip ${!isNewCourse && selectedCourse === course ? 'active' : ''}`}
                onClick={() => handleCourseSelect(course)}
              >
                {!isNewCourse && selectedCourse === course && <span className="check-icon">✓</span>}
                {course}
              </button>
            ))}

            <button
              className={`course-chip new-course-btn ${isNewCourse ? 'active' : ''}`}
              onClick={() => {
                setIsNewCourse(true);
                setSelectedCourse("");
              }}
            >
              {isNewCourse && <span className="check-icon">✓</span>}
              + 새 과목 입력
            </button>
          </div>

          {/* 신규 과목 입력창 (모드 활성화 시 표시) */}
          {isNewCourse && (
            <div className="new-course-input-wrapper">
              <input
                type="text"
                className="new-course-input"
                placeholder="새로운 과목명을 입력하세요 (예: 운영체제)"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* --- 파일 업로드 박스 --- */}
        <div className="upload-box" onClick={handleBoxClick}>
          <span style={{ fontSize: '40px', marginBottom: '1rem', display: 'block' }}>⬆️</span>
          <p className="upload-text">PDF 파일을 드래그하거나 클릭하세요</p>
          <p className="upload-limit">최대 50MB까지 업로드 가능</p>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            className="btn btn-select-file"
            onClick={(e) => {
              e.stopPropagation();
              handleBoxClick();
            }}
          >
            파일 선택
          </button>

          <p style={{ marginTop: '1rem', color: '#6B7280', fontWeight: '600' }}>
            {file ? `선택된 파일: ${file.name}` : '선택된 파일 없음'}
          </p>
        </div>

        <div className="action-buttons">
          <button className="btn btn-action" onClick={handleUpload}>개념 추출 시작</button>
        </div>
      </div>
    </div>
  );
}