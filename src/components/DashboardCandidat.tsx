import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Candidat {
  id: number;
  prenom: string;
  nom: string;
  dateNaissance: string;
  lieuNaissance: string;
  email: string;
  cin: string;
  tel: string;
  adresse: string;
  niveau: string;
  specialite: string;
  experience: number;
  statut?: string;
  fichiers?: {
    cv?: string | null;
    diplome?: string | null;
    lettre?: string | null;
  };
}

const DashboardCandidat: React.FC = () => {
  const navigate = useNavigate();
  const [candidat, setCandidat] = useState<Candidat | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Récupération auto du candidat connecté
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "candidat") {
      navigate("/login");
      return;
    }

    const userEmail = parsedUser.email;

    const fetchCandidatData = async () => {
      try {
        const response = await fetch("http://localhost:3000/candidats");
        if (!response.ok) throw new Error("Erreur de récupération");

        const data: Candidat[] = await response.json();
        const found = data.find((c) => c.email === userEmail);
        if (found) setCandidat(found);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatData();
    const interval = setInterval(fetchCandidatData, 5000); // refresh automatique
    return () => clearInterval(interval);
  }, [navigate]);

  // 🔹 Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🔹 Téléchargement fichier
  const handleDownload = (url: string | null | undefined, filename: string) => {
    if (!url) {
      alert("Aucun fichier disponible !");
      return;
    }
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        Chargement de vos informations...
      </div>
    );
  }

  if (!candidat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        Candidat non trouvé.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-blue-800">Tableau de bord Candidat</h1>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-gray-700 font-medium">
            {candidat.prenom} {candidat.nom}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Bonjour, <span className="text-blue-700">{candidat.prenom} {candidat.nom}</span>
        </h2>

        {/* Tableau des informations */}
        <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
          <tbody>
            <tr className="bg-gray-100">
              <td className="border border-gray-300 px-4 py-2 font-medium">Email</td>
              <td className="border border-gray-300 px-4 py-2">{candidat.email}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">CIN</td>
              <td className="border border-gray-300 px-4 py-2">{candidat.cin}</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="border border-gray-300 px-4 py-2 font-medium">Téléphone</td>
              <td className="border border-gray-300 px-4 py-2">{candidat.tel}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Adresse</td>
              <td className="border border-gray-300 px-4 py-2">{candidat.adresse}</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="border border-gray-300 px-4 py-2 font-medium">Date de naissance</td>
              <td className="border border-gray-300 px-4 py-2">{candidat.dateNaissance}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Lieu de naissance</td>
              <td className="border border-gray-300 px-4 py-2">{candidat.lieuNaissance}</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="border border-gray-300 px-4 py-2 font-medium">Niveau</td>
              <td className="border border-gray-300 px-4 py-2">{candidat.niveau}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Spécialité</td>
              <td className="border border-gray-300 px-4 py-2">{candidat.specialite}</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="border border-gray-300 px-4 py-2 font-medium">Expérience</td>
              <td className="border border-gray-300 px-4 py-2">{candidat.experience} an(s)</td>
            </tr>
          </tbody>
        </table>

        {/* Statut de candidature */}
        <div className="mt-6 text-center">
          <p className="font-semibold">
            Statut de candidature :
            <span
              className={`ml-2 px-3 py-1 rounded-full text-white ${
                candidat.statut === "accepte"
                  ? "bg-green-600"
                  : candidat.statut === "refuse"
                  ? "bg-red-600"
                  : "bg-yellow-500"
              }`}
            >
              {candidat.statut || "en attente"}
            </span>
          </p>
        </div>

        {/* Fichiers */}
        {candidat.fichiers && (
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Mes documents :</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {candidat.fichiers.cv && (
                <button
                  onClick={() => handleDownload(candidat.fichiers?.cv, "CV.pdf")}
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  📄 CV
                </button>
              )}
              {candidat.fichiers.diplome && (
                <button
                  onClick={() => handleDownload(candidat.fichiers?.diplome, "Diplome.pdf")}
                  className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
                >
                  🎓 Diplôme
                </button>
              )}
              {candidat.fichiers.lettre && (
                <button
                  onClick={() => handleDownload(candidat.fichiers?.lettre, "Lettre.pdf")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  ✉️ Lettre
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCandidat;
