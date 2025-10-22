import React, { useState, useEffect, type ChangeEvent, useCallback } from "react";

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
}

interface Filter {
  specialite: string;
  date: string;
  diplome: string;
  statut: string;
}

interface Stats {
  total: number;
  parSpecialite: Record<string, number>;
}

const API_URL = "https://localhost:3000/candidatures"; // ← à remplacer par ton endpoint

const AdminCandidatures: React.FC = () => {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [filteredCandidats, setFilteredCandidats] = useState<Candidat[]>([]);
  const [filter, setFilter] = useState<Filter>({ specialite: "", date: "", diplome: "", statut: "" });
  const [stats, setStats] = useState<Stats>({ total: 0, parSpecialite: {} });
  const [loading, setLoading] = useState(false);

  // 🔹 Récupération des candidatures depuis le serveur
  const fetchCandidats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data: Candidat[] = await res.json();
      setCandidats(data);

      // Appliquer les filtres
      let filtered = data;
      if (filter.specialite) {
        filtered = filtered.filter((c) =>
          c.specialite.toLowerCase().includes(filter.specialite.toLowerCase())
        );
      }
      if (filter.statut) {
        filtered = filtered.filter((c) => (c.statut || "en_attente") === filter.statut);
      }
      setFilteredCandidats(filtered);

      // Calcul des stats
      const parSpecialite: Record<string, number> = {};
      filtered.forEach((c) => {
        parSpecialite[c.specialite] = (parSpecialite[c.specialite] || 0) + 1;
      });
      setStats({ total: filtered.length, parSpecialite });
    } catch (err) {
      console.error("Erreur fetch candidatures:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchCandidats();
  }, [fetchCandidats]);

  // 🔹 Filtres
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Modifier le statut d’un candidat côté serveur
  const handleChangeStatut = async (id: number, newStatut: string) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH", // ou PUT selon ton API
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatut }),
      });

      // Mettre à jour localement pour re-render
      const updated = candidats.map((c) =>
        c.id === id ? { ...c, statut: newStatut } : c
      );
      setCandidats(updated);
      fetchCandidats();
    } catch (err) {
      console.error("Erreur mise à jour statut:", err);
    }
  };

  // 🔹 Export JSON
  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredCandidats, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "candidatures.json";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Tableau de bord des candidatures
      </h1>

      {/* 🔍 Filtres */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          name="specialite"
          placeholder="Spécialité"
          className="border p-2 rounded"
          onChange={handleFilterChange}
        />
        <select
          name="statut"
          className="border p-2 rounded"
          onChange={handleFilterChange}
        >
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="accepte">Accepté</option>
          <option value="refuse">Refusé</option>
        </select>
        <button
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-orange-500 transition"
          onClick={fetchCandidats}
        >
          Filtrer
        </button>
      </div>

      {loading && <p className="text-center mb-4">Chargement des candidatures...</p>}

      {/* 📊 Statistiques */}
      <div className="bg-white shadow rounded-lg p-4 mb-6 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-2">Statistiques</h2>
        <p>Total candidatures : {stats.total}</p>
        <ul className="list-disc list-inside">
          {Object.entries(stats.parSpecialite).map(([spec, count]) => (
            <li key={spec}>
              {spec} : {count}
            </li>
          ))}
        </ul>
      </div>

      {/* 📋 Liste des candidatures */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow bg-white rounded-lg">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Prénom</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Spécialité</th>
              <th className="border p-2">Niveau</th>
              <th className="border p-2">Expérience</th>
              <th className="border p-2">Statut</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidats.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-500">
                  Aucune candidature trouvée.
                </td>
              </tr>
            ) : (
              filteredCandidats.map((c) => (
                <tr key={c.id} className="hover:bg-gray-100">
                  <td className="border p-2">{c.nom}</td>
                  <td className="border p-2">{c.prenom}</td>
                  <td className="border p-2">{c.email}</td>
                  <td className="border p-2">{c.specialite}</td>
                  <td className="border p-2">{c.niveau}</td>
                  <td className="border p-2">{c.experience}</td>
                  <td className="border p-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        c.statut === "accepte"
                          ? "bg-green-600"
                          : c.statut === "refuse"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {c.statut || "en_attente"}
                    </span>
                  </td>
                  <td className="border p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                        onClick={() => handleChangeStatut(c.id, "accepte")}
                      >
                        ✅ Accepter
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                        onClick={() => handleChangeStatut(c.id, "refuse")}
                      >
                        ❌ Refuser
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📤 Export */}
      <div className="mt-6 flex justify-center">
        <button
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-orange-500 transition"
          onClick={handleExportJSON}
        >
          Exporter en JSON
        </button>
      </div>
    </div>
  );
};

export default AdminCandidatures;
