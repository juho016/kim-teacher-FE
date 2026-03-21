import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_BASE = 'http://localhost:8000';

const BookOpenIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const HomeIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5 12 3l9 7.5"></path>
    <path d="M5 9.5V21h14V9.5"></path>
  </svg>
);

const SparklesIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 5.1L5 10l5.1 1.9L12 17l1.9-5.1L19 10l-5.1-1.9z"></path>
    <path d="M5 3v4"></path>
    <path d="M3 5h4"></path>
    <path d="M19 17v4"></path>
    <path d="M17 19h4"></path>
  </svg>
);

const FileTextIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <path d="M14 2v6h6"></path>
    <path d="M16 13H8"></path>
    <path d="M16 17H8"></path>
    <path d="M10 9H8"></path>
  </svg>
);

function CornellEditor({ value, onChange, placeholder, color = '#e2e8f0', minHeight = 140 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        minHeight,
        backgroundColor: 'rgba(10, 17, 35, 0.96)',
        border: '1px solid rgba(148,163,184,0.14)',
        borderRadius: 12,
        color,
        padding: '0.95rem 1rem',
        resize: 'vertical',
        lineHeight: 1.75,
        outline: 'none',
        fontSize: '0.96rem',
        boxSizing: 'border-box',
      }}
    />
  );
}

export default function CornellNotePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const pdfId = searchParams.get('pdf_id');
  const fileName = searchParams.get('file_name') || 'Assignment2.pdf';

  const [roomId, setRoomId] = useState(localStorage.getItem(`room_id_${pdfId}`) || '');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('코넬 노트를 생성하는 중입니다...');
  const [notes, setNotes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  const selectedNote = notes[selectedIndex] || null;

  const ensureLearningRoom = async () => {
    if (roomId) return roomId;

    const response = await fetch(`${API_BASE}/learning-rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pdf_id: pdfId,
        study_goal: '코넬 노트 학습',
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

  const loadCornellNotes = async (targetRoomId) => {
    const response = await fetch(
      `${API_BASE}/pdf/${pdfId}/cornell?room_id=${encodeURIComponent(targetRoomId)}`
    );

    if (response.status === 404) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || '코넬 노트 목록 조회 실패');
    }

    const items = Array.isArray(data.items) ? data.items : [];
    setNotes(items);
    return items;
  };

  const generateCornellNotes = async (targetRoomId) => {
    const response = await fetch(`${API_BASE}/pdf/${pdfId}/cornell/generate-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_id: targetRoomId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || '코넬 노트 전체 생성 실패');
    }

    return data;
  };

  useEffect(() => {
    if (!pdfId) {
      setLoading(false);
      setMessage('pdf_id가 없습니다.');
      return;
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const initialize = async () => {
      try {
        const ensuredRoomId = await ensureLearningRoom();

        const existing = await loadCornellNotes(ensuredRoomId);
        if (existing && existing.length > 0) {
          setMessage('기존 코넬 노트를 불러왔습니다.');
          setLoading(false);
          return;
        }

        setMessage('PDF의 모든 개념에 대한 코넬 노트를 생성하고 있습니다...');
        await generateCornellNotes(ensuredRoomId);

        for (let i = 0; i < 20; i++) {
          const loaded = await loadCornellNotes(ensuredRoomId);
          if (loaded && loaded.length > 0) {
            setMessage('코넬 노트가 생성되었습니다.');
            setLoading(false);
            return;
          }
          await sleep(1500);
        }

        setMessage('코넬 노트 생성은 시작되었지만 아직 결과가 없습니다.');
        setLoading(false);
      } catch (error) {
        console.error(error);
        setMessage(error.message || '코넬 노트 생성 실패');
        setLoading(false);
      }
    };

    initialize();
  }, [pdfId]);

  const updateSelectedNoteField = (field, value) => {
    setNotes((prev) =>
      prev.map((item, idx) =>
        idx === selectedIndex
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleSave = async () => {
    if (!pdfId || !selectedNote) return;

    setSaving(true);
    try {
      const ensuredRoomId = await ensureLearningRoom();

      const response = await fetch(`${API_BASE}/pdf/${pdfId}/cornell/save-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: ensuredRoomId,
          items: notes.map((item) => ({
            concept_id: item.concept_id,
            title: item.title,
            start_page: item.start_page,
            end_page: item.end_page,
            keywords: Array.isArray(item.keywords) ? item.keywords : [],
            notes: typeof item.notes === 'string' ? item.notes : '',
            summary: item.summary || '',
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || '코넬 노트 저장 실패');
      }

      alert('코넬 노트가 저장되었습니다.');
    } catch (error) {
      console.error(error);
      alert(error.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const noteCount = notes.length;
  const totalPages = useMemo(() => {
    if (notes.length === 0) return 0;
    return Math.max(...notes.map((item) => item.end_page || item.start_page || 0));
  }, [notes]);

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
          height: 68,
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
              backgroundColor: 'rgba(124,58,237,0.14)',
              color: '#c4b5fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(167,139,250,0.22)',
            }}
          >
            <BookOpenIcon size={20} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>코넬 노트 방식</div>
              <span
                style={{
                  fontSize: '0.76rem',
                  backgroundColor: 'rgba(168,85,247,0.18)',
                  color: '#ddd6fe',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 999,
                  border: '1px solid rgba(168,85,247,0.24)',
                }}
              >
                {noteCount}개
              </span>
            </div>
            <div style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: 2 }}>
              {fileName}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/learning-room?pdf_id=${pdfId}&file_name=${encodeURIComponent(fileName)}`)}
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
          gridTemplateColumns: '260px minmax(0, 1fr) 260px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#d8b4fe', fontWeight: 700 }}>
              <FileTextIcon />
              노트 목록
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.84rem', marginTop: 6 }}>
              페이지별 코넬 노트
            </div>
          </div>

          <div style={{ overflowY: 'auto', padding: '0.75rem' }}>
            {loading ? (
              <div style={{ color: '#94a3b8', fontSize: '0.92rem' }}>{message}</div>
            ) : notes.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: '0.92rem' }}>생성된 코넬 노트가 없습니다.</div>
            ) : (
              notes.map((item, idx) => {
                const active = idx === selectedIndex;
                return (
                  <button
                    key={item.concept_id ?? idx}
                    onClick={() => setSelectedIndex(idx)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.95rem',
                      marginBottom: '0.7rem',
                      borderRadius: 12,
                      border: active
                        ? '1px solid rgba(168,85,247,0.44)'
                        : '1px solid rgba(148,163,184,0.08)',
                      backgroundColor: active ? 'rgba(124,58,237,0.24)' : 'rgba(15,23,42,0.32)',
                      color: '#f8fafc',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.7rem' }}>
                      <div style={{ fontSize: '0.82rem', color: active ? '#e9d5ff' : '#a78bfa' }}>
                        노트 #{idx + 1}
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: '#cbd5e1',
                          backgroundColor: 'rgba(100,116,139,0.24)',
                          borderRadius: 8,
                          padding: '0.15rem 0.4rem',
                        }}
                      >
                        p.{item.start_page ?? '-'}
                      </span>
                    </div>
                    <div style={{ marginTop: 8, fontWeight: 700, lineHeight: 1.5 }}>
                      {item.title || `개념 ${idx + 1}`}
                    </div>
                  </button>
                );
              })
            )}
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
                'linear-gradient(90deg, rgba(91,33,182,0.18) 0%, rgba(29,78,216,0.12) 100%)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 14,
              padding: '1rem 1.15rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.8rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ color: '#e9d5ff', marginTop: 2 }}>
              <SparklesIcon />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#f3e8ff' }}>
                효과적인 학습을 위한 코넬 노트 방식으로 정리되었습니다
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: 4 }}>
                단서(Cue), 노트(Notes), 요약(Summary)으로 구성되어 있습니다
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
          ) : !selectedNote ? (
            <div
              style={{
                backgroundColor: 'rgba(17,24,39,0.72)',
                border: '1px solid rgba(148,163,184,0.12)',
                borderRadius: 16,
                padding: '1.4rem',
                color: '#cbd5e1',
              }}
            >
              표시할 코넬 노트가 없습니다.
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'rgba(30,41,59,0.72)',
                border: '1px solid rgba(168,85,247,0.18)',
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '1rem 1.2rem',
                  borderBottom: '1px solid rgba(51,65,85,0.58)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <div style={{ color: '#d8b4fe' }}>
                    <BookOpenIcon size={18} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.04rem' }}>코넬 노트</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                      backgroundColor: 'rgba(100,116,139,0.24)',
                      padding: '0.28rem 0.55rem',
                      borderRadius: 8,
                    }}
                  >
                    페이지 {selectedNote.start_page ?? '-'}
                  </span>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      padding: '0.65rem 1.05rem',
                      borderRadius: 10,
                      border: '1px solid rgba(168,85,247,0.3)',
                      backgroundColor: '#a855f7',
                      color: 'white',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {saving ? '저장 중...' : '저장하기'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '240px minmax(0, 1fr)' }}>
                <div
                  style={{
                    padding: '1.15rem',
                    borderRight: '1px solid rgba(51,65,85,0.58)',
                    backgroundColor: 'rgba(91,33,182,0.08)',
                  }}
                >
                  <div style={{ color: '#d8b4fe', fontWeight: 700, marginBottom: '0.8rem' }}>
                    단서 (Cue)
                  </div>
                  <CornellEditor
                    value={Array.isArray(selectedNote.keywords) ? selectedNote.keywords.join('\n') : ''}
                    onChange={(e) =>
                      updateSelectedNoteField(
                        'keywords',
                        e.target.value.split('\n').map((v) => v.trim()).filter(Boolean)
                      )
                    }
                    placeholder="핵심 질문이나 키워드를 입력하세요"
                    color="#f3e8ff"
                    minHeight={330}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <div style={{ padding: '1.15rem', minWidth: 0 }}>
                    <div style={{ color: '#93c5fd', fontWeight: 700, marginBottom: '0.8rem' }}>
                      노트 (Notes)
                    </div>
                    <CornellEditor
                     value={typeof selectedNote.notes === 'string' ? selectedNote.notes : ''}
                      onChange={(e) => updateSelectedNoteField('notes', e.target.value)}
                      placeholder="상세한 내용을 줄 단위로 입력하세요"
                      color="#e2e8f0"
                      minHeight={260}
                    />
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid rgba(51,65,85,0.58)',
                      backgroundColor: 'rgba(168,85,247,0.08)',
                      padding: '1.15rem',
                    }}
                  >
                    <div style={{ color: '#bbf7d0', fontWeight: 700, marginBottom: '0.8rem' }}>
                      요약 (Summary)
                    </div>
                    <CornellEditor
                      value={selectedNote.summary || ''}
                      onChange={(e) => updateSelectedNoteField('summary', e.target.value)}
                      placeholder="핵심 내용을 자신의 말로 정리해보세요"
                      color="#f8fafc"
                      minHeight={120}
                    />
                  </div>
                </div>
              </div>
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
          <div style={{ fontWeight: 800, color: '#e9d5ff', marginBottom: '1rem' }}>
            ✨ 코넬 노트 안내
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
            <div style={{ color: '#94a3b8', fontSize: '0.84rem' }}>생성된 노트</div>
            <div style={{ color: '#c4b5fd', fontSize: '2rem', fontWeight: 800, marginTop: 8 }}>
              {noteCount}
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
            <div style={{ color: '#94a3b8', fontSize: '0.84rem' }}>총 페이지</div>
            <div style={{ color: '#93c5fd', fontSize: '2rem', fontWeight: 800, marginTop: 8 }}>
              {totalPages}
            </div>
          </div>

          <div style={{ color: '#94a3b8', fontSize: '0.86rem', marginBottom: '0.7rem' }}>
            학습 방법
          </div>

          <div
            style={{
              border: '1px solid rgba(168,85,247,0.28)',
              backgroundColor: 'rgba(91,33,182,0.12)',
              borderRadius: 12,
              padding: '0.9rem',
              marginBottom: '0.7rem',
            }}
          >
            <div style={{ color: '#d8b4fe', fontWeight: 700, marginBottom: 6 }}>단서 (Cue)</div>
            <div style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>
              핵심 질문이나 키워드를 확인하세요
            </div>
          </div>

          <div
            style={{
              border: '1px solid rgba(96,165,250,0.28)',
              backgroundColor: 'rgba(30,64,175,0.12)',
              borderRadius: 12,
              padding: '0.9rem',
              marginBottom: '0.7rem',
            }}
          >
            <div style={{ color: '#93c5fd', fontWeight: 700, marginBottom: 6 }}>노트 (Notes)</div>
            <div style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>
              상세한 내용을 읽고 이해하세요
            </div>
          </div>

          <div
            style={{
              border: '1px solid rgba(74,222,128,0.28)',
              backgroundColor: 'rgba(20,83,45,0.14)',
              borderRadius: 12,
              padding: '0.9rem',
              marginBottom: '0.7rem',
            }}
          >
            <div style={{ color: '#86efac', fontWeight: 700, marginBottom: 6 }}>요약 (Summary)</div>
            <div style={{ color: '#cbd5e1', fontSize: '0.88rem' }}>
              핵심을 자신의 말로 정리해보세요
            </div>
          </div>

          <div
            style={{
              border: '1px solid rgba(250,204,21,0.28)',
              backgroundColor: 'rgba(120,53,15,0.16)',
              borderRadius: 12,
              padding: '0.9rem',
            }}
          >
            <div style={{ color: '#fde68a', fontWeight: 700, marginBottom: 6 }}>
              💡 단서만 보고 내용을 떠올려보는 연습을 하세요
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}