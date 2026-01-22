import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginHomePage from "./pages/LoginHomePage.jsx";
import CourseListPage from "./pages/CourseListPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import AiRoomListPage from "./pages/AiRoomListPage.jsx";
import AiRoomPage from "./pages/AiRoomPage.jsx";
import PdfUploadPage from "./pages/PdfUploadPage.jsx";
import PdfAnalysisResultPage from "./pages/PdfAnalysisResultPage.jsx";
import ConceptExtractionPage from "./pages/ConceptExtractionPage.jsx";

import MyPage from "./pages/MyPage.jsx";
import MyPageProgressStatusPage from "./pages/MyPageProgressStatusPage.jsx";
import MyPageProgressStatusDetailPage from "./pages/MyPageProgressStatusDetailPage.jsx";
import MyPageWrongNotesPage from "./pages/MyPageWrongNotesPage.jsx";

import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home-login" element={<LoginHomePage />} />
      <Route path="/courses" element={<CourseListPage />} />
      <Route path="/courses/:courseId" element={<CourseDetailPage />} />
      <Route path="/pdf-upload" element={<PdfUploadPage />} />
      <Route path="/pdf-analysis" element={<PdfAnalysisResultPage />} />
      <Route path="/concept" element={<ConceptExtractionPage />} />
      <Route path="/ai-room" element={<AiRoomListPage />} />
      <Route path="/ai-room/:roomId" element={<AiRoomPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/progress-status" element={<MyPageProgressStatusPage />} />
      <Route path="/mypage/progress-status/:courseId" element={<MyPageProgressStatusDetailPage />} />
      <Route path="/mypage/wrong-notes" element={<MyPageWrongNotesPage />} />

    </Routes>
  );
}
