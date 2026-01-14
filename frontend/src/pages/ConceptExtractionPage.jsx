import React, { useState } from 'react';
import LearningDashboardLayout from '../components/templates/LearningDashboardLayout';

// Mock Data
const mockFilters = [
  { id: 'all', label: '전체', count: 5, active: true },
  { id: 'recsys', label: '추천시스템', count: 2, active: false },
  { id: 'cf', label: '협업 필터링', count: 3, active: false },
];

const mockStats = [
  { label: '총 개념', value: '5', color: 'blue' },
  { label: '핵심 개념', value: '2', color: 'green' },
  { label: '페이지', value: '119', color: 'pink' },
];

const mockConcepts = [
  { id: 1, keyword: '추천시스템', title: '추천 시스템의 정의와 가치', content: '사용자의 선호도, 과거 행동 등을 기반으로 특정 아이템을 추천하는 시스템입니다. 비즈니스적으로는 고객 유지, 판매 증진 등의 가치를 가집니다.' },
  { id: 2, keyword: '추천시스템', title: '추천 시스템의 주요 유형', content: '주요 유형으로는 협업 필터링, 콘텐츠 기반 필터링, 하이브리드 방식 등이 있습니다.' },
  { id: 3, keyword: '협업 필터링', title: '협업 필터링 (Collaborative Filtering)', content: '많은 사용자들로부터 얻은 기호 정보(taste information)를 이용해 사용자의 관심사를 예측하는 방법입니다.' },
  { id: 4, keyword: '협업 필터링', title: '사용자 기반 CF vs 아이템 기반 CF', content: '사용자 기반은 비슷한 성향의 다른 사용자들이 선호한 아이템을 추천하고, 아이템 기반은 사용자가 과거에 선호했던 아이템과 비슷한 아이템을 추천합니다.' },
  { id: 5, keyword: '협업 필터링', title: '평점 행렬 (Rating Matrix)', content: '사용자와 아이템 간의 상호작용(평점, 클릭 등)을 나타내는 행렬로, 협업 필터링의 기본 데이터 구조입니다.' },
];

// Simple Accordion Component for demonstration
const Accordion = ({ items }) => {
  const [openId, setOpenId] = useState(null);

  const toggleItem = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {items.map(item => (
        <div key={item.id} style={{ 
          backgroundColor: 'rgba(30, 41, 59, 0.7)', 
          border: '1px solid rgba(51, 65, 85, 0.5)', 
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <button onClick={() => toggleItem(item.id)} style={{
            width: '100%',
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            <span>{item.title}</span>
            <span>{openId === item.id ? '−' : '+'}</span>
          </button>
          {openId === item.id && (
            <div style={{ padding: '0 1.5rem 1.5rem', color: '#cbd5e1', lineHeight: '1.6' }}>
              <p>{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


export default function ConceptExtractionPage() {
  const [filters, setFilters] = useState(mockFilters);

  const handleFilterClick = (id) => {
    setFilters(filters.map(f => ({ ...f, active: f.id === id })));
    // In a real app, you would filter the concepts here
  };

  return (
    <LearningDashboardLayout
      title="핵심 개념 추출"
      fileName="Assignment2.pdf"
      filters={filters}
      onFilterClick={handleFilterClick}
      stats={mockStats}
      tips="추출된 핵심 개념들을 클릭하여 상세 내용을 확인하고, 모르는 부분은 다시 질문해보세요."
      aiGuideText="AI가 PDF 내용을 바탕으로 핵심 개념 5개를 추출했습니다."
      aiGuideColor="green"
    >
      <Accordion items={mockConcepts} />
    </LearningDashboardLayout>
  );
}
