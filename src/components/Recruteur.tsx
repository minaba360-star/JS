import React, { useState } from "react";
import Swal from "sweetalert2";

const Recruteur: React.FC = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Stage");
  const [location, setLocation] = useState("");
  const [domain, setDomain] = useState("");

  const handlePublish = () => {
    if (!title || !location || !domain) {
      Swal.fire("Erreur", "Veuillez remplir tous les champs", "error");
      return;
    }

    // Ici tu peux envoyer les données à ton json-server
    Swal.fire("Succès", "Offre publiée avec succès !", "success");

    // Reset form
    setTitle("");
    setType("Stage");
    setLocation("");
    setDomain("");
  };

  return (
    <div>
      <h2 className="text-blue-600 to-indigo-600 flex justify-center p-20 text-3xl font-bold mb-4">Publier une nouvelle offre</h2>
      <div className="w-full border-collapse border px-35 border-gray-300 rounded-lg">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Titre de l'offre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-10">
          <label className="block mb-1 font-medium">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border rounded p-2">
            <option value="Stage">Stage</option>
            <option value="Emploi">Emploi</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Localisation</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Domaine</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          onClick={handlePublish}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Publier
        </button>
      </div>
    </div>
  );
};

export default Recruteur;
