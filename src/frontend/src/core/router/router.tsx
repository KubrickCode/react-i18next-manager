import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HomePage, NotFoundPage } from "~/pages";

const PATH = {
  HOME: "/",
  NOT_FOUND: "*",
};

export const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path={PATH.HOME} element={<HomePage />} />
      <Route path={PATH.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
