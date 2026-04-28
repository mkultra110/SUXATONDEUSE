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
];
