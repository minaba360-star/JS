import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Briefcase } from "lucide-react";
import { offersData, type Offer } from "../data/offers";

const DetailOffre: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const offer = offersData.find(o => o.id === parseInt(id || "0"));

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Offre non trouvée</h1>
          <p className="text-gray-600 mb-6">L'offre que vous recherchez n'existe pas.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-950 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition border-2 border-blue-950"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const handlePostuler = () => {
    navigate("/inscription");
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Bouton retour */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-blue-950 hover:text-blue-800 mb-6 transition border-2 border-blue-950 rounded-lg px-4 py-2"
        >
          <ArrowLeft size={20} className="mr-2" />
          Retour aux offres
        </button>

        {/* En-tête de l'offre */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{offer.title}</h1>
              <p className="text-xl text-blue-950 font-semibold mb-4">{offer.company}</p>
              
              <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {offer.location}
                </div>
                <div className="flex items-center">
                  <Briefcase size={16} className="mr-1" />
                  {offer.type}
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  Publié le {new Date(offer.publishedDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
            
            <div className="md:ml-6">
              <button
                onClick={handlePostuler}
                className="bg-blue-950 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition font-semibold text-lg"
              >
                Postuler maintenant
              </button>
            </div>
          </div>

          {/* Informations clés */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800">Type de contrat</h3>
              <p className="text-gray-600">{offer.contractType}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Expérience requise</h3>
              <p className="text-gray-600">{offer.experience}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Niveau d'étude</h3>
              <p className="text-gray-600">{offer.education}</p>
            </div>
          </div>
        </div>

        {/* Description complète */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Description du poste</h2>
          <p className="text-gray-700 leading-relaxed">{offer.fullDescription}</p>
        </div>

        {/* Responsabilités */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Responsabilités</h2>
          <ul className="space-y-2">
            {offer.responsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-950 mr-2">•</span>
                <span className="text-gray-700">{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prérequis */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Prérequis</h2>
          <ul className="space-y-2">
            {offer.prerequisites.map((prerequisite, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-950 mr-2">•</span>
                <span className="text-gray-700">{prerequisite}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Compétences */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Compétences requises</h2>
          <div className="flex flex-wrap gap-2">
            {offer.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Avantages */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Avantages</h2>
          <ul className="space-y-2">
            {offer.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Informations pratiques */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Informations pratiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Date limite de candidature</h3>
              <p className="text-gray-600">{new Date(offer.deadline).toLocaleDateString('fr-FR')}</p>
            </div>
            {offer.salary && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Rémunération</h3>
                <p className="text-gray-600">{offer.salary}</p>
              </div>
            )}
          </div>
        </div>

        {/* Bouton postuler en bas */}
        <div className="text-center">
          <button
            onClick={handlePostuler}
            className="bg-blue-950 text-white px-12 py-4 rounded-lg hover:bg-blue-800 transition font-semibold text-xl"
          >
            Postuler à cette offre
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailOffre;
