import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "./ui/spinner";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] dark flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-12 h-12 mx-auto mb-4" />
          <p className="text-[#9CA3AF]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
