// Dialogues conditionnels de Meme Gisele.
// Selectionnes selon le contexte (premier prestige, anniversaire, 3am, etc).
// Chaque dialogue a un id stable pour ne pas le rejouer.

export interface MemeDialogue {
  id: string;
  text: string;
  // Si vrai, ne se declenche qu'une seule fois (persisted via uiStore).
  oneShot?: boolean;
  // Predicat pour determiner si applicable au contexte courant.
  when: (ctx: DialogueContext) => boolean;
}

export interface DialogueContext {
  totalCash: number;
  prestigeLevel: number;
  totalRobots: number;
  totalPrestiges: number;
  loginStreak: number;
  hourLocal: number;
  playTimeSeconds: number;
  bossKills: number;
  shownIds: ReadonlySet<string>;
}

export const MEME_DIALOGUES: ReadonlyArray<MemeDialogue> = [
  {
    id: 'first-robot',
    text: 'Mon premier petit robot ! Il a la même bouille que mon Marcel jeune.',
    oneShot: true,
    when: (c) => c.totalRobots === 1,
  },
  {
    id: 'ten-robots',
    text: 'Dix robots ! Ça commence à ronronner comme une chorale d\'abeilles.',
    oneShot: true,
    when: (c) => c.totalRobots >= 10 && !c.shownIds.has('ten-robots'),
  },
  {
    id: 'hundred-robots',
    text: 'Cent robots ! Marcel dirait : "ça doit bouffer en essence cette affaire-là."',
    oneShot: true,
    when: (c) => c.totalRobots >= 100 && !c.shownIds.has('hundred-robots'),
  },
  {
    id: 'first-prestige',
    text: 'On replante toutes les graines ? Allez, le printemps recommence !',
    oneShot: true,
    when: (c) => c.totalPrestiges === 1 && !c.shownIds.has('first-prestige'),
  },
  {
    id: 'fifth-prestige',
    text: 'Cinq printemps déjà... Je ferai un gâteau aux pommes pour fêter ça.',
    oneShot: true,
    when: (c) => c.totalPrestiges >= 5 && !c.shownIds.has('fifth-prestige'),
  },
  {
    id: 'million-cash',
    text: 'Un million ! Je vais peut-être pouvoir m\'acheter une nouvelle paire de bottes.',
    oneShot: true,
    when: (c) => c.totalCash >= 1_000_000 && !c.shownIds.has('million-cash'),
  },
  {
    id: 'late-night',
    text: 'Il est tard... Va te coucher mon petit. Les tournesols dorment aussi.',
    when: (c) => c.hourLocal >= 23 || c.hourLocal < 5,
  },
  {
    id: 'early-morning',
    text: 'Le café est sur le feu, viens donc te réchauffer.',
    when: (c) => c.hourLocal >= 5 && c.hourLocal < 8,
  },
  {
    id: 'login-streak-3',
    text: 'Trois jours de suite ! Tu es plus assidu que moi à la messe.',
    oneShot: true,
    when: (c) => c.loginStreak >= 3 && !c.shownIds.has('login-streak-3'),
  },
  {
    id: 'login-streak-7',
    text: 'Une semaine entière ! Tiens, voilà un robot doré pour fêter ça.',
    oneShot: true,
    when: (c) => c.loginStreak >= 7 && !c.shownIds.has('login-streak-7'),
  },
  {
    id: 'first-boss',
    text: 'Ce tournesol géant... il est pire que mon voisin Robert.',
    oneShot: true,
    when: (c) => c.bossKills === 1 && !c.shownIds.has('first-boss'),
  },
  {
    id: 'play-1h',
    text: 'Tu as bien tondu pendant une heure. Va boire un verre d\'eau.',
    oneShot: true,
    when: (c) => c.playTimeSeconds >= 3600 && !c.shownIds.has('play-1h'),
  },
  // === Lore additionnel (idees #663-666) ===
  {
    id: 'lore-pompon',
    text: 'Pompon vient des chats du Marquis de Tournelys. Lignee royale, mon petit.',
    oneShot: true,
    when: (c) => c.totalRobots >= 50 && !c.shownIds.has('lore-pompon'),
  },
  {
    id: 'lore-puits',
    text: 'Le puits derriere la grange... ne t\'en approche pas la nuit. Marcel jurait y avoir vu des choses.',
    oneShot: true,
    when: (c) => c.totalPrestiges >= 2 && !c.shownIds.has('lore-puits'),
  },
  {
    id: 'lore-arbre',
    text: 'L\'arbre central a ete plante pour le bapteme des jumeaux Augustin et Augustine, en 1959.',
    oneShot: true,
    when: (c) => c.totalRobots >= 25 && !c.shownIds.has('lore-arbre'),
  },
  {
    id: 'lore-lampions',
    text: 'Les lampions ? Marcel et moi, on les a accroches le soir de notre premier bal de village.',
    oneShot: true,
    when: (c) => c.totalCash >= 10_000_000 && !c.shownIds.has('lore-lampions'),
  },
  {
    id: 'lore-pere-marcel',
    text: 'Le pere de Marcel n\'est jamais revenu de la guerre. Sa photo veille toujours sur le manteau de cheminee.',
    oneShot: true,
    when: (c) => c.totalPrestiges >= 5 && !c.shownIds.has('lore-pere-marcel'),
  },
  {
    id: 'play-3h',
    text: 'Trois heures non-stop ? Ouf, prends une pause. Le pain attend.',
    oneShot: true,
    when: (c) => c.playTimeSeconds >= 10_800 && !c.shownIds.has('play-3h'),
  },
  {
    id: 'play-10h',
    text: 'Dix heures cumulees ! Tu vas etre meilleur fermier que mon arriere-grand-pere.',
    oneShot: true,
    when: (c) => c.playTimeSeconds >= 36_000 && !c.shownIds.has('play-10h'),
  },
  {
    id: 'thousand-robots',
    text: 'Mille robots ?! Marcel rigole : "ca va couter une fortune en huile de tournesol".',
    oneShot: true,
    when: (c) => c.totalRobots >= 1000 && !c.shownIds.has('thousand-robots'),
  },
  {
    id: 'billion-cash',
    text: 'Un milliard de pieces ! Le banquier va vouloir t\'inviter a diner.',
    oneShot: true,
    when: (c) => c.totalCash >= 1e9 && !c.shownIds.has('billion-cash'),
  },
  {
    id: 'midday',
    text: 'Midi sonne, viens manger. La soupe va refroidir.',
    when: (c) => c.hourLocal === 12,
  },
  {
    id: 'evening',
    text: 'Le ciel rosit. C\'est l\'heure des bisous a Pompon.',
    when: (c) => c.hourLocal >= 18 && c.hourLocal < 20,
  },
  {
    id: 'monday',
    text: 'Lundi matin, le coq Bebert m\'a reveillee. Bonne semaine !',
    when: (c) => new Date().getDay() === 1 && c.hourLocal >= 6 && c.hourLocal < 10,
  },
  // === Citations en plus (idees #691 #692 #693) ===
  {
    id: 'cite-fontaine',
    text: 'Comme disait Jean : "patience et longueur de temps font plus que force ni que rage".',
    oneShot: true,
    when: (c) => c.totalCash >= 50_000 && !c.shownIds.has('cite-fontaine'),
  },
  {
    id: 'cite-coluche',
    text: 'Coluche disait : "quand on est petit on aime tout, sauf ce qui est petit".',
    oneShot: true,
    when: (c) => c.totalRobots >= 5 && !c.shownIds.has('cite-coluche'),
  },
  {
    id: 'cite-devos',
    text: 'Devos jurait : "il faut des fous, il y aura toujours des fous a faire des choses faisables".',
    oneShot: true,
    when: (c) => c.totalPrestiges >= 3 && !c.shownIds.has('cite-devos'),
  },
  // === References (idees #685-690) ===
  {
    id: 'ref-stardew',
    text: 'On dirait Stardew Valley. Marcel a meme commande un coffre en bois pour ranger les outils.',
    oneShot: true,
    when: (c) => c.totalRobots >= 15 && !c.shownIds.has('ref-stardew'),
  },
  {
    id: 'ref-cookieclicker',
    text: 'Mes biscuits aux noix ont du succes. Plus on en mange, plus on en veut.',
    oneShot: true,
    when: (c) => c.totalCash >= 1e6 && !c.shownIds.has('ref-cookieclicker'),
  },
  {
    id: 'ref-zelda',
    text: 'Quand tu trouves un trefle dore... ca rappelle un certain rupee.',
    oneShot: true,
    when: (c) => c.totalRobots >= 30 && !c.shownIds.has('ref-zelda'),
  },
  {
    id: 'ref-asterix',
    text: 'Mon arriere-arriere-grand-pere disait : "ils sont fous ces fermiers".',
    oneShot: true,
    when: (c) => c.totalPrestiges >= 1 && !c.shownIds.has('ref-asterix'),
  },
  // === Fin de session ===
  {
    id: 'goodbye-night',
    text: 'Va dormir mon petit. Demain on remet ca.',
    when: (c) => c.hourLocal >= 1 && c.hourLocal < 4,
  },
];

export function pickDialogue(ctx: DialogueContext): MemeDialogue | null {
  for (const d of MEME_DIALOGUES) {
    if (d.oneShot && ctx.shownIds.has(d.id)) continue;
    if (d.when(ctx)) return d;
  }
  return null;
}
