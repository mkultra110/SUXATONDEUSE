// Hook React pour s'abonner aux preferences audio et garantir un re-render
// quand elles changent. Initialise aussi la musique ambiante au mount.

import { useEffect, useState } from 'react';
import { audio } from '../services/audio.js';

const MUSIC_URL = '/assets/audio/ambient.mp3';

let musicLoaded = false;

export function useAudio() {
  const [prefs, setPrefs] = useState(audio.getPrefs());

  useEffect(() => {
    const unsub = audio.subscribe(setPrefs);
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (!musicLoaded) {
      musicLoaded = true;
      audio.loadMusic(MUSIC_URL);
    }
    // Demarre la musique apres un user gesture (gere via document listener).
    function tryStart() {
      audio.startMusic();
      document.removeEventListener('pointerdown', tryStart);
      document.removeEventListener('keydown', tryStart);
    }
    document.addEventListener('pointerdown', tryStart, { once: true });
    document.addEventListener('keydown', tryStart, { once: true });
    return () => {
      document.removeEventListener('pointerdown', tryStart);
      document.removeEventListener('keydown', tryStart);
    };
  }, []);

  return {
    prefs,
    toggleMute: () => audio.toggleMuted(),
    setSfxVolume: (v: number) => audio.setSfxVolume(v),
    setMusicVolume: (v: number) => audio.setMusicVolume(v),
  };
}
