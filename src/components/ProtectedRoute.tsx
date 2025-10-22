import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: "jsx.Element";
  requiredRole?: "admin" | "candidat" | "recruteur";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const location = useLocation();
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const parsed = JSON.parse(stored) as { role?: string } | null;
      if (parsed?.role) {
        setUser({ role: parsed.role });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <p className="text-center mt-4">Chargement...</p>;
  }

  if (!user) {
    // Pas connecté → redirige vers login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Connecté mais mauvais rôle → refuse accès
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
