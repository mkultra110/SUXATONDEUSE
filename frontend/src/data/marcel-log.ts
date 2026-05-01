// Données statiques du carnet de Marcel — devlog in-game style cahier
// d'ecolier. Entrees datees avec voice de Marcel (le voisin qui aide
// Memé Gisele a tenir la ferme).

export interface MarcelEntry {
  date: string;
  title: string;
  body: string;
}

export const MARCEL_LOG: ReadonlyArray<MarcelEntry> = [
  {
    date: 'Mardi 12 mai 1962',
    title: 'La ferme reprend vie',
    body: "Mémé Gisèle a retrouvé son énergie de jeunesse. On a planté les premiers tournesols ce matin. Faudra attendre l'été pour voir si ça pousse comme prévu. Le coq Bébert a chanté plus fort que d'habitude.",
  },
  {
    date: 'Dimanche 17 juin 1962',
    title: 'Pompon le chat',
    body: "Pompon est arrivé hier soir, trempé comme une soupe. On l'a séché devant la cheminée et il a pas bougé. Mémé l'a appelé Pompon parce qu'il a le bout de la queue tout blanc, comme un pompon de bonnet. Il dort déjà sur le toit.",
  },
  {
    date: 'Mercredi 3 août 1962',
    title: 'Premier orage',
    body: "Gros orage cette nuit. La grange a tenu bon mais le poulailler de Cocotte a pris l'eau. Demain je ressors les outils. Mémé a fait une tarte aux mirabelles pour me remercier, j'en ai mangé trois parts.",
  },
  {
    date: 'Lundi 22 octobre 1962',
    title: 'Première récolte',
    body: "Les tournesols ont donné mieux que prévu. On a rempli trois caisses. Mémé dit que c'est grâce aux étoiles. Moi je dis que c'est grâce aux abeilles, mais bon, on est d'accord sur l'essentiel.",
  },
  {
    date: 'Vendredi 24 décembre 1962',
    title: 'Réveillon à la ferme',
    body: "Première fête à la ferme. J'ai apporté une bûche au chocolat, Mémé a cuisiné pour douze (on était quatre). Pompon a dormi sous le sapin. Cocotte a pondu un œuf juste avant minuit, Mémé dit que c'est un signe.",
  },
  {
    date: 'Samedi 14 février 2026',
    title: 'Le robot tondeuse',
    body: "Mémé a accepté qu'on essaie un robot tondeuse pour l'herbe haute. Au début elle disait « les machines, ça remplacera jamais le savoir-faire ». Mais le voisin Léopold lui a montré le sien — celui-là siffle même un petit air en travaillant. Mémé a souri pour la première fois depuis longtemps.",
  },
  {
    date: 'Dimanche 12 avril 2026',
    title: 'Marcel rejoint l\'équipe',
    body: "Le tout premier robot s'appelle Marcel, comme moi. Mémé trouve ça drôle. Il fait son boulot tranquillement, sans se plaindre. Un jour il faudra qu'on lui donne une moustache.",
  },
  {
    date: 'Lundi 28 avril 2026',
    title: 'Note pour plus tard',
    body: "Si tu lis ce carnet, c'est que tu as repris la ferme. Prends soin des bêtes, lis les pages que Mémé a annotées en rouge, et n'oublie jamais : la patience est une fleur qui ne pousse pas dans tous les jardins.",
  },
  // === Recettes de Mémé (#694) ===
  {
    date: 'Recette · 1965',
    title: 'Tarte aux mirabelles de Mémé',
    body: "Pâte sablée maison. 500g de mirabelles dénoyautées. Sucre roux. Cannelle (un filet, juste pour parfumer). Cuire 30 min à four moyen. Mémé dit : « le secret, c'est de fermer les yeux quand on goûte ».",
  },
  {
    date: 'Recette · 1966',
    title: 'Soupe aux orties de Marcel',
    body: "Cueillir les jeunes pousses (avec gants). Ail. Pomme de terre. Crème fraîche. 20 min de cuisson. Servi avec une tartine de pain de campagne. Marcel : « ça pique pas en bouche, c'est ça la magie ».",
  },
  {
    date: 'Recette · 1971',
    title: 'Confiture de tournesols',
    body: "Pétales de tournesol séchés (200g). Sucre cristallisé. Citron. Vanille. Mémé prétend que ça soigne les rhumes. C'est jaune comme le soleil et ça sent l'enfance.",
  },
  // === Lettre du fils de Marcel jamais envoyee (#696) ===
  {
    date: 'Lettre non envoyée · 1969',
    title: 'À mon fils Lucien',
    body: "Lucien, je t'écris depuis la ferme. Mémé Gisèle vieillit doucement, comme les chênes. J'ai pensé que tu reviendrais peut-être au printemps. Le poulailler t'attend. Si tu lis ces lignes un jour, sache qu'on t'a toujours laissé une chaise à table. — Marcel.",
  },
  // === Carte postale d'un cousin parisien (#697) ===
  {
    date: 'Carte postale · 1970',
    title: 'Du Cousin Edmond',
    body: "Cher Marcel, Paris est une foire. Le métro pue, le ciel est gris, et les gens marchent vite. Je donnerai cher pour une journée à la ferme avec ta tarte. Bises à Mémé. — Edmond.",
  },
  // === Coupures de presse fictives (#698) ===
  {
    date: 'Le Petit Bourguignon · 14 juin 1962',
    title: 'Article de journal (collé)',
    body: "« La famille Gisèle de Tournelys-sur-Yonne lance la culture de tournesols sur l'ancien pré communal. Initiative saluée par le maire. La récolte de l'année dernière n'aurait pas suffi à nourrir un cochon. Cette année on parle de prospérité. »",
  },
  {
    date: 'Le Bouquet Rural · 1973',
    title: 'Coupure (jaunie au coin)',
    body: "« Marcel, voisin agriculteur, raconte avec émotion sa rencontre avec Gisèle Tournesol en 1962. Une amitié devenue légende dans le canton. La ferme est aujourd'hui considérée comme un symbole d'entraide. »",
  },
  // === Histoire courte rencontre Memé / Marcel (#695) ===
  {
    date: 'Souvenir · 1962',
    title: 'Comment Mémé a connu Marcel',
    body: "C'était un mardi de mai, je traversais le pré pour ramener une vache égarée. Mémé arrosait son petit jardin. Elle m'a tendu un bouquet de pissenlits avec un sourire. J'ai jamais oublié. Elle non plus, je crois.",
  },
  // === Album photos (#700) ===
  {
    date: 'Album · 1958',
    title: 'Photo en noir et blanc',
    body: "Mémé Gisèle, 24 ans, devant la grange. Elle porte une robe à pois et tient un panier de pommes. Marcel disait toujours qu'elle ressemblait à une carte postale. Sur la photo, elle ne sourit pas — c'était la mode à l'époque.",
  },
  // === Lore origines (#661 #662) ===
  {
    date: 'Souvenir · 1898',
    title: 'L\'origine de la ferme',
    body: "Mon grand-père Aristide a fondé la ferme en 1898 sur des terres pierreuses que personne ne voulait. Il les a labourées trois ans avant d'en tirer une seule pomme de terre. C'est dire la pugnacité familiale.",
  },
  {
    date: 'Souvenir · 1916',
    title: 'Le père de Marcel',
    body: "Mon père Jean-Marie est parti à la guerre en 1916. On l'a jamais revu. C'est Mémé Gisèle qui m'a élevé en partie, avec sa mère. La ferme, c'est un peu ma deuxième maison depuis tout petit.",
  },
  // === Tournesol cache L42 (#655 lore) ===
  {
    date: 'Mystère · 2024',
    title: 'Le tournesol caché',
    body: "Si tu vois un tournesol qui cligne dorement entre les rangs, c'est la réponse. Mémé jurait que ce tournesol-là, c'est l'âme de la ferme. La réponse à tout. Elle riait sans expliquer.",
  },
  // === Lore additionnel ===
  {
    date: 'Souvenir · 1980',
    title: 'Les premiers tracteurs',
    body: "Le voisin Léopold a achete le premier tracteur du canton. On a tous fait la queue pour le voir. Mémé a dit : 'mon petit, ça remplacera jamais une bonne paire de bras'. Cinq ans plus tard, elle en a achete un.",
  },
  {
    date: 'Recette · 1968',
    title: 'Soupe de potiron de Mémé',
    body: "Un potiron entier. Pomme de terre. Lardons. Bouillon de poule maison. Crème entière. 40 min. Servi dans un creuset en fonte. Mémé : 'le secret c'est le creuset, ça donne le goût de l'enfance'.",
  },
  {
    date: 'Carte postale · 1985',
    title: 'Du Père Noël (de Marcel)',
    body: "Pompon nain a reçu une carte signée 'Père Noël'. C'était l'écriture de Marcel. Mémé a fait semblant de ne rien remarquer. Pompon a dormi dessus toute la nuit.",
  },
  {
    date: 'Souvenir · 1988',
    title: 'L\'incendie de la grange',
    body: "Mai 1988. Foudre. La grange a flambé. Marcel et moi on a sauvé les bêtes une par une. La grange a été reconstruite par le village. C'est de là qu'est née la légende d'entraide du canton.",
  },
  {
    date: 'Recette · 1993',
    title: 'Crêpes de la Chandeleur',
    body: "250g de farine. 4 œufs. 50cl de lait. Bière (pour la légèreté). Sucre vanillé. Pâte au repos 2h. Cuites au saindoux. Sur la 1ère : sucre. Sur la 2ème : confiture de tournesols.",
  },
  {
    date: 'Souvenir · 1999',
    title: 'L\'an 2000 et le bug',
    body: "Tout le monde paniquait pour le bug de l'an 2000. Marcel a eu peur que son tracteur ne redémarre pas. À minuit, on était devant. Il a démarré. On a dansé.",
  },
  {
    date: 'Lettre · 2003',
    title: 'À l\'Inspecteur des Impôts',
    body: "Monsieur l'Inspecteur, je vous écris pour contester l'amende relative à mon poulailler. Ce n'est pas un commerce. C'est juste qu'il y a beaucoup de poules. — Mémé Gisèle.",
  },
  {
    date: 'Souvenir · 2010',
    title: 'Le jardin de la ferme',
    body: "On a tracé les premiers carrés du potager. Tomates Cœur-de-Bœuf, courgettes ronde de Nice, basilic Marseillais. Marcel a peint des étiquettes en bois. Les bêtes ont rongé une étiquette sur trois.",
  },
  {
    date: 'Souvenir · 2018',
    title: 'L\'arrivée du wifi',
    body: "Le maire a installé la fibre au village. Mémé jurait qu'elle s'en passerait. Trois mois plus tard elle savait jouer aux mots fléchés en ligne. Elle a battu le voisin Robert 12 fois de suite.",
  },
  {
    date: 'Recette · 2022',
    title: 'Cake aux noix de Mémé',
    body: "200g de farine. 150g de noix concassées. 3 œufs. 100g de beurre. 100g de sucre roux. 1cc de cannelle. Cuit en moule à cake. Pour goûter avec du thé. Mémé : 'c'est pas de la grande cuisine, c'est de la cuisine de mémé'.",
  },
];
