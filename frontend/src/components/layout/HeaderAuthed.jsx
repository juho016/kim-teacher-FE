import React from "react";
import { NavLink } from "react-router-dom";

export default function HeaderAuthed() {
  return (
    <header className="header-authed">
      <div className="header-left">
        <div className="logo-badge">✱</div>
        <div className="header-logo">김선생</div>
      </div>

      <nav className="tabs">
        <NavLink to="/user-home" className={({ isActive }) => isActive ? "tab active" : "tab"}>
          홈
        </NavLink>
        <NavLink to="/pdf-upload" className={({ isActive }) => isActive ? "tab active" : "tab"}>
          AI 학습방
        </NavLink>
        <NavLink to="/ai-prelearning" className={({ isActive }) => isActive ? "tab active" : "tab"}>
          10분 예습
        </NavLink>
        <NavLink to="/community" className={({ isActive }) => isActive ? "tab active" : "tab"}>
          학습 커뮤니티
        </NavLink>
        <NavLink to="/mypage" className={({ isActive }) => isActive ? "tab active" : "tab"}>
          마이페이지
        </NavLink>
      </nav>
    </header>
  );
}
