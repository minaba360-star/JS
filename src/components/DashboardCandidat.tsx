import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Offre {
  id: number;
  titre: string;
  entreprise: string;
  statut: string;
}

interface Candidat {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  dateNaissance: string;
  lieuNaissance: string;
  cin: string;
  tel: string;
  adresse: string;
  niveau: string;
  specialite: string;
  experience: number;
  fichiers?: {
    cv?: string;
    diplome?: string;
    lettre?: string;
  };
}

const DashboardCandidat: React.FC = () => {
  const navigate = useNavigate();
  const [candidat, setCandidat] = useState<Candidat | null>(null);
  const [offres, setOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== "candidat") {
      navigate("/login");
      return;
    }
    setCandidat(user);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    const fetchOffres = async () => {
      if (!candidat) return;
      try {
        const res = await fetch(
          `http://localhost:3000/offresCandidats?candidatId=${candidat.id}`
        );
        if (res.ok) {
          const data: Offre[] = await res.json();
          setOffres(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des offres :", error);
      }
    };
    fetchOffres();
  }, [candidat]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading || !candidat)
    return (
      <div className="flex items-center justify-center h-screen">
        Chargement...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md fixed h-screen z-40">
        <div className="p-4 border-b">
          <h2 className="text-center text-blue-800 font-bold mt-2">JobSpace</h2>
        </div>
        <nav className="mt-4 px-4">
          <h1 className="text-xl font-bold text-blue-800 mb-3">Tableau de bord</h1>
          <button
            onClick={() => scrollToSection("profil")}
            className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
          >
            Mon profil
          </button>
          <button
            onClick={() => scrollToSection("candidatures")}
            className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
          >
            Mes candidatures
          </button>
          <button
            onClick={() => scrollToSection("fichiers")}
            className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
          >
            Mes Fichiers
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src="https://sigof.onfp.sn/storage/avatars/default.png"
              className="h-8 w-8 rounded-full"
              alt="Profil"
            />
            <span className="text-gray-700 font-medium">
              {candidat.prenom} {candidat.nom}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Déconnexion
          </button>
        </header>

        <main className="p-6 space-y-16">
          {/* Profil */}
          <section id="profil">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Mon profil</h2>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Mes informations personnelles
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><strong>Nom :</strong> {candidat.nom}</p>
                <p><strong>Prénom :</strong> {candidat.prenom}</p>
                <p><strong>Email :</strong> {candidat.email}</p>
                <p><strong>CIN :</strong> {candidat.cin}</p>
                <p><strong>Téléphone :</strong> {candidat.tel}</p>
                <p><strong>Adresse :</strong> {candidat.adresse}</p>
                <p><strong>Date de naissance :</strong> {candidat.dateNaissance}</p>
                <p><strong>Lieu de naissance :</strong> {candidat.lieuNaissance}</p>
                <p><strong>Niveau :</strong> {candidat.niveau}</p>
                <p><strong>Spécialité :</strong> {candidat.specialite}</p>
                <p><strong>Expérience :</strong> {candidat.experience} an(s)</p>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => navigate(`/modifiercandidat/${candidat.id}`)}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                  Modifier mes informations
                </button>
              </div>
            </div>
          </section>

          {/* Candidatures */}
          <section id="candidatures">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Mes candidatures</h2>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {offres.length === 0 ? (
                <p className="text-gray-600">
                  Aucune offre postulée pour le moment.
                </p>
              ) : (
                <table className="table-auto w-full border border-gray-300 rounded-lg shadow-sm bg-white">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Titre</th>
                      <th className="px-4 py-2 text-left">Entreprise</th>
                      <th className="px-4 py-2 text-center">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offres.map((offre) => (
                      <tr key={offre.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-2">{offre.titre}</td>
                        <td className="px-4 py-2">{offre.entreprise}</td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-white text-sm ${
                              offre.statut === "accepte"
                                ? "bg-green-600"
                                : offre.statut === "refuse"
                                ? "bg-red-600"
                                : "bg-yellow-500"
                            }`}
                          >
                            {offre.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Fichiers */}
          <section id="fichiers">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Mes fichiers</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {["cv", "diplome", "lettre"].map((fileType) => (
                  <div
                    key={fileType}
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md"
                  >
                    <p className="font-semibold text-gray-800 mb-2">
                      {fileType === "cv"
                        ? "📄 CV"
                        : fileType === "diplome"
                        ? "🎓 Diplôme"
                        : "✉️ Lettre de motivation"}
                    </p>
                    {candidat.fichiers?.[fileType as keyof typeof candidat.fichiers] ? (
                      <a
                        href={
                          candidat.fichiers[fileType as keyof typeof candidat.fichiers]
                        }
                        download={fileType}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 font-medium hover:underline"
                      >
                        Voir / Télécharger
                      </a>
                    ) : (
                      <p className="text-gray-500 italic">Aucun fichier</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardCandidat;
