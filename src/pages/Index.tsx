import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/stores/auth-store";

const Index = () => {
  const sessionToken = useAuthStore((state) => state.sessionToken);
  return <Navigate to={sessionToken ? "/hub" : "/login"} replace />;
};

export default Index;
