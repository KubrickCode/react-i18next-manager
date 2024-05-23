import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HomePage, NotFoundPage } from "~/pages";
import { Layout } from "~/layout";

export const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);
