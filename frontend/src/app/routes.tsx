import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Upload } from "./pages/Upload";
import { Verify } from "./pages/Verify";
import { Search } from "./pages/Search";
import { EvidenceDetail } from "./pages/EvidenceDetail";
import { History } from "./pages/History";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "upload", element: <Upload /> },
      { path: "verify", element: <Verify /> },
      { path: "search", element: <Search /> },
      { path: "evidence/:id", element: <EvidenceDetail /> },
      { path: "history", element: <History /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
