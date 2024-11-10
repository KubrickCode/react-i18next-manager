import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HomePage, NotFoundPage } from "~/pages";

export const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
