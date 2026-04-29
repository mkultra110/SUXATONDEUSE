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
];

export function pickDialogue(ctx: DialogueContext): MemeDialogue | null {
  for (const d of MEME_DIALOGUES) {
    if (d.oneShot && ctx.shownIds.has(d.id)) continue;
    if (d.when(ctx)) return d;
  }
  return null;
}
