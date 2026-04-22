import { RouterProvider } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { EvidenceProvider } from "./contexts/EvidenceContext";
import { router } from "./routes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <EvidenceProvider>
        <Toaster theme="dark" position="top-right" />
        <RouterProvider router={router} />
      </EvidenceProvider>
    </AuthProvider>
  );
}