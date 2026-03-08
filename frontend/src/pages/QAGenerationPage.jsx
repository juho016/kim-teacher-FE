import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LearningDashboardLayout from '../components/templates/LearningDashboardLayout';

const MessageSquareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

function getDifficultyTag(question) {
  const len = (question || '').length;
  if (len <= 25) return '쉬움';
  if (len <= 55) return '보통';
  return '어려움';
}

function getDifficultyColor(level) {
  if (level === '쉬움') return '#22c55e';
  if (level === '보통') return '#facc15';
  return '#ef4444';
}

export default function QAGenerationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const conceptId = searchParams.get('concept_id');
  const pdfId = searchParams.get('pdf_id');
  const conceptTitle = searchParams.get('title') || 'Q&A 자동 생성';

  const [roomId, setRoomId] = useState(localStorage.getItem(`room_id_${pdfId}`) || '');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('AI가 질문과 답변을 생성하는 중입니다...');
  const [activeFilter, setActiveFilter] = useState('all');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (!conceptId || !pdfId) {
      setLoading(false);
      setMessage('concept_id 또는 pdf_id가 없습니다.');
      return;
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const ensureLearningRoom = async () => {
      if (roomId) return roomId;

      const response = await fetch('/api/learning-rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdf_id: pdfId,
          study_goal: 'Q&A 자동 생성 학습'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || '학습방 생성 실패');
      }

      localStorage.setItem(`room_id_${pdfId}`, data.room_id);
      setRoomId(data.room_id);
      return data.room_id;
    };

    const pollQuizzes = async () => {
      const maxTries = 15;

      for (let i = 0; i < maxTries; i++) {
        try {
          const response = await fetch(`/api/concepts/${conceptId}/quizzes`);
          const data = await response.json();

          if (response.ok && data.quizzes && data.quizzes.length > 0) {
            setQuizzes(data.quizzes);
            setMessage('질문과 답변이 생성되었습니다.');
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('퀴즈 조회 실패:', error);
        }

        await sleep(2000);
      }

      setMessage('Q&A 생성은 시작되었지만 아직 결과가 없습니다. 잠시 후 다시 시도해주세요.');
      setLoading(false);
    };

    const generateQA = async () => {
      try {
        const ensuredRoomId = await ensureLearningRoom();

        const response = await fetch(`/api/concepts/${conceptId}/quiz`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            room_id: ensuredRoomId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Q&A 생성 시작 실패');
        }

        setMessage(data.message || 'Q&A 생성 시작됨');
        await pollQuizzes();
      } catch (error) {
        console.error(error);
        setMessage(error.message || 'Q&A 생성 실패');
        setLoading(false);
      }
    };

    generateQA();
  }, [conceptId, pdfId]);

  const enrichedQuizzes = useMemo(() => {
    return quizzes.map((quiz, index) => {
      const difficulty = getDifficultyTag(quiz.question);
      return {
        ...quiz,
        displayIndex: index + 1,
        difficulty,
      };
    });
  }, [quizzes]);

  const filters = useMemo(() => {
    const counts = {
      all: enrichedQuizzes.length,
      쉬움: enrichedQuizzes.filter((q) => q.difficulty === '쉬움').length,
      보통: enrichedQuizzes.filter((q) => q.difficulty === '보통').length,
      어려움: enrichedQuizzes.filter((q) => q.difficulty === '어려움').length,
    };

    return [
      { id: 'all', label: '전체 보기', count: counts.all, active: activeFilter === 'all' },
      { id: '쉬움', label: '쉬움', count: counts['쉬움'], active: activeFilter === '쉬움' },
      { id: '보통', label: '보통', count: counts['보통'], active: activeFilter === '보통' },
      { id: '어려움', label: '어려움', count: counts['어려움'], active: activeFilter === '어려움' },
    ];
  }, [enrichedQuizzes, activeFilter]);

  const filteredQuizzes = useMemo(() => {
    if (activeFilter === 'all') return enrichedQuizzes;
    return enrichedQuizzes.filter((quiz) => quiz.difficulty === activeFilter);
  }, [enrichedQuizzes, activeFilter]);

  const stats = useMemo(() => {
    return [
      { label: '전체 질문', value: String(enrichedQuizzes.length), color: 'blue' },
      { label: '보이는 질문', value: String(filteredQuizzes.length), color: 'green' },
      { label: '학습방', value: roomId ? '1' : '0', color: 'pink' },
    ];
  }, [enrichedQuizzes, filteredQuizzes, roomId]);

  const toggleItem = (quizId) => {
    setOpenId((prev) => (prev === quizId ? null : quizId));
  };

  return (
    <LearningDashboardLayout
      title="Q&A 자동 생성"
      fileName={conceptTitle}
      pageIcon={<MessageSquareIcon />}
      filters={filters}
      onFilterClick={setActiveFilter}
      stats={stats}
      tips="질문을 먼저 읽고 스스로 답을 떠올린 뒤, 정답과 해설을 확인하면 학습 효과가 더 좋아집니다."
      aiGuideText={
        loading
          ? 'AI가 학습 내용을 바탕으로 질문과 답변을 생성하는 중입니다.'
          : `AI가 개념 내용을 바탕으로 질문 ${enrichedQuizzes.length}개를 생성했습니다.`
      }
      aiGuideColor="green"
    >
      {loading ? (
        <div
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.65)',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            borderRadius: '12px',
            padding: '2rem',
            color: '#cbd5e1',
          }}
        >
          {message}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.65)',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            borderRadius: '12px',
            padding: '2rem',
            color: '#cbd5e1',
          }}
        >
          표시할 질문이 없습니다.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredQuizzes.map((quiz) => {
            const isOpen = openId === quiz.quiz_id;
            const difficultyColor = getDifficultyColor(quiz.difficulty);

            return (
              <div
                key={quiz.quiz_id}
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.72)',
                  border: '1px solid rgba(51, 65, 85, 0.55)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => toggleItem(quiz.quiz_id)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    padding: '1.1rem 1.4rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        borderRadius: '999px',
                        padding: '0.2rem 0.5rem',
                        backgroundColor: `${difficultyColor}22`,
                        color: difficultyColor,
                        border: `1px solid ${difficultyColor}55`,
                        fontWeight: 700,
                      }}
                    >
                      {quiz.difficulty}
                    </span>

                    <span style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.5 }}>
                      Q{quiz.displayIndex}. {quiz.question}
                    </span>
                  </div>

                  <span style={{ fontSize: '1.3rem', color: '#e2e8f0' }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 1.4rem 1.3rem',
                      borderTop: '1px solid rgba(51, 65, 85, 0.45)',
                    }}
                  >
                    <div
                      style={{
                        marginTop: '1rem',
                        backgroundColor: 'rgba(22, 163, 74, 0.12)',
                        border: '1px solid rgba(34, 197, 94, 0.25)',
                        borderRadius: '10px',
                        padding: '1rem',
                      }}
                    >
                      <div style={{ color: '#86efac', fontWeight: 700, marginBottom: '0.55rem' }}>
                        정답
                      </div>
                      <div style={{ color: '#dcfce7', lineHeight: 1.7 }}>
                        {quiz.correct_answer}
                      </div>
                    </div>

                    {quiz.explanation && (
                      <div
                        style={{
                          marginTop: '0.9rem',
                          backgroundColor: 'rgba(59, 130, 246, 0.10)',
                          border: '1px solid rgba(96, 165, 250, 0.22)',
                          borderRadius: '10px',
                          padding: '1rem',
                        }}
                      >
                        <div style={{ color: '#93c5fd', fontWeight: 700, marginBottom: '0.55rem' }}>
                          해설
                        </div>
                        <div style={{ color: '#dbeafe', lineHeight: 1.7 }}>
                          {quiz.explanation}
                        </div>
                      </div>
                    )}

                    {Array.isArray(quiz.choices) && quiz.choices.length > 0 && (
                      <div style={{ marginTop: '0.9rem' }}>
                        <div style={{ color: '#cbd5e1', fontWeight: 700, marginBottom: '0.55rem' }}>
                          선택지
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {quiz.choices.map((choice, idx) => (
                            <div
                              key={`${quiz.quiz_id}-choice-${idx}`}
                              style={{
                                padding: '0.7rem 0.9rem',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                                border: '1px solid rgba(51, 65, 85, 0.45)',
                                color: '#e2e8f0',
                              }}
                            >
                              {choice}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                      <button
                        onClick={() => alert('오답노트 추가 기능은 다음 단계에서 연결하면 됩니다.')}
                        style={{
                          padding: '0.58rem 0.95rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(148, 163, 184, 0.25)',
                          backgroundColor: '#ffffff',
                          color: '#0f172a',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        오답노트 추가
                      </button>

                      <button
                        onClick={() => navigate(`/concept?pdf_id=${pdfId}`)}
                        style={{
                          padding: '0.58rem 0.95rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(250, 204, 21, 0.2)',
                          backgroundColor: '#fff7ed',
                          color: '#78350f',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        개념으로 돌아가기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </LearningDashboardLayout>
  );
}