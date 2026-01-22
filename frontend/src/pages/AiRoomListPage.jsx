import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderAuthed from "../components/layout/HeaderAuthed.jsx";
//로그인 후 ai 학습방 화면. 새 강의 생성 버튼 클릭->aiRoomPage로 넘어감
const AiRoomListPage = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([
    { id: "1", title: "SIMD와 MIMD의 차이 비교" },
    { id: "2", title: "Modular Linear Equations 풀이 해설" },
    { id: "3", title: "데이터베이스의 기초" },
  ]);

  const createRoom = () => {
    // 실제로는 서버/DB에서 생성하지만, 지금은 더미로 생성
    const newId = String(Date.now());
    const newRoom = { id: newId, title: "새 강의" };
    setRooms((prev) => [newRoom, ...prev]);
    navigate(`/ai-room/${newId}`);
  };

  const deleteRoom = (id) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const goRoom = (id) => navigate(`/ai-room/${id}`);

  const list = useMemo(() => rooms, [rooms]);

  return (
    <div className="page-container">
      <div className="main-card">
        <HeaderAuthed />
        <div className="content">
          <div className="airoom-top">
            <h2 className="airoom-title">내 AI 학습방</h2>

            <button className="btn btn-primary airoom-create" onClick={createRoom}>
              새 강의 생성
            </button>
          </div>

          <div className="airoom-list">
            {list.map((room) => (
              <div key={room.id} className="airoom-item">
                <button className="airoom-item-main" onClick={() => goRoom(room.id)}>
                  <span className="airoom-icon">📄</span>
                  <span className="airoom-item-text">{room.title}</span>
                </button>

                <button
                  className="airoom-trash"
                  onClick={() => deleteRoom(room.id)}
                  aria-label="삭제"
                  title="삭제"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiRoomListPage;
