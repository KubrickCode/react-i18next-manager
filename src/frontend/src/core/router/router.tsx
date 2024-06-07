import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HomePage, NotFoundPage } from "~/pages";
import { Layout } from "~/pages/home/layout";

const PATH = {
  HOME: "/",
  NOT_FOUND: "*",
};

export const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path={PATH.HOME}
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route path={PATH.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
