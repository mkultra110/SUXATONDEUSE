// SpecialDateEggs : applique des classes body selon dates speciales
// pour easter eggs visuels (idees #672 #673 #674).

import { useEffect } from 'react';

export function SpecialDateEggs() {
  useEffect(() => {
    function apply() {
      const now = new Date();
      const m = now.getMonth();
      const d = now.getDate();
      const day = now.getDay();
      const body = document.body;
      // 1er avril (12h max pour ne pas troller toute la journee).
      if (m === 3 && d === 1 && now.getHours() < 12) body.classList.add('april-fools');
      else body.classList.remove('april-fools');
      // 21 juin solstice ete.
      if (m === 5 && d === 21) body.classList.add('summer-solstice');
      else body.classList.remove('summer-solstice');
      // Vendredi 13.
      if (day === 5 && d === 13) body.classList.add('friday-13');
      else body.classList.remove('friday-13');
    }
    apply();
    const i = setInterval(apply, 60_000);
    return () => clearInterval(i);
  }, []);
  return null;
}
