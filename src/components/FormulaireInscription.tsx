import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const FormulaireInscription: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    dateNaissance: "",
    lieuNaissance: "",
    email: "",
    cin: "",
    tel: "",
    adresse: "",
    password: "",
    confirmPassword: "",
    niveau: "",
    specialite: "",
    experience: "",
    cv: null as File | null,
    diplome: null as File | null,
    lettre: null as File | null,
    cvPreview: "",
    diplomePreview: "",
    lettrePreview: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [id]: files && files.length > 0 ? files[0] : value,
    }));
  };

  const isPasswordValid = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid(formData.password)) {
      Swal.fire({
        icon: "warning",
        title:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Les mots de passe ne correspondent pas !",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        Swal.fire({
          icon: "warning",
          title: `Veuillez remplir le champ : ${key}`,
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }
    }

    try {
      const cv64 = formData.cv ? await fileToBase64(formData.cv) : null;
      const diplome64 = formData.diplome
        ? await fileToBase64(formData.diplome)
        : null;
      const lettre64 = formData.lettre
        ? await fileToBase64(formData.lettre)
        : null;

      const newCandidat = {
        id: Date.now(),
        prenom: formData.prenom,
        nom: formData.nom,
        dateNaissance: formData.dateNaissance,
        lieuNaissance: formData.lieuNaissance,
        email: formData.email,
        cin: formData.cin,
        tel: formData.tel,
        adresse: formData.adresse,
        password: formData.password,
        niveau: formData.niveau,
        specialite: formData.specialite,
        experience: formData.experience,
        statut: "en_attente",
        fichiers: {
          cv: cv64,
          diplome: diplome64,
          lettre: lettre64,
        },
      };

      const response = await fetch("http://localhost:3000/candidats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCandidat),
      });

      if (!response.ok) throw new Error("Erreur lors de l’enregistrement.");

      Swal.fire({
        icon: "success",
        title: "Inscription réussie ! Bienvenue sur JobSpace.",
        showConfirmButton: false,
        timer: 2000,
      });

      const userData = {
        email: formData.email,
        role: "candidat",
        prenom: formData.prenom,
        nom: formData.nom,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboardcandidat", { replace: true });
    } catch  {
      Swal.fire({
        icon: "error",
        title: "Une erreur est survenue pendant l’inscription.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col pt-16">
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center mb-12">
          <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-3">
            Formulaire d’inscription de candidature
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
            {/* --- Grille principale --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prénom */}
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Prénom
                </label>
                <input
                  id="prenom"
                  type="text"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Entrez votre prénom"
                />
              </div>

              {/* Nom */}
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Nom
                </label>
                <input
                  id="nom"
                  type="text"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  placeholder="Entrez votre nom"
                />
              </div>
            </div>

            {/* --- Date / Lieu de naissance --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Date de naissance
                </label>
                <input
                  id="dateNaissance"
                  type="date"
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Lieu de naissance
                </label>
                <input
                  id="lieuNaissance"
                  type="text"
                  placeholder="Ville"
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* --- Email / CIN --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  placeholder="exemple@mail.com"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Numéro CIN
                </label>
                <input
                  id="cin"
                  type="text"
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* --- Téléphone / Adresse --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Téléphone
                </label>
                <input
                  id="tel"
                  type="tel"
                  placeholder="77 000 00 00"
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Adresse
                </label>
                <input
                  id="adresse"
                  type="text"
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre adresse complète"
                />
              </div>
            </div>

            {/* --- Mot de passe / Confirmation --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full border rounded-lg p-3 pr-10 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Confirmer mot de passe
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full border rounded-lg p-3 pr-10 focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
            </div>

            {/* --- Niveau / Spécialité --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Niveau d’étude
                </label>
                <select
                  id="niveau"
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Sélectionnez un niveau --</option>
                  <option value="Master">Master</option>
                  <option value="Licence">Licence</option>
                  <option value="Bac+2">Bac+2</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Spécialité
                </label>
                <select
                  id="specialite"
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
            </div>

            {/* --- Expérience --- */}
          <div>
  <label className="block text-gray-600 font-semibold mb-1">
    Années d’expérience
  </label>
  <input
    id="experience"
    type="number"
    placeholder="Ex : 2"
    min="0"
    step="1"
    onChange={handleChange}
    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
  />
</div>


            {/* --- Fichiers --- */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* === CV === */}
              <div>
                <label className="block text-sm font-medium mb-1">CV</label>
                <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  required
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      setFormData((prev) => ({
                        ...prev,
                        cvPreview: URL.createObjectURL(file),
                      }));
                    }
                  }}
                />
                <label
                  htmlFor="cv"
                  className="block bg-blue-900 text-white text-center py-2 rounded-lg cursor-pointer hover:bg-blue-500 transition"
                >
                  📎 Joindre CV
                </label>

                {/* Affichage du fichier sélectionné */}
                {formData.cv && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>📄 {formData.cv.name}</p>
                    <a
                      href={formData.cvPreview}
                      download={formData.cv.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Voir / Télécharger
                    </a>
                  </div>
                )}
              </div>

              {/* === Diplôme === */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Diplôme
                </label>
                <input
                  id="diplome"
                  type="file"
                  accept=".pdf,.jpg,.png"
                  className="hidden"
                  required
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      setFormData((prev) => ({
                        ...prev,
                        diplomePreview: URL.createObjectURL(file),
                      }));
                    }
                  }}
                />
                <label
                  htmlFor="diplome"
                  className="block bg-blue-800 text-white text-center py-2 rounded-lg cursor-pointer hover:bg-blue-500 transition"
                >
                  🎓 Joindre Diplôme
                </label>

                {formData.diplome && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>📑 {formData.diplome.name}</p>
                    <a
                      href={formData.diplomePreview}
                      download={formData.diplome.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Voir / Télécharger
                    </a>
                  </div>
                )}
              </div>

              {/* === Lettre de motivation === */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Lettre de motivation
                </label>
                <input
                  id="lettre"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  required
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      setFormData((prev) => ({
                        ...prev,
                        lettrePreview: URL.createObjectURL(file),
                      }));
                    }
                  }}
                />
                <label
                  htmlFor="lettre"
                  className="block bg-blue-800 text-white text-center py-2 rounded-lg cursor-pointer hover:bg-blue-500 transition"
                >
                  ✉️ Joindre Lettre
                </label>

                {formData.lettre && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>📝 {formData.lettre.name}</p>
                    <a
                      href={formData.lettrePreview}
                      download={formData.lettre.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Voir / Télécharger
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* --- Bouton --- */}
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-800 transition-transform transform hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              S’inscrire
            </button>

            <p className="text-center text-gray-600 mt-3">
              Déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-blue-700 font-medium hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default FormulaireInscription;
