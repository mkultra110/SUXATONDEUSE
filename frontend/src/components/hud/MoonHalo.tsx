// MoonHalo : halo lunaire visible la nuit (idee #149).

import { useEffect, useState } from 'react';

export function MoonHalo() {
  const [isNight, setIsNight] = useState(false);
  useEffect(() => {
    function check() {
      const h = new Date().getHours();
      setIsNight(h >= 21 || h < 6);
    }
    check();
    const i = setInterval(check, 60_000);
    return () => clearInterval(i);
  }, []);
  if (!isNight) return null;
  return <div className="moon-halo" aria-hidden />;
}
