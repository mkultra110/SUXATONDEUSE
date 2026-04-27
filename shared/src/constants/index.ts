// Constantes globales du jeu, partagees entre client et serveur.

/** Version du payload de save : incrementer a chaque migration. */
export const SAVE_PAYLOAD_VERSION = 1;

/** Version logique du jeu (affichee dans l'UI). */
export const GAME_VERSION = '0.1.0';

/** Frequence de la boucle de tick logique (Hz). */
export const TICK_HZ = 10;

/** Duree d'un tick logique (ms). */
export const TICK_INTERVAL_MS = 1000 / TICK_HZ;

/** Cap par defaut sur la duree des gains offline (heures). */
export const DEFAULT_OFFLINE_CAP_HOURS = 12;

/** Multiplicateur de revente (style Cookie Clicker). */
export const SELL_VALUE_RATIO = 0.25;

/** Coefficient de croissance des couts d'upgrades. */
export const UPGRADE_COST_GROWTH = 1.15;

/** Niveau de gain cumule requis pour debloquer le 1er prestige. */
export const FIRST_PRESTIGE_THRESHOLD_CASH = 1_000_000_000n;

/** Categories de leaderboard exposees. */
export const LEADERBOARD_CATEGORIES = [
  'TOTAL_CASH',
  'TOTAL_GRASS',
  'PRESTIGE_LEVEL',
  'ACHIEVEMENTS',
] as const;

export type LeaderboardCategory = (typeof LEADERBOARD_CATEGORIES)[number];

/** Roles utilisateurs. */
export const USER_ROLES = ['PLAYER', 'MODERATOR', 'ADMIN'] as const;
export type UserRole = (typeof USER_ROLES)[number];
