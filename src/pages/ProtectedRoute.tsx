import { useAuth0 } from "@auth0/auth0-react";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import Loading from "../components/Loading";

function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <Loading message="Confirming permissions" />;

  return isAuthenticated ? children : <Navigate to="/" />;
}

export default ProtectedRoute;
