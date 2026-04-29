// HolidayDecor : decorations saisonnieres flottantes (sapin Noel,
// citrouille Halloween, muguet 1er mai, drapeau 14 juillet).
// Idees #50 #85 #86 #87.

export function HolidayDecor() {
  const now = new Date();
  const m = now.getMonth(); // 0-11
  const d = now.getDate();
  const items: { emoji: string; label: string; key: string }[] = [];

  // Decembre : sapin de Noel.
  if (m === 11) items.push({ emoji: '🎄', label: 'Joyeux Noel', key: 'tree' });
  // Octobre derniere semaine : citrouille + toile araignee.
  if (m === 9 && d >= 25) {
    items.push({ emoji: '🎃', label: 'Halloween', key: 'pumpkin' });
    items.push({ emoji: '🕸️', label: 'Toile d\'araignee', key: 'cobweb' });
    items.push({ emoji: '🦇', label: 'Chauve-souris', key: 'bat' });
  }
  // 1er mai : muguet.
  if (m === 4 && d === 1) items.push({ emoji: '🌼', label: '1er mai', key: 'lily' });
  // 14 juillet : drapeau.
  if (m === 6 && d === 14) {
    items.push({ emoji: '🇫🇷', label: '14 juillet', key: 'flag' });
    items.push({ emoji: '🎆', label: 'Feu d\'artifice', key: 'firework' });
  }
  // 1er janvier : confettis.
  if (m === 0 && d === 1) items.push({ emoji: '🎉', label: 'Bonne annee !', key: 'newyear' });
  // Saint-Valentin.
  if (m === 1 && d === 14) items.push({ emoji: '💝', label: 'Saint-Valentin', key: 'valentine' });
  // Paques (approximation : 1er dimanche d'avril).
  if (m === 3 && d <= 7 && now.getDay() === 0) items.push({ emoji: '🐰', label: 'Paques', key: 'easter' });
  // 1er avril.
  if (m === 3 && d === 1) {
    items.push({ emoji: '🐟', label: 'Poisson d\'avril', key: 'fish' });
    items.push({ emoji: '🌸', label: 'Pluie de petales', key: 'april-petal' });
  }
  // Saint-Patrick (17 mars).
  if (m === 2 && d === 17) items.push({ emoji: '🍀', label: 'Saint-Patrick', key: 'patrick' });
  // Mardi-gras (approximation premier mardi de fevrier).
  if (m === 1 && d <= 14 && now.getDay() === 2) items.push({ emoji: '🎭', label: 'Mardi gras', key: 'mardigras' });

  if (items.length === 0) return null;

  return (
    <>
      {items.map((it, i) => (
        <div
          key={it.key}
          aria-label={it.label}
          title={it.label}
          style={{
            position: 'fixed',
            top: 90 + i * 60,
            left: 12,
            zIndex: 50,
            fontSize: 36,
            filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.3))',
            pointerEvents: 'none',
            animation: 'pulse 3s ease-in-out infinite',
          }}
        >
          {it.emoji}
        </div>
      ))}
    </>
  );
}
