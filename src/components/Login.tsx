import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface User {
  email: string;
  password: string;
  prenom?: string;
  nom?: string;
  role?: "admin" | "candidat" | "recruteur";
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = "http://localhost:3000";

  // ✅ Si déjà connecté, rediriger selon le rôle
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored) as User;
      if (parsed.role === "admin") navigate("/admin", { replace: true });
      if (parsed.role === "candidat") navigate("/dashboardcandidat", { replace: true });
      if (parsed.role === "recruteur") navigate("/recruteur-dashboard", { replace: true });
    }
  }, [navigate]);

  // ✅ Fonction de connexion
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // --- Vérifier si admin ---
      const adminEmails = ["minaba360@gmail.com", "alinemangane8@gmail.com"];
      const adminPassword = "admin123";

      if (adminEmails.includes(email) && password === adminPassword) {
        const adminUser: User = {
          email, role: "admin", nom: "Administrateur",
          password: ""
        };
        localStorage.setItem("user", JSON.stringify(adminUser));

        Swal.fire({
          icon: "success",
          title: "👑 Bienvenue Administrateur !",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/admin", { replace: true });
        return;
      }

      // --- Vérifier si candidat ---
      const resCand = await fetch(`${API_URL}/candidats`);
      const candidats: User[] = await resCand.json();
      const candidat = candidats.find(
        (u) => u.email === email && u.password === password
      );

      if (candidat) {
        const userData = { ...candidat, role: "candidat" };
        localStorage.setItem("user", JSON.stringify(userData));

        Swal.fire({
          icon: "success",
          title: `🎓 Bienvenue ${candidat.prenom ?? ""} ${candidat.nom ?? ""} !`,
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/dashboardcandidat", { replace: true });
        return;
      }

      // --- Vérifier si recruteur ---
      const resRec = await fetch(`${API_URL}/recruteurs`);
      const recruteurs: User[] = await resRec.json();
      const recruteur = recruteurs.find(
        (u) => u.email === email && u.password === password
      );

      if (recruteur) {
        const userData = { ...recruteur, role: "recruteur" };
        localStorage.setItem("user", JSON.stringify(userData));

        Swal.fire({
          icon: "success",
          title: `🏢 Bienvenue ${recruteur.nom ?? ""} (Recruteur) !`,
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/recruteur-dashboard", { replace: true });
        return;
      }

      // ❌ Aucun utilisateur trouvé
      Swal.fire({
        icon: "error",
        title: "Email ou mot de passe incorrect !",
        showConfirmButton: false,
        timer: 1800,
      });
    } catch (err) {
      console.error("Erreur :", err);
      Swal.fire({
        icon: "warning",
        title: "⚠ Serveur inaccessible",
        text: "Vérifie que ton json-server est bien lancé sur le port 3000.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">
          Connexion à votre espace
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@mail.com"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-2" /> Se souvenir de moi
            </label>
            <Link
              to="/mot-de-passe-oublie"
              className="text-sm text-blue-700 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-500 transition font-semibold"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <p className="text-center text-gray-600 text-sm mt-3">
            Pas encore de compte ?{" "}
            <Link
              to="/inscription"
              className="text-blue-700 font-semibold hover:underline"
            >
              S’inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
