import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ModifierCandidat: React.FC = () => {
  const navigate = useNavigate();
  const [candidat, setCandidat] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Conversion fichier → base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 🔹 Charger le candidat connecté
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!storedUser.email) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3000/candidats?email=${storedUser.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setCandidat(data[0]);
          setFormData(data[0]);
        }
        setLoading(false);
      })
      .catch(() => {
        Swal.fire("Erreur", "Impossible de charger vos informations.", "error");
        setLoading(false);
      });
  }, [navigate]);

  // 🔹 Gestion des changements
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value, files } = e.target as HTMLInputElement;
    setFormData((prev: any) => ({
      ...prev,
      [id]: files && files.length > 0 ? files[0] : value,
    }));
  };

  // 🔹 Enregistrer les modifications
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Gestion des fichiers (CV, Diplôme, Lettre)
      const cv64 =
        formData.cv && formData.cv instanceof File
          ? await fileToBase64(formData.cv)
          : formData.fichiers?.cv || null;

      const diplome64 =
        formData.diplome && formData.diplome instanceof File
          ? await fileToBase64(formData.diplome)
          : formData.fichiers?.diplome || null;

      const lettre64 =
        formData.lettre && formData.lettre instanceof File
          ? await fileToBase64(formData.lettre)
          : formData.fichiers?.lettre || null;

      const updatedCandidat = {
        ...formData,
        fichiers: {
          cv: cv64,
          diplome: diplome64,
          lettre: lettre64,
        },
      };

      const response = await fetch(
        `http://localhost:3000/candidats/${formData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCandidat),
        }
      );

      if (!response.ok) throw new Error();

      Swal.fire({
        icon: "success",
        title: "Profil mis à jour avec succès !",
        showConfirmButton: false,
        timer: 2000,
      });

      // 🪄 Mise à jour du localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...formData,
          role: "candidat",
        })
      );

      navigate("/dashboardcandidat");
    } catch {
      Swal.fire("Erreur", "Impossible de sauvegarder les modifications.", "error");
    }
  };

  if (loading || !formData) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col pt-16">
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center mb-12 w-full max-w-4xl">
          <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
            Modifier mes informations
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- Grille principale --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Prénom</label>
                <input
                  id="prenom"
                  type="text"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Nom</label>
                <input
                  id="nom"
                  type="text"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* --- Autres champs --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Date de naissance</label>
                <input
                  id="dateNaissance"
                  type="date"
                  value={formData.dateNaissance}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Lieu de naissance</label>
                <input
                  id="lieuNaissance"
                  type="text"
                  value={formData.lieuNaissance}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">CIN</label>
                <input
                  id="cin"
                  type="text"
                  value={formData.cin}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Téléphone</label>
                <input
                  id="tel"
                  type="text"
                  value={formData.tel}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Adresse</label>
                <input
                  id="adresse"
                  type="text"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* --- Niveau, spécialité, expérience --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Niveau</label>
                <select
                  id="niveau"
                  value={formData.niveau}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="Master">Master</option>
                  <option value="Licence">Licence</option>
                  <option value="Bac+2">Bac+2</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Spécialité</label>
                <select
                  id="specialite"
                  value={formData.specialite}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="Frontend">Développeur Frontend</option>
                  <option value="Backend">Développeur Backend</option>
                  <option value="Chef de projet">Chef de projet</option>
                  <option value="Administrateur SRI">Administrateur SRI</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Expérience</label>
                <input
                  id="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* --- Fichiers joints --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["cv", "diplome", "lettre"].map((type) => (
                <div key={type}>
                  <label className="block text-gray-600 font-semibold mb-2 capitalize">
                    {type === "cv"
                      ? "CV"
                      : type === "diplome"
                      ? "Diplôme"
                      : "Lettre de motivation"}
                  </label>
                  <input
                    id={type}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleChange}
                  />
                  {formData.fichiers?.[type] && (
                    <a
                      href={formData.fichiers[type]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 text-sm hover:underline"
                    >
                      Voir le fichier actuel
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* --- Bouton --- */}
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-800 transition-transform transform hover:scale-[1.02]"
            >
              Enregistrer les modifications
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboardcandidat")}
              className="w-full mt-2 bg-gray-300 text-gray-800 py-3 rounded-xl text-lg font-semibold hover:bg-gray-400 transition"
            >
              Annuler
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ModifierCandidat;
