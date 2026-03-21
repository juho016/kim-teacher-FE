import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_BASE = 'http://localhost:8000';
const EXAM_DURATION_SECONDS = 20 * 60; // 20분

const formatTime = (seconds) => {
  const safe = Math.max(0, seconds);
  const min = String(Math.floor(safe / 60)).padStart(2, '0');
  const sec = String(safe % 60).padStart(2, '0');
  return `${min}:${sec}`;
};

export default function QuizExamPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const pdfId = searchParams.get('pdf_id');
  const fileName = searchParams.get('file_name') || '전체 퀴즈/시험';

  const [roomId, setRoomId] = useState(localStorage.getItem(`room_id_${pdfId}`) || '');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('AI가 PDF 전체 퀴즈를 생성하는 중입니다...');

  const [userAnswers, setUserAnswers] = useState({});
  const [startTime, setStartTime] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [examStartedAt, setExamStartedAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);

  useEffect(() => {
    if (!pdfId) {
      setLoading(false);
      setMessage('pdf_id가 없습니다.');
      return;
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const ensureLearningRoom = async () => {
      if (roomId) return roomId;

      const response = await fetch(`${API_BASE}/learning-rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdf_id: pdfId, study_goal: 'PDF 전체 퀴즈 풀이' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || '학습방 생성 실패');

      localStorage.setItem(`room_id_${pdfId}`, data.room_id);
      setRoomId(data.room_id);
      return data.room_id;
    };

    const pollQuizzes = async (ensuredRoomId) => {
      for (let i = 0; i < 20; i++) {
        try {
          const response = await fetch(
            `${API_BASE}/pdf/${pdfId}/quizzes?room_id=${ensuredRoomId}`
          );
          const data = await response.json();

          if (response.ok && data.quizzes && data.quizzes.length > 0) {
            setQuizzes(data.quizzes);

            const now = Date.now();
            const startTimes = {};
            data.quizzes.forEach((q) => {
              startTimes[q.quiz_id] = now;
            });
            setStartTime(startTimes);
            setExamStartedAt(now);
            setTimeLeft(EXAM_DURATION_SECONDS);

            setMessage('전체 퀴즈가 생성되었습니다. 문제를 풀어보세요.');
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('전체 퀴즈 조회 실패:', error);
        }

        await sleep(2000);
      }

      setMessage('퀴즈 생성은 시작되었지만 아직 결과가 없습니다.');
      setLoading(false);
    };

    const generateAndFetchQuizzes = async () => {
      try {
        const ensuredRoomId = await ensureLearningRoom();

        const response = await fetch(`${API_BASE}/pdf/${pdfId}/quiz/generate-all`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ room_id: ensuredRoomId }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || '전체 퀴즈 생성 시작 실패');

        setMessage(data.message || '전체 퀴즈 생성 시작됨');
        await pollQuizzes(ensuredRoomId);
      } catch (error) {
        console.error(error);
        setMessage(error.message || '전체 퀴즈 생성 실패');
        setLoading(false);
      }
    };

    generateAndFetchQuizzes();
  }, [pdfId]);

  useEffect(() => {
    if (loading || !examStartedAt || quizResult) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - examStartedAt) / 1000);
      const remain = EXAM_DURATION_SECONDS - elapsed;
      setTimeLeft(remain);

      if (remain <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, examStartedAt, quizResult]);

  useEffect(() => {
    if (!loading && examStartedAt && timeLeft <= 0 && !quizResult && !isSubmitting) {
      handleSubmit(true);
    }
  }, [timeLeft, loading, examStartedAt, quizResult, isSubmitting]);

  const currentQuiz = quizzes[currentIndex];

  const progressPercent = useMemo(() => {
    if (!quizzes.length) return 0;
    return ((currentIndex + 1) / quizzes.length) * 100;
  }, [currentIndex, quizzes]);

  const answeredCount = Object.keys(userAnswers).length;
  const isLastQuestion = currentIndex === quizzes.length - 1;

  const handleAnswerSelect = (quizId, choice) => {
    setUserAnswers((prev) => ({
      ...prev,
      [quizId]: choice,
    }));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(quizzes.length - 1, prev + 1));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!roomId || quizzes.length === 0) return;

    setIsSubmitting(true);

    const submissionData = {
      room_id: roomId,
      answers: quizzes.map((quiz) => ({
        quiz_id: quiz.quiz_id,
        selected_answer: userAnswers[quiz.quiz_id] || '',
        solve_time_seconds: startTime[quiz.quiz_id]
          ? (Date.now() - startTime[quiz.quiz_id]) / 1000
          : 0,
      })),
    };

    try {
      const response = await fetch(`${API_BASE}/quizzes/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        setQuizResult({
          ...data,
          autoSubmitted: autoSubmit,
        });
      } else {
        alert(data.detail || '제출에 실패했습니다.');
      }
    } catch (error) {
      console.error('제출 오류:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#081228',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Pretendard, sans-serif',
        }}
      >
        {message}
      </div>
    );
  }

  if (quizResult) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#081228',
          color: '#fff',
          padding: '40px 20px',
          fontFamily: 'Pretendard, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            background: '#16233d',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px',
            padding: '28px',
          }}
        >
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>
            시험 결과
          </h2>

          <p style={{ fontSize: '18px', color: '#dbe4f0', marginBottom: '10px' }}>
            점수: {quizResult.score} / {quizResult.total_questions}
          </p>

          <p style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '28px' }}>
            {quizResult.autoSubmitted
              ? '시험 시간이 종료되어 자동 제출되었습니다.'
              : '정상적으로 제출되었습니다.'}
          </p>

          <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>
            오답 노트
          </h3>

          {quizResult.wrong_answers.length > 0 ? (
            quizResult.wrong_answers.map((wa, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '16px',
                  padding: '18px',
                  background: '#22314f',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p style={{ fontWeight: 700, marginBottom: '10px' }}>Q. {wa.question}</p>
                <p style={{ color: '#f87171', marginBottom: '6px' }}>내 답: {wa.your_answer || '미응답'}</p>
                <p style={{ color: '#4ade80', marginBottom: '6px' }}>정답: {wa.correct_answer}</p>
                <p style={{ color: '#cbd5e1' }}>해설: {wa.explanation}</p>
              </div>
            ))
          ) : (
            <p style={{ color: '#4ade80', fontWeight: 600 }}>모든 문제를 맞혔습니다.</p>
          )}

          <button
            onClick={() => navigate(`/learning-room?pdf_id=${pdfId}&file_name=${encodeURIComponent(fileName)}`)}
            style={{
              marginTop: '24px',
              background: '#4f46e5',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 18px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            학습실로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#081228',
        color: '#fff',
        fontFamily: 'Pretendard, sans-serif',
      }}
    >
      {/* 상단 바 */}
      <div
        style={{
          height: '56px',
          background: '#1a2438',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 22px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '10px',
              background: '#2f3f63',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}
          >
            🎓
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontWeight: 700 }}>
              문제 {currentIndex + 1} / {quizzes.length}
            </span>

            <div
              style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '13px',
                color: '#dbe4f0',
              }}
            >
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/learning-room?pdf_id=${pdfId}&file_name=${encodeURIComponent(fileName)}`)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#cbd5e1',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          나가기
        </button>
      </div>

      {/* 진행바 */}
      <div
        style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: '#6366f1',
            transition: 'width 0.25s ease',
          }}
        />
      </div>

      {/* 본문 */}
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '26px 20px 40px',
        }}
      >
        <div
          style={{
            background: '#1a2743',
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '18px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: '#3949ab',
              color: '#dbe4ff',
              borderRadius: '6px',
              fontSize: '13px',
              padding: '4px 10px',
              marginBottom: '16px',
            }}
          >
            Q{currentIndex + 1}
          </div>

          <p style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.5, marginBottom: '8px' }}>
            {currentQuiz?.question}
          </p>

          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            개념: {currentQuiz?.concept_title}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentQuiz?.choices.map((choice, idx) => {
            const isSelected = userAnswers[currentQuiz.quiz_id] === choice;

            return (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(currentQuiz.quiz_id, choice)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: isSelected ? '#334fc1' : '#1a2743',
                  color: '#fff',
                  border: isSelected
                    ? '1px solid #6f7cff'
                    : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px',
                  padding: '18px 18px',
                  cursor: 'pointer',
                  fontSize: '17px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.35)',
                    background: isSelected ? '#c7d2fe' : 'transparent',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <span>{choice}</span>
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginTop: '26px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{
              minWidth: '110px',
              background: currentIndex === 0 ? '#94a3b8' : '#9ca3af',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 16px',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            이전 문제
          </button>

          <div style={{ color: '#94a3b8', fontSize: '14px' }}>
            {answeredCount} / {quizzes.length} 문제 답변 완료
          </div>

          {isLastQuestion ? (
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              style={{
                minWidth: '110px',
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 16px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontWeight: 700,
              }}
            >
              {isSubmitting ? '제출 중...' : '제출하기'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                minWidth: '110px',
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 16px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              다음 문제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}