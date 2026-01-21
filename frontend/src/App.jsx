import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import UserHomePage from "./pages/UserHomePage.jsx";
import CourseListPage from "./pages/CourseListPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import PdfUploadPage from "./pages/PdfUploadPage.jsx";
import PdfAnalysisResultPage from "./pages/PdfAnalysisResultPage.jsx";
import ConceptExtractionPage from "./pages/ConceptExtractionPage.jsx";
import "./App.css";
import LoginPage from "./pages/LoginPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/user-home" element={<UserHomePage />} />
      <Route path="/courses" element={<CourseListPage />} />
      <Route path="/courses/:courseId" element={<CourseDetailPage />} />
      <Route path="/pdf-upload" element={<PdfUploadPage />} />
      <Route path="/pdf-analysis" element={<PdfAnalysisResultPage />} />
      <Route path="/concept" element={<ConceptExtractionPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/login-page" element={<LoginPage />} />
    </Routes>
  );
}
