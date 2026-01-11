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
        <NavLink to="/home-login" className={({ isActive }) => isActive ? "tab active" : "tab"}>
          홈
        </NavLink>
        <NavLink to="/study" className={({ isActive }) => isActive ? "tab active" : "tab"}>
          AI 학습방
        </NavLink>
        <NavLink to="/mypage" className={({ isActive }) => isActive ? "tab active" : "tab"}>
          마이페이지
        </NavLink>
      </nav>
    </header>
  );
}
