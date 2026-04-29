// Easter eggs date speciale : 1er avril, Noel, Halloween, 14 juillet.
// Lis date locale du joueur, retourne un theme actif si date matche.

export type SpecialDate =
  | 'april-fools'
  | 'christmas'
  | 'halloween'
  | 'bastille-day'
  | null;

export function getCurrentSpecialDate(now: Date = new Date()): SpecialDate {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  // 1er avril : faux nez sur les robots, message Memé blagueur.
  if (month === 4 && day === 1) return 'april-fools';
  // Noel : 24-26 decembre, bonnets rouges + neige forcee.
  if (month === 12 && day >= 24 && day <= 26) return 'christmas';
  // Halloween : 31 octobre, citrouilles dans le jardin.
  if (month === 10 && day === 31) return 'halloween';
  // 14 juillet : feux d'artifice tricolores.
  if (month === 7 && day === 14) return 'bastille-day';
  return null;
}

export const SPECIAL_DATE_LABELS: Record<NonNullable<SpecialDate>, string> = {
  'april-fools': "Joyeux 1er avril ! Marcel a colle des faux nez sur les robots.",
  christmas: 'Joyeuses fetes ! Les robots portent leurs bonnets rouges.',
  halloween: 'Bouh ! Mémé a installe des citrouilles partout.',
  'bastille-day': 'Bonne fête nationale ! Les feux d\'artifice tricolores sont sortis.',
};
