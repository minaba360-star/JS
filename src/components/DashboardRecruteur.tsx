import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaSearch, FaUserTie, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Offre {
  id: number;
  titre: string;
  type: string;
  localisation: string;
  domaine: string;
  datePublication: string;
  recruteurEmail: string;
}

const DashboardRecruteur: React.FC = () => {
  const navigate = useNavigate();
  const [offres, setOffres] = useState<Offre[]>([]);
  const [filteredOffres, setFilteredOffres] = useState<Offre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [newOffer, setNewOffer] = useState({
    titre: '',
    type: 'Stage',
    localisation: '',
    domaine: '',
  });

  const recruteur = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch des offres
  const fetchOffres = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/offres');
      const data = await response.json();
      const userOffres = data.filter((offre: Offre) => offre.recruteurEmail === recruteur.email);
      setOffres(userOffres);
      setFilteredOffres(userOffres);
    } catch (err) {
      setError('Erreur lors du chargement des offres');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [recruteur.email]);

  useEffect(() => {
    if (!recruteur?.email) {
      navigate('/login');
      return;
    }
    fetchOffres();
  }, [fetchOffres, navigate, recruteur]);

  // Filtrage des offres
  useEffect(() => {
    const filtered = offres.filter(offre =>
      offre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.domaine.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOffres(filtered);
  }, [searchTerm, offres]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewOffer(prev => ({ ...prev, [name]: value }));
  };

  const handlePublish = async () => {
    if (!newOffer.titre || !newOffer.localisation || !newOffer.domaine) {
      MySwal.fire('Erreur', 'Veuillez remplir tous les champs', 'error');
      return;
    }

    const nouvelleOffre = {
      ...newOffer,
      datePublication: new Date().toLocaleDateString(),
      recruteurEmail: recruteur.email,
    };

    try {
      await fetch('http://localhost:3000/offres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nouvelleOffre),
      });

      await MySwal.fire({
        icon: 'success',
        title: 'Offre publiée avec succès 🎉',
        showConfirmButton: false,
        timer: 1500,
      });

      setNewOffer({ titre: '', type: 'Stage', localisation: '', domaine: '' });
      fetchOffres();
    } catch (error) {
      MySwal.fire('Erreur', 'Impossible de publier l\'offre', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = await MySwal.fire({
      title: 'Supprimer cette offre ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
    });

    if (confirm.isConfirmed) {
      try {
        await fetch(`http://localhost:3000/offres/${id}`, { method: 'DELETE' });
        await MySwal.fire('Supprimée ✅', 'L\'offre a été supprimée', 'success');
        fetchOffres();
      } catch (error) {
        MySwal.fire('Erreur', 'Impossible de supprimer l\'offre', 'error');
      }
    }
  };

  const handleLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    // Rediriger vers la page de connexion avec remplacement de l'historique
    navigate('/login', { replace: true });
    // Rafraîchir la page pour s'assurer que l'état est complètement réinitialisé
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      {/* Header */}
      <header className="bg-white shadow-md rounded-xl p-6 mb-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord Recruteur</h1>
          <p className="text-gray-600 mt-2">Gérez et publiez vos offres d'emploi</p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une offre..."
              className="left-0 pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="md:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de publication */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Publier une nouvelle offre</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre du poste</label>
                <input
                  type="text"
                  name="titre"
                  value={newOffer.titre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Développeur Full Stack"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de poste</label>
                <select
                  name="type"
                  value={newOffer.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Stage">Stage</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                <div className="relative">
                  <input
                    type="text"
                    name="localisation"
                    value={newOffer.localisation}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ville, Pays"
                  />
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domaine</label>
                <div className="relative">
                  <input
                    type="text"
                    name="domaine"
                    value={newOffer.domaine}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Informatique, Marketing..."
                  />
                  <FaBriefcase className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <button
                onClick={handlePublish}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center space-x-2"
              >
                <FaPlus /> <span>Publier l'offre</span>
              </button>
            </div>
          </div>
        </div>

        {/* Liste des offres */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Mes offres publiées</h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredOffres.length} offre{filteredOffres.length !== 1 ? 's' : ''} trouvée{filteredOffres.length !== 1 ? 's' : ''}
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-6 my-4 rounded">
                <p>{error}</p>
              </div>
            )}

            {filteredOffres.length === 0 ? (
              <div className="p-8 text-center">
                <FaUserTie className="mx-auto text-gray-300 text-5xl mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Aucune offre trouvée</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Aucune offre ne correspond à votre recherche' : 'Commencez par publier votre première offre'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Poste
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localisation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOffres.map((offre) => (
                      <tr key={offre.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{offre.titre}</div>
                          <div className="text-sm text-gray-500">{offre.domaine}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            offre.type === 'CDI' ? 'bg-green-100 text-green-800' :
                            offre.type === 'Stage' ? 'bg-blue-100 text-blue-800' :
                            offre.type === 'CDD' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {offre.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-1 text-gray-400" />
                            {offre.localisation}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(offre.datePublication).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleDelete(offre.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRecruteur;