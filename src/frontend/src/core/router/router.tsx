import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HomePage, NotFoundPage } from "~/pages";
import { Layout } from "~/core/layout";

export const Router = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);
