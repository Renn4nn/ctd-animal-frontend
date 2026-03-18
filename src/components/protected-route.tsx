import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "@/stores/auth-store";

export const ProtectedRoute = () => {
  const { sessionToken, hydrated } = useAuthStore((state) => ({
    sessionToken: state.sessionToken,
    hydrated: state.hydrated,
  }));
  const location = useLocation();

  if (!hydrated) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Carregando sessão...</div>;
  }

  if (!sessionToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
