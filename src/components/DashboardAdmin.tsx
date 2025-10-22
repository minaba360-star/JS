import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

const API_URL = "http://localhost:3000/candidats";
const API_OFFRES = "http://localhost:3000/offres";

const DashboardAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [specialites, setSpecialites] = useState<string[]>([]);
  const [selectedSpecialite, setSelectedSpecialite] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ total: number; parSpecialite: Record<string, number> }>({ total: 0, parSpecialite: {} });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [offersCount, setOffersCount] = useState<number | null>(null);
  const [filtre, setFiltre] = useState("tous");
  const [adminName, setAdminName] = useState<string>("Admin");

  // 🔹 Vérifier l'admin connecté
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
      navigate("/login");
      return;
    }

    setAdminName(parsedUser.nom || "Admin");
  }, [navigate]);

  // 🔹 Charger les candidats et stats
  const fetchCandidats = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data: Candidat[] = await res.json();
      setCandidats(data);

      const uniqueSpecs = Array.from(new Set(data.map((c) => c.specialite))).sort();
      setSpecialites(uniqueSpecs);

      const parSpec: Record<string, number> = {};
      data.forEach((c) => {
        parSpec[c.specialite] = (parSpec[c.specialite] || 0) + 1;
      });
      setStats({ total: data.length, parSpecialite: parSpec });
    } catch (err) {
      console.error("Erreur fetch candidats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffersCount = async () => {
    try {
      const res = await fetch(API_OFFRES);
      if (!res.ok) {
        setOffersCount(null);
        return;
      }
      const data = await res.json();
      setOffersCount(Array.isArray(data) ? data.length : Number(data.total ?? 0));
    } catch {
      setOffersCount(null);
    }
  };

  useEffect(() => {
    fetchCandidats();
    fetchOffersCount();
  }, []);

  // 🔹 Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🔹 Changement statut
  const handleChangeStatut = async (id: number, newStatut: string) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatut }),
      });
      fetchCandidats();
    } catch (err) {
      console.error("Erreur mise à jour statut:", err);
    }
  };

  // 🔹 Export Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(candidats);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidats");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "candidats.xlsx");
  };

  const handleExportCurrentPageExcel = () => {
    const start = (currentPage - 1) * pageSize;
    const pageItems = filteredCandidats.slice(start, start + pageSize);
    const worksheet = XLSX.utils.json_to_sheet(pageItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Page");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), `candidats_page_${currentPage}.xlsx`);
  };

  // 🔹 Télécharger fichiers
  const handleDownloadPDF = (cand: Candidat) => {
    const links = Object.entries(cand.fichiers || {}).filter(([_, url]) => !!url);
    if (links.length === 0) {
      alert("Aucun document disponible pour ce candidat.");
      return;
    }
    links.forEach(([type, url]) => {
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `${cand.prenom}_${cand.nom}_${type}.pdf`;
        link.click();
      }
    });
  };

  // 🔹 Filtrage et recherche
  const filteredCandidats = candidats
    .filter((c) => {
      if (filtre === "accepte") return c.statut === "accepte";
      if (filtre === "refuse") return c.statut === "refuse";
      return true;
    })
    .filter((c) => {
      const matchesSpec = selectedSpecialite ? c.specialite === selectedSpecialite : true;
      const term = searchTerm.trim().toLowerCase();
      if (!term) return matchesSpec;
      const combined = `${c.nom} ${c.prenom} ${c.email} ${c.specialite} ${c.niveau}`.toLowerCase();
      return matchesSpec && combined.includes(term);
    });

  // Pagination
  const totalItems = filteredCandidats.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pageCandidats = filteredCandidats.slice(startIndex, startIndex + pageSize);

  const totalCandidats = candidats.length;
  const totalAcceptes = candidats.filter((c) => c.statut === "accepte").length;
  const totalRejetes = candidats.filter((c) => c.statut === "refuse").length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-blue-800">Tableau de bord Admin</h1>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-gray-700 font-medium">{adminName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 max-w-6xl mx-auto">
        <div className="bg-white text-blue-700 rounded-2xl shadow-md p-5 flex items-center gap-4 border-t-4 border-blue-400 hover:shadow-lg transition-transform hover:-translate-y-1">
          <div className="p-3 rounded-full bg-blue-100">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V5a4 4 0 00-8 0v6M5 20h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="text-sm uppercase tracking-wider text-gray-500">Inscrits</div>
            <div className="text-3xl font-semibold">{stats.total}</div>
            <div className="text-xs text-gray-400">Total des candidats</div>
          </div>
        </div>

        <div className="bg-white text-blue-700 rounded-2xl shadow-md p-5 flex items-center gap-4 border-t-4 border-blue-400 hover:shadow-lg transition-transform hover:-translate-y-1">
          <div className="p-3 rounded-full bg-blue-100">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a4 4 0 118 0v6m-5 3h2" />
            </svg>
          </div>
          <div>
            <div className="text-sm uppercase tracking-wider text-gray-500">Offres</div>
            <div className="text-3xl font-semibold">{offersCount ?? "—"}</div>
            <div className="text-xs text-gray-400">Récupérées depuis /offres</div>
          </div>
        </div>

        <div className="bg-white text-blue-700 rounded-2xl shadow-md p-5 flex items-center gap-4 border-t-4 border-blue-500 hover:shadow-lg transition-transform hover:-translate-y-1">
          <div className="p-3 rounded-full bg-blue-100">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h2a2 2 0 012 2v8h12v-8a2 2 0 012-2h2" />
            </svg>
          </div>
          <div>
            <div className="text-sm uppercase tracking-wider text-gray-500">Accep./Rej.</div>
            <div className="text-3xl font-semibold">{totalAcceptes}/{totalRejetes}</div>
            <div className="text-xs text-gray-400">Candidatures traitées</div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <input
          type="text"
          placeholder="Rechercher par nom, email, spécialité..."
          className="p-2 rounded-lg border border-gray-300 flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 rounded-lg border border-gray-300"
          value={selectedSpecialite}
          onChange={(e) => setSelectedSpecialite(e.target.value)}
        >
          <option value="">Toutes les spécialités</option>
          {specialites.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
        <select
          className="p-2 rounded-lg border border-gray-300"
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
        >
          <option value="tous">Tous</option>
          <option value="accepte">Accepté</option>
          <option value="refuse">Refusé</option>
        </select>
        <button
          onClick={handleExportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Exporter Excel
        </button>
      </div>

      {/* Tableau des candidats */}
      <div className="max-w-6xl mx-auto overflow-x-auto bg-white rounded-xl shadow-md p-4">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Nom</th>
              <th className="border px-3 py-2">Prénom</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Spécialité</th>
              <th className="border px-3 py-2">Niveau</th>
              <th className="border px-3 py-2">Statut</th>
              <th className="border px-3 py-2">Fichiers</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageCandidats.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{c.nom}</td>
                <td className="border px-3 py-2">{c.prenom}</td>
                <td className="border px-3 py-2">{c.email}</td>
                <td className="border px-3 py-2">{c.specialite}</td>
                <td className="border px-3 py-2">{c.niveau}</td>
                <td className="border px-3 py-2">
                  <select
                    value={c.statut || ""}
                    onChange={(e) => handleChangeStatut(c.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="">En attente</option>
                    <option value="accepte">Accepté</option>
                    <option value="refuse">Refusé</option>
                  </select>
                </td>
                <td className="border px-3 py-2">
                  {c.fichiers ? (
                    <button
                      onClick={() => handleDownloadPDF(c)}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Télécharger
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => alert("Fonctionnalité à implémenter")}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50 transition"
          >
            Précédent
          </button>
          <span className="text-gray-700">
            Page {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50 transition"
          >
            Suivant
          </button>
          <button
            onClick={handleExportCurrentPageExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Export page Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
