// Skins cosmetiques pour les robots (cf. GDD).
// PHASE 3 : 30 skins basics, 50 prevu pour la version finale.

export type SkinRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface SkinDefinition {
  key: string;
  name: string;
  description: string;
  rarity: SkinRarity;
  /** Couleur primaire du robot (hex). */
  primaryColor: number;
  /** Couleur d'accent (LED, lames). */
  accentColor: number;
  /** Source : achievement key / IAP / event / login streak. */
  source: 'achievement' | 'login' | 'event' | 'shop' | 'starter';
  /** Cout en gemmes si shop. */
  gemCost?: number;
}

export const SKINS: readonly SkinDefinition[] = [
  // Starter (3)
  { key: 'classic', name: 'Classique', description: 'Le look standard.', rarity: 'common', primaryColor: 0xc0cbdc, accentColor: 0xfee761, source: 'starter' },
  { key: 'jungle', name: 'Jungle', description: 'Camouflage de jardin.', rarity: 'common', primaryColor: 0x3e8948, accentColor: 0xa8e66c, source: 'starter' },
  { key: 'sunset', name: 'Coucher de soleil', description: 'Tons chauds.', rarity: 'common', primaryColor: 0xe43b44, accentColor: 0xfee761, source: 'starter' },

  // Login streaks (5)
  { key: 'rookie', name: 'Recrue', description: 'Recompense 1ere connexion.', rarity: 'common', primaryColor: 0x8fde5d, accentColor: 0xffffff, source: 'login' },
  { key: 'veteran', name: 'Veteran', description: '30 jours consecutifs.', rarity: 'rare', primaryColor: 0x5a6988, accentColor: 0xfee761, source: 'login' },
  { key: 'champion', name: 'Champion', description: '100 jours consecutifs.', rarity: 'epic', primaryColor: 0xb55088, accentColor: 0xa8e66c, source: 'login' },
  { key: 'living_legend', name: 'Legende vivante', description: '365 jours consecutifs.', rarity: 'legendary', primaryColor: 0xfee761, accentColor: 0xff5577, source: 'login' },
  { key: 'evergreen', name: 'Persistant', description: '7 jours consecutifs.', rarity: 'common', primaryColor: 0x63c74d, accentColor: 0x265c42, source: 'login' },

  // Achievements (8)
  { key: 'gold_legend', name: 'Or massif', description: 'Skin dore brillant.', rarity: 'epic', primaryColor: 0xfee761, accentColor: 0xfee761, source: 'achievement' },
  { key: 'pro_caddy', name: 'Caddy pro', description: 'Style golf chic.', rarity: 'rare', primaryColor: 0xffffff, accentColor: 0x63c74d, source: 'achievement' },
  { key: 'eco', name: 'Eco', description: 'Robot 100 % solaire.', rarity: 'rare', primaryColor: 0x63c74d, accentColor: 0xfee761, source: 'achievement' },
  { key: 'old_school', name: 'Old School', description: 'Style retro.', rarity: 'rare', primaryColor: 0xa06d42, accentColor: 0xb86f50, source: 'achievement' },
  { key: 'retro_8bit', name: 'Retro 8-bit', description: 'Code Konami.', rarity: 'epic', primaryColor: 0xff00ff, accentColor: 0x00ff00, source: 'achievement' },
  { key: 'mythic', name: 'Mythique', description: '500 prestiges.', rarity: 'legendary', primaryColor: 0xb55088, accentColor: 0xfee761, source: 'achievement' },
  { key: 'lunar', name: 'Lunaire', description: 'Surface de la Lune tondue.', rarity: 'legendary', primaryColor: 0xc0cbdc, accentColor: 0xffffff, source: 'achievement' },
  { key: 'camo', name: 'Camo', description: '100 robots possedes.', rarity: 'rare', primaryColor: 0x265c42, accentColor: 0x3e8948, source: 'achievement' },

  // Shop (8)
  { key: 'arctic', name: 'Arctique', description: 'Bleu glacier.', rarity: 'rare', primaryColor: 0x0099db, accentColor: 0xffffff, source: 'shop', gemCost: 50 },
  { key: 'magma', name: 'Magma', description: 'Lave en fusion.', rarity: 'rare', primaryColor: 0xe43b44, accentColor: 0xfee761, source: 'shop', gemCost: 50 },
  { key: 'cyber', name: 'Cyber', description: 'Neon futuriste.', rarity: 'epic', primaryColor: 0x00ffaa, accentColor: 0xff5577, source: 'shop', gemCost: 100 },
  { key: 'royal', name: 'Royal', description: 'Pourpre et or.', rarity: 'epic', primaryColor: 0xb55088, accentColor: 0xfee761, source: 'shop', gemCost: 100 },
  { key: 'shadow', name: 'Ombre', description: 'Discret et menacant.', rarity: 'epic', primaryColor: 0x181425, accentColor: 0xff0044, source: 'shop', gemCost: 100 },
  { key: 'rainbow', name: 'Arc-en-ciel', description: 'Toutes les couleurs.', rarity: 'legendary', primaryColor: 0xfee761, accentColor: 0x00ffaa, source: 'shop', gemCost: 250 },
  { key: 'galaxy', name: 'Galaxie', description: 'Univers entier.', rarity: 'legendary', primaryColor: 0x124e89, accentColor: 0xffffff, source: 'shop', gemCost: 250 },
  { key: 'gilded', name: 'Dore', description: 'Pure or.', rarity: 'legendary', primaryColor: 0xfee761, accentColor: 0xfee761, source: 'shop', gemCost: 200 },

  // Events / saisonniers (6)
  { key: 'pumpkin', name: 'Citrouille', description: 'Halloween only.', rarity: 'rare', primaryColor: 0xfeae34, accentColor: 0x181425, source: 'event' },
  { key: 'santa', name: 'Pere Noel', description: 'Hiver only.', rarity: 'rare', primaryColor: 0xff0044, accentColor: 0xffffff, source: 'event' },
  { key: 'spring_bloom', name: 'Floraison', description: 'Printemps only.', rarity: 'rare', primaryColor: 0xff5577, accentColor: 0xa8e66c, source: 'event' },
  { key: 'summer_palm', name: 'Palmier', description: 'Ete only.', rarity: 'rare', primaryColor: 0x63c74d, accentColor: 0xfee761, source: 'event' },
  { key: 'easter', name: 'Paques', description: 'Lapin doré.', rarity: 'epic', primaryColor: 0xa8e66c, accentColor: 0xfee761, source: 'event' },
  { key: 'fireworks', name: 'Feux d\'artifice', description: 'Nouvel an.', rarity: 'epic', primaryColor: 0x0099db, accentColor: 0xfee761, source: 'event' },
];
