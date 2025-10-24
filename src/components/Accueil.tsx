import { useState } from "react";
import Hero from "./Hero";
import { useNavigate } from "react-router-dom";
import { offersData, type Offer } from "../data/offers";

// On utilise directement les données centralisées
const sampleOffers = offersData;

function Accueil() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Offre");
  const [filterLocation, setFilterLocation] = useState("Région");
  const [filterDomain, setFilterDomain] = useState("Domaine");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const offersPerPage = 6;

  const locations = ["Région", ...new Set(sampleOffers.map((o) => o.location))];
  const domains = ["Domaine", ...new Set(sampleOffers.map((o) => o.domain))];

  const filteredOffers = sampleOffers.filter((offer) => {
    const matchSearch = offer.title.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "Offre" || offer.type === filterType;
    const matchLocation = filterLocation === "Région" || offer.location === filterLocation;
    const matchDomain = filterDomain === "Domaine" || offer.domain === filterDomain;
    return matchSearch && matchType && matchLocation && matchDomain;
  });

  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirstOffer, indexOfLastOffer);

  const handlePrev = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };

  // Icônes simples pour domaines
  const domaine: Record<string, string> = {
    Informatique : "",
    Marketing : "",
    Finance : "",
    RH : "",
    Offre : "",
  };

  // Gestion du clic sur "Postuler"
  function handleApply(offer: Offer | null) {
    if (!offer) return;
    const stored = localStorage.getItem("user");
    const parsed = stored ? (JSON.parse(stored) as { role?: string }) : null;

    if (parsed?.role === "candidat") {
      navigate("/dashboardcandidat");
      return;
    }

    // Sinon → redirection vers inscription
    navigate("/inscription");
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <section id="hero"><Hero /></section>

      {/* Offres */}
      <section id="offers" className="container mx-auto px-4 my-10 space-y-6">
        <h3 className="text-3xl text-center font-extrabold text-blue-600 to-indigo-600 mb-6">
          Offres récentes
        </h3>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Rechercher une offre..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 flex-1"
          />
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          >
            <option value="Offre">Offres</option>
            <option value="Stage">Stage</option>
            <option value="Emploi">Emploi</option>
          </select>
          <select
            value={filterLocation}
            onChange={(e) => { setFilterLocation(e.target.value); setCurrentPage(1); }}
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          >
            {locations.map((loc, idx) => <option key={idx} value={loc}>{loc}</option>)}
          </select>
          <select
            value={filterDomain}
            onChange={(e) => { setFilterDomain(e.target.value); setCurrentPage(1); }}
            className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          >
            {domains.map((dom, idx) => <option key={idx} value={dom}>{dom}</option>)}
          </select>
        </div>

        {/* Liste des offres */}
        {currentOffers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <h4 className="font-bold text-gray-800 text-lg mb-2">{offer.title}</h4>
                  <p className="flex items-center text-sm text-gray-600 mb-4 flex-wrap gap-2">
                    <span>{offer.type}</span>
                    <span>{offer.location}</span>
                    <span>{domaine[offer.domain] || ""} {offer.domain}</span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/offre/${offer.id}`)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition"
                    >
                      Voir plus
                    </button>
                    <button
                      onClick={() => handleApply(offer)}
                      className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-xl hover:bg-blue-50 transition"
                    >
                      Postuler
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300 ${
                  currentPage === 1
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-blue-600 border-blue-600 hover:bg-blue-50"
                }`}
              >
                {"<"}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300 ${
                    currentPage === num
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "text-blue-600 border-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300 ${
                  currentPage === totalPages
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-blue-600 border-blue-600 hover:bg-blue-50"
                }`}
              >
                {">"}
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600 italic">Aucune offre trouvée.</p>
        )}
      </section>

      {/* À propos */}
      <section
        id="about"
        className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 px-6 md:px-12"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-600 to-indigo-600 mb-4">
              À propos de JobSpace
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg space-y-4">
              <span className="font-bold">JobSpace</span> votre site de recherche d'emploi au Sénégal !<br />
              Nous connectons étudiants, jeunes diplômés et professionnels aux meilleures opportunités de stages et d’emplois.<br />
              Chaque jeune mérite une chance de montrer son potentiel et contribuer au développement du pays.<br />
              Nous offrons une large gamme d'offres d'emploi et de stages pour trouver votre futur emploi ou stage de choix.
              <br />
              <br />Rejoignez-nous et faites le premier pas vers une carrière réussie !
            </p>
          </div>
          <div className="flex justify-center">
            {/* <img
              src="/JobSpace.png"
              alt="Illustration à propos"
              className="rounded-2xl shadow-xl w-full max-w-md object-cover"
            /> */}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="py-16 px-6 md:px-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-600 to-indigo-600 mb-4">
              Contactez-nous
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une question ? Un projet ? N'hésitez pas à nous contacter, nous serons ravis de vous aider.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Formulaire */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Merci, votre message a bien été envoyé.");
                  (e.target as HTMLFormElement).reset();
                }}
                className="space-y-6"
              >
                <input
                  name="nom"
                  type="text"
                  required
                  placeholder="Nom complet"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="votre@email.com"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Votre message"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Envoyer le message
                </button>
              </form>
            </div>

            {/* Coordonnées */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Nos coordonnées</h3>
                <p>Nous sommes là pour vous accompagner dans votre recherche d'emploi</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="font-semibold text-gray-800 mb-1">Adresse</h4>
                <p className="text-gray-600">Dakar, Sénégal</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                <a
                  href="mailto:support@example.com"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
              jobspace@gmail.com                
                </a>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="font-semibold text-gray-800 mb-1">Téléphone</h4>
                <a
                  href="tel:+221770000000"
                  className="text-blue-600 hover:text-blue-600 font-medium"
                >
                  +221 78 320 57 10 / +221 77 747 56 67
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Accueil;
