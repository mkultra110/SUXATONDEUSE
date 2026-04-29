// SkyHourGradient : applique une class body "sky-{period}" qui change le
// gradient de la page selon l'heure locale (idees #60 #61).
// Updates toutes les 60s.

import { useEffect } from 'react';

function periodForHour(h: number): 'dawn' | 'day' | 'dusk' | 'night' {
  if (h >= 5 && h < 8) return 'dawn';
  if (h >= 8 && h < 18) return 'day';
  if (h >= 18 && h < 21) return 'dusk';
  return 'night';
}

const SKY_GRADIENTS: Record<string, string> = {
  dawn: 'linear-gradient(180deg, #FFB48A 0%, #FFE0AB 30%, var(--color-paper-2) 100%)',
  day: 'linear-gradient(180deg, var(--color-sky-morning) 0%, var(--color-paper-2) 30%, var(--color-paper-2) 100%)',
  dusk: 'linear-gradient(180deg, #C77B5B 0%, #F5C443 30%, var(--color-paper-2) 100%)',
  night: 'linear-gradient(180deg, #1a2849 0%, #2a3858 30%, var(--color-paper-2) 100%)',
};

export function SkyHourGradient() {
  useEffect(() => {
    function apply() {
      const h = new Date().getHours();
      const period = periodForHour(h);
      document.documentElement.style.setProperty('--sky-gradient', SKY_GRADIENTS[period] ?? SKY_GRADIENTS.day!);
      document.body.dataset.skyPeriod = period;
    }
    apply();
    const i = setInterval(apply, 60_000);
    return () => clearInterval(i);
  }, []);
  return null;
}
