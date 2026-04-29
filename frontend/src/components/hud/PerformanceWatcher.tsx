// PerformanceWatcher : observe Battery API + FPS, ajuste auto les
// effets pour preserver la batterie / fluidite (idees #437 #438 #439).

import { useEffect, useRef } from 'react';
import { useEffectsStore } from '../../stores/effectsStore.js';

interface BatteryManager {
  level: number;
  charging: boolean;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
}

interface NavigatorBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export function PerformanceWatcher() {
  const setEnableShake = useEffectsStore((s) => s.setEnableShake);
  const setEnableParticles = useEffectsStore((s) => s.setEnableParticles);
  const lowPowerRef = useRef(false);

  // Battery API : si batterie < 20% et pas en charge -> low power.
  useEffect(() => {
    const nav = navigator as NavigatorBattery;
    if (typeof nav.getBattery !== 'function') return;
    let battery: BatteryManager | null = null;
    let listener: (() => void) | null = null;

    function check(b: BatteryManager) {
      const isLow = b.level < 0.2 && !b.charging;
      if (isLow && !lowPowerRef.current) {
        lowPowerRef.current = true;
        setEnableShake(false);
        setEnableParticles(false);
      } else if (!isLow && lowPowerRef.current) {
        lowPowerRef.current = false;
        // On ne reactive PAS automatiquement (l'utilisateur peut avoir
        // desactive volontairement). On laisse le toggle tel quel.
      }
    }

    nav.getBattery().then((b) => {
      battery = b;
      listener = () => check(b);
      check(b);
      b.addEventListener('levelchange', listener);
      b.addEventListener('chargingchange', listener);
    });

    return () => {
      if (battery && listener) {
        battery.removeEventListener('levelchange', listener);
        battery.removeEventListener('chargingchange', listener);
      }
    };
  }, [setEnableShake, setEnableParticles]);

  // FPS auto : si FPS < 25 sur 5s, desactive les particules.
  useEffect(() => {
    let raf = 0;
    let frames = 0;
    let last = performance.now();
    let lowFpsCount = 0;

    function tick() {
      frames += 1;
      const now = performance.now();
      const dt = now - last;
      if (dt >= 1000) {
        const fps = (frames * 1000) / dt;
        if (fps < 25) lowFpsCount += 1;
        else lowFpsCount = Math.max(0, lowFpsCount - 1);
        if (lowFpsCount >= 5) {
          setEnableParticles(false);
          lowFpsCount = 0;
        }
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [setEnableParticles]);

  return null;
}
