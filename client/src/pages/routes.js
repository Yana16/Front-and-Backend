import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LinksPage } from "./LinksPage";
import { CreatePage } from "./CreatePage";
import { DetailPage } from "./DetailPage";
import { AuthPage } from "./AuthPage";

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/links" element={<LinksPage />} exact />
        <Route path="/create" element={<CreatePage />} exact />
        <Route path="/detail/:id" element={<DetailPage />} exact />
        <Route path="/" element={<Navigate to="/create" />} exact />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AuthPage />} exact />
      <Route path="/" element={<Navigate to="/" />} />
    </Routes>
  );
};
