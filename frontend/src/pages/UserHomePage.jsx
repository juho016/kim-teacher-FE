import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/HeaderAuthed.jsx";
import "../UserHomePage.css";

// assets 폴더에서 이미지 import
import netflixAmazonImg from "../assets/netflix-amazon.png";

const recentCourses = [
  { id: "database", title: "데이터베이스", last: "마지막 학습: 2일 전", img: "https://placehold.co/300x180/0284C7/FFFFFF?text=Database" },
  { id: "computer-arch", title: "컴퓨터구조", last: "마지막 학습: 2일 전", img: "https://placehold.co/300x180/4338CA/FFFFFF?text=Architecture" },
  { id: "physics1", title: "물리학1", last: "마지막 학습: 2일 전", img: "https://placehold.co/300x180/16A34A/FFFFFF?text=Physics" },
  { id: "algo", title: "알고리즘", last: "마지막 학습: 2일 전", img: "https://placehold.co/300x180/C026D3/FFFFFF?text=Algorithm" },
];

const insightArticles = [
  {
    id: 1,
    category: "Tech Trend",
    title: "넷플릭스와 아마존은 어떻게 내 취향을 알까?",
    description: "Recommendation Process의 기초와 실생활 적용 사례를 통해 알아보는 맞춤형 콘텐츠의 비밀",
    date: "2026.06.12",
    readTime: "5분 읽기",
    // import한 이미지 변수 사용
    img: netflixAmazonImg,
    // 하드코딩된 수업 개념 + 실무 적용 상세 내용
    detail: {
      intro: "우리가 유튜브, 넷플릭스, 쇼핑몰에 들어갈 때마다 '어? 이거 내가 찾던 건데?' 하고 놀란 적 있으신가요? 이는 단순한 우연이 아니라 정교하게 설계된 '추천 시스템(Recommendation System)' 덕분입니다. 실제로 넷플릭스 시청의 80%, 아마존 매출의 35%가 이 시스템에서 발생합니다. 수업 시간에 배운 개념들이 실제 기업에서 어떻게 쓰이는지 자세히 알아볼까요?",
      points: [
        {
          subtitle: "1. 정보 수집과 상호작용 행렬 (Ratings Matrix)",
          text: "추천의 첫 단계는 데이터 수집입니다. 넷플릭스와 아마존은 사용자가 직접 남긴 별점이나 리뷰 같은 '명시적 정보(Explicit Information)'뿐만 아니라, 클릭 수, 시청 시간, 마우스 오버 등의 '암시적 정보(Implicit Information)'를 모두 수집합니다. 이를 바탕으로 사용자를 행(Row), 아이템을 열(Column)로 하는 거대한 '상호작용 행렬(Ratings Matrix)'을 구성하게 됩니다."
        },
        {
          subtitle: "2. 입력 데이터 병합과 연관 규칙 (Aggregating Inputs & Association Rules)",
          text: "아마존은 주로 '협업 필터링(Collaborative Filtering)' 중에서도 아이템 기반 추천을 활용합니다. 특정 상품을 구매한 고객이 자주 함께 구매하는 상품을 찾아내는 방식이죠. 이때 추천의 정확도를 높이기 위해 연관 규칙을 분석하는데, 만약 두 아이템 간의 향상도(Lift) 값이 1이라면 두 상품은 서로 독립적(관계없음)으로 판단하여 추천에서 과감히 제외하는 등 수학적 필터링을 거칩니다."
        },
        {
          subtitle: "3. 희소 문제 극복과 행렬 분해 (Matrix Factorization)",
          text: "수천만 개의 영화와 수억 명의 사용자가 있는 넷플릭스의 상호작용 행렬은 대부분 빈칸(희소 행렬)입니다. 이를 해결하기 위해 넷플릭스는 '행렬 분해(Matrix Factorization)' 기법을 적극 도입했습니다. 거대한 빈 행렬을 두 개의 작은 행렬로 쪼개어 장르, 감독, 시청자의 잠재적 취향 등 '숨겨진 요인(Latent Factors)'을 찾아내고, 사용자가 아직 보지 않은 콘텐츠에 내릴 평점을 매우 높은 정확도로 예측해 냅니다."
        }
      ],
      links: [
        { type: "아마존 아티클", title: "Amazon Personalize 기술의 핵심 원리", url: "https://aws.amazon.com/ko/personalize/" },
        { type: "넷플릭스 기술 블로그", title: "Netflix TechBlog: 별점 그 이상을 넘어서는 추천 시스템", url: "https://netflixtechblog.com/netflix-recommendations-beyond-the-5-stars-part-1-55838468f429" }
      ]
    }
  },
  {
    id: 2,
    category: "Deep Dive",
    title: "행렬 분해(Matrix Factorization)의 숨겨진 수학적 원리",
    description: "사용자와 아이템 간의 상호작용 행렬(Ratings Matrix)을 활용해 잠재 요인을 찾아내는 기법",
    date: "2026.06.10",
    readTime: "8분 읽기",
    img: "https://placehold.co/150x150/EFF6FF/2563EB?text=Matrix",
    detail: null // 2번 카드는 아직 상세 내용 없음
  }
];

export default function UserHomePage() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);

  // 이벤트 버블링 방지를 위해 e.stopPropagation() 추가
  const toggleExpand = (id, e) => {
    if (e) e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="page-container">
      <div className="main-card">
        <Header />

        <main className="content">
          <section className="hero">
            <h1 className="hero-title">신규유저님, 오늘도 화이팅!</h1>
            <p className="hero-sub">새로운 학습을 시작하거나, 기존 학습을 이어가세요.</p>
            <div className="hero-actions">
              <button className="btn btn-primary">새로운 학습 시작하기</button>
              <button className="btn btn-secondary" onClick={() => navigate("/courses")}>과목 전체 보기</button>
            </div>
          </section>

          <section className="section">
            <h2 className="section-title">최근 학습한 과목</h2>
            <div className="course-row">
              {recentCourses.map((c) => (
                <button key={c.id} className="course-card" onClick={() => navigate(`/courses/${c.id}`)}>
                  <div className="course-thumb">
                    <img src={c.img} alt={c.title} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className="course-meta">
                    <div className="course-name">{c.title}</div>
                    <div className="course-last">{c.last}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="section lounge-section">
            <div className="section-header-flex">
              <div>
                <h2 className="section-title">☕ 지식 습득 라운지</h2>
                <p className="section-subtitle">추출된 개념들이 실제 산업에서 어떻게 쓰이는지 확인해보세요.</p>
              </div>
              <button className="btn-text">모두 보기 &rarr;</button>
            </div>

            <div className="insight-grid">
              {insightArticles.map((article) => (
                <article
                  key={article.id}
                  className={`insight-card ${expandedId === article.id ? 'expanded' : ''}`}
                  onClick={(e) => toggleExpand(article.id, e)}
                >
                  <div className="insight-card-header">
                    <div className="insight-thumb">
                      <img src={article.img} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    </div>
                    <div className="insight-content">
                      <div className="insight-meta">
                        <span className="insight-category">{article.category}</span>
                        <span className="insight-time">{article.readTime}</span>
                      </div>
                      <h3 className="insight-title">{article.title}</h3>
                      <p className="insight-desc">{article.description}</p>
                      <div className="insight-footer">
                        <span className="insight-date">{article.date}</span>
                        {/* 버튼 클릭 시에도 토글되도록 처리 (버블링은 상위 onClick에서 제어됨) */}
                        <button className="read-more-btn">
                          {expandedId === article.id ? '접기 ↑' : '읽어보기 ↓'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 펼쳐졌을 때 보이는 상세 내용 영역 */}
                  {expandedId === article.id && article.detail && (
                    <div className="insight-expanded-body" onClick={(e) => e.stopPropagation()}>
                      <p className="detail-intro">{article.detail.intro}</p>

                      <div className="detail-points">
                        {article.detail.points.map((point, idx) => (
                          <div key={idx} className="point-item">
                            <h4 className="point-title">{point.subtitle}</h4>
                            <p className="point-text">{point.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="detail-links-section">
                        <h4 className="links-header">📚 관련 기사 및 블로그 탐구</h4>
                        <div className="links-grid">
                          {article.detail.links.map((link, idx) => (
                            <a key={idx} href={link.url} className="reference-link" target="_blank" rel="noreferrer">
                              <span className="link-type">{link.type}</span>
                              <span className="link-title">{link.title}</span>
                              <span className="link-icon">↗</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}