import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import FormulaireInscription from "./components/FormulaireInscription";
import Login from "./components/Login";
import DashboardCandidat from "./components/DashboardCandidat";
import DashboardAdmin from "./components/DashboardAdmin";
import Recruteur from "./components/Recruteur";
import Accueil from "./components/Accueil";
import DetailOffre from "./components/DetailOffre";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Layout principal : gère Navbar/Footer selon la page
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // ✅ On cache Navbar & Footer pour toutes les routes dashboard
  const hideNavbarFooter =
    location.pathname.startsWith("/dashboard") || location.pathname === "/admin";

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      {children}
      {!hideNavbarFooter && <Footer />}
    </>
  );
};

const App: React.FC = () => {
  // ✅ Le useEffect doit être DANS le composant
  useEffect(() => {
    // Supprimer les infos utilisateur quand la page est fermée ou rechargée
    const handleUnload = () => {
      localStorage.removeItem("user");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<Accueil />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<FormulaireInscription />} />

          {/* Recruteur */}
          <Route path="/recruteur" element={<Recruteur />} />

          {/* Dashboard candidat */}
          <Route path="/dashboardcandidat" element={<DashboardCandidat />} />

          {/* Dashboard admin */}
          <Route path="/admin" element={<DashboardAdmin />} />

          {/* Détail offre */}
          <Route path="/offre/:id" element={<DetailOffre />} />

          {/* 404 */}
          <Route
            path="*"
            element={<div className="p-10 text-center">Page non trouvée ❌</div>}
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
