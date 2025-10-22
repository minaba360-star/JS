import React from "react";
import { Outlet, Link } from "react-router-dom";

interface DashboardLayoutProps {
  role?: "admin" | "candidat" | "recruteur";
}

const DashboardLayout: React.FC<DashboardLayoutProps> = () => {
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) as { role?: string; prenom?: string } : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-800 text-white p-4 flex justify-between items-center shadow-md">
        <div className="text-lg font-bold">Tableau de bord</div>
        <div className="flex items-center gap-4">
          {user?.prenom && <span>Bonjour, {user.prenom}</span>}

          {user?.role === "admin" && (
            <>
              <Link to="/dashboardadmin" className="hover:underline">Admin</Link>
              <Link to="/recruteur" className="hover:underline">Recruteurs</Link>
            </>
          )}

          {user?.role === "candidat" && (
            <Link to="/dashboardcandidat" className="hover:underline">Candidat</Link>
          )}

          {user?.role === "recruteur" && (
            <Link to="/recruteur" className="hover:underline">Publier Offre</Link>
          )}

          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">Déconnexion</button>
        </div>
      </nav>

      {/* Sidebar */}
      {/* <div className="bg-gray-200 p-4 flex flex-col gap-2 shadow-md">
        <Link to="/dashboardadmin" className="hover:underline">Admin</Link>
        <Link to="/recruteur" className="hover:underline">Recruteurs</Link>
        <Link to="/dashboardcandidat" className="hover:underline">Candidat</Link>
      </div> */}

      {/* Contenu */}
      <main className="flex-grow p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
