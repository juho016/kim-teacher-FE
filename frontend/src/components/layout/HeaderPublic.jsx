import React from 'react';

const HeaderPublic = () => {
  return (
    <header className="header">
      <div className="header-logo">김선생</div>
      <div className="header-actions">
        <button className="btn btn-secondary">로그인</button>
        <button className="btn btn-primary">회원가입</button>
      </div>
    </header>
  );
};

export default HeaderPublic;
