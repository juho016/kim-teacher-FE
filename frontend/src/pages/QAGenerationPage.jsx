import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_BASE = 'http://localhost:8000';

const MessageSquareIcon = ({ size = 20 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const HomeIcon = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
);

const SparklesIcon = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.9 5.1L5 10l5.1 1.9L12 17l1.9-5.1L19 10l-5.1-1.9z" />
    <path d="M5 3v4" />
    <path d="M3 5h4" />
    <path d="M19 17v4" />
    <path d="M17 19h4" />
  </svg>
);

const FilterIcon = ({ size = 17 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const ChevronDownIcon = ({ size = 18, open = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const FileTextIcon = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const PlusCircleIcon = ({ size = 15 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

const PageIcon = ({ size = 15 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

const difficultyMeta = {
  easy: {
    label: '쉬움',
    dot: '#4ade80',
    pillBg: 'rgba(34,197,94,0.16)',
    pillColor: '#86efac',
    border: 'rgba(34,197,94,0.24)',
  },
  medium: {
    label: '보통',
    dot: '#facc15',
    pillBg: 'rgba(250,204,21,0.16)',
    pillColor: '#fde68a',
    border: 'rgba(250,204,21,0.24)',
  },
  hard: {
    label: '어려움',
    dot: '#f87171',
    pillBg: 'rgba(248,113,113,0.16)',
    pillColor: '#fca5a5',
    border: 'rgba(248,113,113,0.24)',
  },
};

function buildStarterQuestions(title) {
  return [
    {
      id: 'easy-1',
      difficulty: 'easy',
      page: 1,
      question: `${title}의 핵심 개념을 한 문장으로 설명해줘.`,
    },
    {
      id: 'easy-2',
      difficulty: 'easy',
      page: 1,
      question: `${title}에서 가장 중요한 키워드 3가지는 무엇이야?`,
    },
    {
      id: 'medium-1',
      difficulty: 'medium',
      page: 2,
      question: `${title}의 주요 원리나 동작 과정을 단계별로 설명해줘.`,
    },
    {
      id: 'medium-2',
      difficulty: 'medium',
      page: 2,
      question: `${title}가 다른 관련 개념과 어떻게 구별되는지 비교해서 설명해줘.`,
    },
    {
      id: 'medium-3',
      difficulty: 'medium',
      page: 3,
      question: `${title}를 실제 예시와 함께 설명해줘.`,
    },
    {
      id: 'hard-1',
      difficulty: 'hard',
      page: 3,
      question: `${title}에서 자주 헷갈리는 부분이나 오해하기 쉬운 점을 설명해줘.`,
    },
    {
      id: 'hard-2',
      difficulty: 'hard',
      page: 4,
      question: `${title}를 시험 답안처럼 자세히 서술해줘.`,
    },
    {
      id: 'hard-3',
      difficulty: 'hard',
      page: 4,
      question: `${title}의 장점, 한계, 적용 상황을 종합해서 설명해줘.`,
    },
  ];
}

export default function QAGenerationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const conceptId = searchParams.get('concept_id');
  const pdfId = searchParams.get('pdf_id');
  const conceptTitle = searchParams.get('title') || 'Q&A 자동 생성';

  const [roomId, setRoomId] = useState(localStorage.getItem(`room_id_${pdfId}`) || '');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Q&A 학습 화면을 준비하는 중입니다...');
  const [activeFilter, setActiveFilter] = useState('all');
  const [qaItems, setQaItems] = useState([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    const savedRoomId = localStorage.getItem(`room_id_${pdfId}`) || '';
    setRoomId(savedRoomId);
  }, [pdfId]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (!conceptId || !pdfId) {
      setLoading(false);
      setMessage('concept_id 또는 pdf_id가 없습니다.');
      return;
    }

    const ensureLearningRoom = async () => {
      if (roomId) return roomId;

      const response = await fetch(`${API_BASE}/learning-rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdf_id: pdfId, study_goal: 'Q&A 학습' }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || '학습방 생성 실패');

      localStorage.setItem(`room_id_${pdfId}`, data.room_id);
      setRoomId(data.room_id);
      return data.room_id;
    };

    const init = async () => {
      try {
        await ensureLearningRoom();

        const starter = buildStarterQuestions(conceptTitle).map((item) => ({
          ...item,
          answer: '',
          logId: null,
          isOpen: false,
          isLoading: false,
          loaded: false,
        }));

        setQaItems(starter);
        setMessage('질문을 클릭하면 AI가 답변을 생성합니다.');
        setLoading(false);
      } catch (error) {
        console.error(error);
        setMessage(error.message || 'Q&A 화면 준비 실패');
        setLoading(false);
      }
    };

    init();
  }, [conceptId, pdfId, conceptTitle, roomId]);

  const counts = useMemo(() => {
    return {
      all: qaItems.length,
      easy: qaItems.filter((item) => item.difficulty === 'easy').length,
      medium: qaItems.filter((item) => item.difficulty === 'medium').length,
      hard: qaItems.filter((item) => item.difficulty === 'hard').length,
    };
  }, [qaItems]);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return qaItems;
    return qaItems.filter((item) => item.difficulty === activeFilter);
  }, [activeFilter, qaItems]);

  const fetchAnswer = async (itemId, question) => {
    setQaItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isLoading: true } : item
      )
    );

    try {
      const currentRoomId =
        roomId || localStorage.getItem(`room_id_${pdfId}`) || '';

      const response = await fetch(`${API_BASE}/concepts/${conceptId}/qna`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: currentRoomId,
          question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Q&A 답변 생성 실패');
      }

      setQaItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                answer: data.answer,
                logId: data.log_id,
                loaded: true,
                isLoading: false,
              }
            : item
        )
      );
    } catch (error) {
      console.error(error);

      setQaItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                answer: error.message || '답변 생성 중 오류가 발생했습니다.',
                loaded: true,
                isLoading: false,
              }
            : item
        )
      );
    }
  };

  const handleToggleCard = async (target) => {
    const willOpen = !target.isOpen;

    setQaItems((prev) =>
      prev.map((item) =>
        item.id === target.id
          ? { ...item, isOpen: willOpen }
          : item
      )
    );

    if (willOpen && !target.loaded && !target.isLoading) {
      await fetchAnswer(target.id, target.question);
    }
  };

  const handleMoveToPage = (page) => {
    alert(`${page}페이지 이동 기능은 PDF 뷰어 연결 단계에서 구현하면 됩니다.`);
  };

  const handleAddWrongAnswer = (item) => {
    alert(`"${item.question}" 항목을 오답노트와 연결하는 기능은 다음 단계에서 붙이면 됩니다.`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0b1220',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Pretendard, sans-serif',
      }}
    >
      <header
        style={{
          height: 74,
          borderBottom: '1px solid rgba(51,65,85,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          backgroundColor: '#111a2d',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: 'rgba(34,197,94,0.14)',
              color: '#86efac',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(34,197,94,0.22)',
            }}
          >
            <MessageSquareIcon size={20} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Q&A 자동 생성</div>
              <span
                style={{
                  fontSize: '0.76rem',
                  backgroundColor: 'rgba(34,197,94,0.18)',
                  color: '#bbf7d0',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 999,
                  border: '1px solid rgba(34,197,94,0.24)',
                }}
              >
                {counts.all}개
              </span>
            </div>
            <div style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: 2 }}>
              {pdfId || 'PDF 파일'}
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            navigate(`/learning-room?pdf_id=${pdfId}`)
          }
          style={{
            border: 'none',
            background: 'transparent',
            color: '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          <HomeIcon />
          학습실로 돌아가기
        </button>
      </header>

      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '260px minmax(0, 1fr) 270px',
          minHeight: 0,
        }}
      >
        <aside
          style={{
            borderRight: '1px solid rgba(51,65,85,0.5)',
            backgroundColor: '#162033',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <div style={{ padding: '1.15rem 1rem', borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                color: '#d8b4fe',
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              <FilterIcon />
              난이도 필터
            </div>
          </div>

          <div style={{ padding: '0.85rem' }}>
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.9rem 1rem',
                borderRadius: 12,
                border: activeFilter === 'all'
                  ? '1px solid rgba(34,197,94,0.35)'
                  : '1px solid rgba(148,163,184,0.08)',
                backgroundColor: activeFilter === 'all'
                  ? 'rgba(34,197,94,0.18)'
                  : 'rgba(15,23,42,0.32)',
                color: activeFilter === 'all' ? '#dcfce7' : '#e2e8f0',
                cursor: 'pointer',
                fontWeight: 700,
                marginBottom: '0.85rem',
              }}
            >
              전체 보기 ({counts.all})
            </button>

            {['easy', 'medium', 'hard'].map((key) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 0.85rem',
                  border: 'none',
                  background: 'transparent',
                  color: activeFilter === key ? '#ffffff' : '#cbd5e1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: difficultyMeta[key].dot,
                      display: 'inline-block',
                    }}
                  />
                  {difficultyMeta[key].label}
                </span>
                <span style={{ color: '#94a3b8' }}>({counts[key]})</span>
              </button>
            ))}
          </div>
        </aside>

        <main
          style={{
            minWidth: 0,
            overflowY: 'auto',
            padding: '1.25rem',
            background:
              'linear-gradient(180deg, rgba(15,23,42,0.96) 0%, rgba(11,18,32,0.98) 100%)',
          }}
        >
          <div
            style={{
              background:
                'linear-gradient(90deg, rgba(21,128,61,0.16) 0%, rgba(29,78,216,0.12) 100%)',
              border: '1px solid rgba(34,197,94,0.18)',
              borderRadius: 14,
              padding: '1rem 1.15rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.8rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ color: '#bbf7d0', marginTop: 2 }}>
              <SparklesIcon />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#f0fdf4' }}>
                AI가 학습 내용을 바탕으로 질문과 답변을 자동 생성했습니다
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: 4 }}>
                질문을 클릭하면 답변을 확인하고 학습할 수 있습니다
              </div>
            </div>
          </div>

          {loading ? (
            <div
              style={{
                backgroundColor: 'rgba(17,24,39,0.72)',
                border: '1px solid rgba(148,163,184,0.12)',
                borderRadius: 16,
                padding: '1.4rem',
                color: '#cbd5e1',
              }}
            >
              {message}
            </div>
          ) : filteredItems.length === 0 ? (
            <div
              style={{
                backgroundColor: 'rgba(17,24,39,0.72)',
                border: '1px solid rgba(148,163,184,0.12)',
                borderRadius: 16,
                padding: '1.4rem',
                color: '#cbd5e1',
              }}
            >
              표시할 질문이 없습니다.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredItems.map((item) => {
                const meta = difficultyMeta[item.difficulty];

                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: 'rgba(30,41,59,0.72)',
                      border: '1px solid rgba(51,65,85,0.55)',
                      borderRadius: 14,
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => handleToggleCard(item)}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        padding: '1rem 1.15rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.95rem', minWidth: 0 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            backgroundColor: 'rgba(34,197,94,0.16)',
                            color: '#86efac',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <MessageSquareIcon size={16} />
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontSize: '0.76rem',
                                backgroundColor: meta.pillBg,
                                color: meta.pillColor,
                                border: `1px solid ${meta.border}`,
                                padding: '0.18rem 0.5rem',
                                borderRadius: 999,
                                fontWeight: 700,
                              }}
                            >
                              {meta.label}
                            </span>

                            <span
                              style={{
                                fontSize: '0.74rem',
                                backgroundColor: 'rgba(100,116,139,0.22)',
                                color: '#cbd5e1',
                                padding: '0.18rem 0.45rem',
                                borderRadius: 8,
                              }}
                            >
                              p.{item.page}
                            </span>
                          </div>

                          <div style={{ fontWeight: 700, lineHeight: 1.6 }}>
                            Q. {item.question}
                          </div>
                        </div>
                      </div>

                      <div style={{ color: '#94a3b8', flexShrink: 0 }}>
                        <ChevronDownIcon open={item.isOpen} />
                      </div>
                    </button>

                    {item.isOpen && (
                      <div
                        style={{
                          borderTop: '1px solid rgba(51,65,85,0.55)',
                          padding: '1rem 1.15rem 1.15rem',
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: 'rgba(20,83,45,0.18)',
                            border: '1px solid rgba(34,197,94,0.22)',
                            borderRadius: 12,
                            padding: '1rem',
                            color: '#d1fae5',
                            lineHeight: 1.8,
                          }}
                        >
                          <div style={{ color: '#86efac', fontWeight: 700, marginBottom: 8 }}>
                            💡 답변
                          </div>

                          {item.isLoading ? (
                            <div style={{ color: '#cbd5e1' }}>AI가 답변을 생성하는 중입니다...</div>
                          ) : (
                            <div style={{ whiteSpace: 'pre-wrap' }}>
                              {item.answer || '답변이 아직 없습니다.'}
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.7rem', marginTop: '0.95rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleMoveToPage(item.page)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.38rem',
                              padding: '0.62rem 0.92rem',
                              borderRadius: 10,
                              border: '1px solid rgba(148,163,184,0.2)',
                              backgroundColor: '#ffffff',
                              color: '#334155',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            <PageIcon />
                            페이지로 이동
                          </button>

                          <button
                            onClick={() => handleAddWrongAnswer(item)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.38rem',
                              padding: '0.62rem 0.92rem',
                              borderRadius: 10,
                              border: '1px solid rgba(148,163,184,0.2)',
                              backgroundColor: '#ffffff',
                              color: '#334155',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            <PlusCircleIcon />
                            오답노트 추가
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <aside
          style={{
            borderLeft: '1px solid rgba(51,65,85,0.5)',
            backgroundColor: '#162033',
            padding: '1rem',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontWeight: 800, color: '#d8b4fe', marginBottom: '1rem' }}>
            ✨ 분석 통계
          </div>

          <div
            style={{
              backgroundColor: 'rgba(15,23,42,0.72)',
              border: '1px solid rgba(148,163,184,0.12)',
              borderRadius: 14,
              padding: '1rem',
              marginBottom: '0.8rem',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.84rem' }}>전체 질문</div>
            <div style={{ color: '#86efac', fontSize: '2rem', fontWeight: 800, marginTop: 8 }}>
              {counts.all}
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(15,23,42,0.72)',
              border: '1px solid rgba(148,163,184,0.12)',
              borderRadius: 14,
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ color: '#94a3b8', fontSize: '0.84rem', marginBottom: 10 }}>
              난이도별 분포
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#86efac' }}>쉬움</span>
              <span style={{ color: '#86efac' }}>{counts.easy}개</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#fde68a' }}>보통</span>
              <span style={{ color: '#fde68a' }}>{counts.medium}개</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#fca5a5' }}>어려움</span>
              <span style={{ color: '#fca5a5' }}>{counts.hard}개</span>
            </div>
          </div>

          <div style={{ color: '#94a3b8', fontSize: '0.86rem', marginBottom: '0.7rem' }}>
            학습 팁
          </div>

          <div
            style={{
              border: '1px solid rgba(34,197,94,0.24)',
              backgroundColor: 'rgba(20,83,45,0.14)',
              borderRadius: 12,
              padding: '0.9rem',
              marginBottom: '0.7rem',
            }}
          >
            <div style={{ color: '#bbf7d0', fontWeight: 700, marginBottom: 6 }}>
              💡 쉬운 문제부터 시작하여 단계적으로 학습하세요
            </div>
          </div>

          <div
            style={{
              border: '1px solid rgba(96,165,250,0.24)',
              backgroundColor: 'rgba(30,64,175,0.12)',
              borderRadius: 12,
              padding: '0.9rem',
            }}
          >
            <div style={{ color: '#bfdbfe', fontWeight: 700, marginBottom: 6 }}>
              📝 답변을 읽고 이해한 후 자신의 말로 설명해보세요
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}