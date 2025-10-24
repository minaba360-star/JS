export interface Offer {
  domain: unknown;
  id: number;
  title: string;
  type: string;
  location: string;
  description: string;
  fullDescription: string;
  prerequisites: string[];
  responsibilities: string[];
  benefits: string[];
  company: string;
  salary?: string;
  contractType: string;
  experience: string;
  education: string;
  skills: string[];
  publishedDate: string;
  deadline: string;
}

export const offersData: Offer[] = [
  {
    id: 1,
    title: "Stage Web Dev",
    type: "Stage",
    location: "Dakar",
    description: "Stage en développement web pour étudiants en informatique. Missions : création de sites web, intégration front-end, utilisation de React et Tailwind.",
    fullDescription: "Nous recherchons un stagiaire motivé pour rejoindre notre équipe de développement web. Vous participerez à la création et à l'amélioration de nos applications web modernes en utilisant les dernières technologies. Ce stage vous permettra d'acquérir une expérience pratique dans un environnement professionnel dynamique.",
    prerequisites: [
      "Étudiant en informatique (Bac+2 minimum)",
      "Connaissance de base en HTML, CSS, JavaScript",
      "Intérêt pour les frameworks modernes (React, Vue.js)",
      "Esprit d'équipe et capacité d'adaptation",
      "Bonne maîtrise du français"
    ],
    responsibilities: [
      "Développement de composants React",
      "Intégration d'interfaces utilisateur",
      "Participation aux réunions d'équipe",
      "Tests et débogage d'applications",
      "Documentation du code"
    ],
    benefits: [
      "Encadrement par des développeurs expérimentés",
      "Formation aux technologies modernes",
      "Certificat de stage",
      "Possibilité d'embauche",
      "Environnement de travail stimulant"
    ],
    company: "TechSenegal",
    salary: "Gratifié",
    contractType: "Stage",
    experience: "Débutant accepté",
    education: "Bac+2 minimum",
    skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
    publishedDate: "2024-01-15",
    deadline: "2024-02-15",
    domain: undefined
  },
  {
    id: 2,
    title: "Emploi Enseignant",
    type: "Emploi",
    location: "Thies",
    description: "Poste d'enseignant au lycée régional de Thiès. Profil : Bac+3 minimum, expérience souhaitée en enseignement secondaire.",
    fullDescription: "Le lycée régional de Thiès recherche un enseignant dynamique pour rejoindre son équipe pédagogique. Vous serez responsable de l'enseignement dans votre discipline et participerez activement à la vie éducative de l'établissement.",
    prerequisites: [
      "Bac+3 minimum dans la discipline concernée",
      "Expérience en enseignement secondaire",
      "Maîtrise des programmes scolaires",
      "Capacité de communication et pédagogie",
      "Engagement envers l'éducation"
    ],
    responsibilities: [
      "Préparation et animation des cours",
      "Évaluation des élèves",
      "Participation aux conseils de classe",
      "Suivi individualisé des élèves",
      "Participation aux projets éducatifs"
    ],
    benefits: [
      "Salaire compétitif selon grille",
      "Formation continue",
      "Environnement de travail stable",
      "Congés scolaires",
      "Mutuelle santé"
    ],
    company: "Lycée Régional de Thiès",
    salary: "Selon grille de la fonction publique",
    contractType: "CDI",
    experience: "2 ans minimum",
    education: "Bac+3 minimum",
    skills: ["Pédagogie", "Communication", "Gestion de classe", "Évaluation"],
    publishedDate: "2024-01-10",
    deadline: "2024-02-10",
    domain: undefined
  },
  {
    id: 3,
    title: "Stage Marketing",
    type: "Stage",
    location: "Saint-Louis",
    description: "Stage en marketing digital avec missions de community management, études de marché et création de contenu.",
    fullDescription: "Rejoignez notre équipe marketing pour un stage enrichissant dans le domaine du marketing digital. Vous découvrirez tous les aspects du marketing moderne et contribuerez à nos campagnes de communication.",
    prerequisites: [
      "Étudiant en marketing, communication ou commerce",
      "Maîtrise des réseaux sociaux",
      "Créativité et sens de l'innovation",
      "Bonne rédaction en français",
      "Connaissance des outils digitaux"
    ],
    responsibilities: [
      "Gestion des réseaux sociaux",
      "Création de contenu marketing",
      "Analyse des tendances du marché",
      "Participation aux campagnes publicitaires",
      "Rapport d'activité hebdomadaire"
    ],
    benefits: [
      "Formation aux outils marketing",
      "Portfolio de projets réalisés",
      "Mentorat personnalisé",
      "Réseau professionnel",
      "Certificat de stage"
    ],
    company: "Digital Agency SL",
    salary: "Gratifié",
    contractType: "Stage",
    experience: "Débutant accepté",
    education: "Bac+2 minimum",
    skills: ["Marketing Digital", "Réseaux Sociaux", "Création de Contenu", "Analytics"],
    publishedDate: "2024-01-12",
    deadline: "2024-02-12",
    domain: undefined
  },
  {
    id: 4,
    title: "Chargé(e) de la Logistique",
    type: "Emploi",
    location: "Diourbel",
    description: "Responsable de la gestion des flux logistiques, coordination avec les fournisseurs et suivi des stocks.",
    fullDescription: "Nous recherchons un chargé de logistique pour optimiser nos opérations de supply chain. Vous serez responsable de la coordination des flux de marchandises et de l'amélioration de nos processus logistiques.",
    prerequisites: [
      "Bac+3 en logistique, transport ou commerce",
      "Expérience en gestion de stocks",
      "Maîtrise des outils informatiques",
      "Capacité d'organisation et de planification",
      "Esprit d'équipe"
    ],
    responsibilities: [
      "Gestion des stocks et inventaires",
      "Coordination avec les fournisseurs",
      "Optimisation des flux logistiques",
      "Suivi des livraisons",
      "Rapports de performance"
    ],
    benefits: [
      "Salaire attractif",
      "Formation continue",
      "Évolution de carrière",
      "Mutuelle santé",
      "Prime de performance"
    ],
    company: "LogiSenegal",
    salary: "300 000 - 400 000 FCFA",
    contractType: "CDI",
    experience: "1-2 ans",
    education: "Bac+3 minimum",
    skills: ["Gestion de stocks", "Supply Chain", "Excel", "SAP", "Communication"],
    publishedDate: "2024-01-08",
    deadline: "2024-02-08",
    domain: undefined
  },
  {
    id: 5,
    title: "Développeur Full Stack",
    type: "Emploi",
    location: "Dakar",
    description: "Développeur full stack pour créer et maintenir des applications web modernes avec React et Node.js.",
    fullDescription: "Rejoignez notre équipe technique pour développer des solutions web innovantes. Vous travaillerez sur des projets variés en utilisant les dernières technologies du web.",
    prerequisites: [
      "Bac+3 en informatique ou équivalent",
      "Maîtrise de React et Node.js",
      "Connaissance des bases de données",
      "Expérience en développement web",
      "Esprit d'équipe et autonomie"
    ],
    responsibilities: [
      "Développement d'applications web",
      "Maintenance et évolution du code",
      "Collaboration avec l'équipe UX/UI",
      "Tests et débogage",
      "Documentation technique"
    ],
    benefits: [
      "Salaire compétitif",
      "Formation aux nouvelles technologies",
      "Télétravail possible",
      "Mutuelle santé",
      "Prime de participation"
    ],
    company: "DevSenegal",
    salary: "400 000 - 600 000 FCFA",
    contractType: "CDI",
    experience: "2-3 ans",
    education: "Bac+3 minimum",
    skills: ["React", "Node.js", "MongoDB", "Git", "Docker"],
    publishedDate: "2024-01-05",
    deadline: "2024-02-05",
    domain: undefined
  },
  {
    id: 6,
    title: "Stage Comptabilité",
    type: "Stage",
    location: "Dakar",
    description: "Stage en comptabilité pour étudiants en gestion. Découverte des processus comptables et utilisation de logiciels spécialisés.",
    fullDescription: "Stage pratique en comptabilité pour découvrir les métiers de la finance et de la comptabilité dans un environnement professionnel.",
    prerequisites: [
      "Étudiant en comptabilité ou gestion",
      "Connaissance de base en comptabilité",
      "Maîtrise d'Excel",
      "Rigueur et précision",
      "Bonne communication"
    ],
    responsibilities: [
      "Saisie des écritures comptables",
      "Établissement des états financiers",
      "Suivi des comptes clients/fournisseurs",
      "Participation aux clôtures mensuelles",
      "Support aux équipes"
    ],
    benefits: [
      "Formation pratique",
      "Encadrement personnalisé",
      "Certificat de stage",
      "Possibilité d'embauche",
      "Découverte des métiers de la finance"
    ],
    company: "ComptaSenegal",
    salary: "Gratifié",
    contractType: "Stage",
    experience: "Débutant accepté",
    education: "Bac+2 minimum",
    skills: ["Comptabilité", "Excel", "Sage", "Analyse financière"],
    publishedDate: "2024-01-18",
    deadline: "2024-02-18",
    domain: undefined
  }
];

