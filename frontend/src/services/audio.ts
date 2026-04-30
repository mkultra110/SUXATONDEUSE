// Service audio : SFX synthetiques (Web Audio API, sans fichier) + slot
// musique ambiante. Mute / volume persistes dans localStorage.

const STORAGE_KEY = 'suxa-audio';

export interface AudioPrefs {
  muted: boolean;
  sfxVolume: number;   // 0..1
  musicVolume: number; // 0..1
}

const DEFAULT_PREFS: AudioPrefs = {
  muted: false,
  sfxVolume: 0.5,
  musicVolume: 0.3,
};

function loadPrefs(): AudioPrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<AudioPrefs>;
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(p: AudioPrefs) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicEl: HTMLAudioElement | null = null;
  private musicSrc: MediaElementAudioSourceNode | null = null;
  private prefs: AudioPrefs = loadPrefs();
  private listeners: Set<(p: AudioPrefs) => void> = new Set();
  // Throttle pour eviter le tearing audio sur les ticks rapproches.
  private lastPlay: Map<string, number> = new Map();

  getPrefs(): AudioPrefs {
    return { ...this.prefs };
  }

  subscribe(fn: (p: AudioPrefs) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.getPrefs()));
  }

  setMuted(muted: boolean) {
    this.prefs.muted = muted;
    savePrefs(this.prefs);
    this.applyVolume();
    this.notify();
  }

  toggleMuted() {
    this.setMuted(!this.prefs.muted);
  }

  setSfxVolume(v: number) {
    this.prefs.sfxVolume = Math.max(0, Math.min(1, v));
    savePrefs(this.prefs);
    this.applyVolume();
    this.notify();
  }

  setMusicVolume(v: number) {
    this.prefs.musicVolume = Math.max(0, Math.min(1, v));
    savePrefs(this.prefs);
    this.applyVolume();
    this.notify();
  }

  private ensureCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      try {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new Ctor();
        this.masterGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();
        this.sfxGain.connect(this.masterGain);
        this.musicGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
        this.applyVolume();
      } catch {
        return null;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private applyVolume() {
    if (!this.masterGain || !this.sfxGain || !this.musicGain) return;
    const m = this.prefs.muted ? 0 : 1;
    this.masterGain.gain.value = m;
    this.sfxGain.gain.value = this.prefs.sfxVolume;
    this.musicGain.gain.value = this.prefs.musicVolume;
    if (this.musicEl) {
      this.musicEl.muted = this.prefs.muted;
    }
  }

  /** Joue un SFX synthetique avec throttle anti-spam. */
  private playSynth(
    name: string,
    options: {
      freq: number;
      freqEnd?: number;
      duration: number;
      type?: OscillatorType;
      attack?: number;
      decay?: number;
      gain?: number;
      throttleMs?: number;
    },
  ) {
    const ctx = this.ensureCtx();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    const throttle = options.throttleMs ?? 30;
    const last = this.lastPlay.get(name) ?? 0;
    if (Date.now() - last < throttle) return;
    this.lastPlay.set(name, Date.now());

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = options.type ?? 'square';
    osc.frequency.setValueAtTime(options.freq, now);
    if (options.freqEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(options.freqEnd, now + options.duration);
    }
    const peak = options.gain ?? 0.25;
    const attack = options.attack ?? 0.005;
    const decay = options.decay ?? 0.05;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(peak, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, now + options.duration + decay);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + options.duration + decay + 0.05);
  }

  /** Tap clic herbe — petit pop court. */
  playTap() {
    this.playSynth('tap', {
      freq: 600,
      freqEnd: 380,
      duration: 0.06,
      type: 'square',
      gain: 0.18,
      throttleMs: 20,
    });
  }

  /** Coupe une tuile d'herbe — bruit organique. */
  playMow() {
    this.playSynth('mow', {
      freq: 220,
      freqEnd: 90,
      duration: 0.12,
      type: 'sawtooth',
      gain: 0.22,
      throttleMs: 60,
    });
    // Petit 'shhh' aigu superpose.
    this.playSynth('mow-hi', {
      freq: 1800,
      freqEnd: 1200,
      duration: 0.08,
      type: 'triangle',
      gain: 0.06,
      throttleMs: 60,
    });
  }

  /** Achat reussi — accord rapide ascendant. */
  playPurchase() {
    const ctx = this.ensureCtx();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, now + i * 0.05);
      g.gain.linearRampToValueAtTime(0.25, now + i * 0.05 + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.18);
      o.connect(g);
      g.connect(this.sfxGain!);
      o.start(now + i * 0.05);
      o.stop(now + i * 0.05 + 0.25);
    });
  }

  /** Echec — buzz court bas. */
  playError() {
    this.playSynth('error', {
      freq: 180,
      freqEnd: 130,
      duration: 0.15,
      type: 'sawtooth',
      gain: 0.18,
      throttleMs: 100,
    });
  }

  /** Coin pickup — clochette. */
  playCoin() {
    this.playSynth('coin', {
      freq: 1200,
      freqEnd: 1800,
      duration: 0.06,
      type: 'triangle',
      gain: 0.18,
      throttleMs: 50,
    });
    this.playSynth('coin2', {
      freq: 1600,
      duration: 0.08,
      type: 'sine',
      gain: 0.1,
      throttleMs: 50,
    });
  }

  /** CHA-CHING escalant : pitch monte avec le combo, layered. */
  playChaChing(combo: number) {
    const ctx = this.ensureCtx();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    const c = Math.max(0, Math.min(20, combo));
    // Frequence de base monte de 60 Hz par tick de combo (cap 20 -> +1200Hz).
    const baseFreq = 880 + c * 60;
    const intervals = [1, 1.25, 1.5]; // accord majeur
    intervals.forEach((mult, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = baseFreq * mult;
      g.gain.setValueAtTime(0, now + i * 0.02);
      g.gain.linearRampToValueAtTime(0.16, now + i * 0.02 + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.02 + 0.16);
      o.connect(g);
      g.connect(this.sfxGain!);
      o.start(now + i * 0.02);
      o.stop(now + i * 0.02 + 0.22);
    });
  }

  /** Boss kill : boom + applaudissement layered, ducking music bed brief. */
  playBossKill() {
    const ctx = this.ensureCtx();
    if (!ctx || !this.sfxGain || !this.musicGain) return;
    const now = ctx.currentTime;
    // Sub boom : sine grave qui descend.
    const boom = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boom.type = 'sine';
    boom.frequency.setValueAtTime(120, now);
    boom.frequency.exponentialRampToValueAtTime(40, now + 0.6);
    boomGain.gain.setValueAtTime(0.5, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    boom.connect(boomGain);
    boomGain.connect(this.sfxGain);
    boom.start(now);
    boom.stop(now + 0.8);
    // Brillance : burst noise blanc filtre passe-haut (fake clap).
    const noiseLen = 0.3;
    const buf = ctx.createBuffer(1, ctx.sampleRate * noiseLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const env = Math.exp(-i / (data.length * 0.2));
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.2;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1800;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start(now + 0.05);
    // Ducking music ~700ms.
    const m = this.prefs.musicVolume;
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(m, now);
    this.musicGain.gain.linearRampToValueAtTime(m * 0.3, now + 0.05);
    this.musicGain.gain.linearRampToValueAtTime(m, now + 0.9);
    // Trumpet de victoire : 3 notes ascendantes.
    [392, 523, 784].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, now + 0.1 + i * 0.12);
      g.gain.linearRampToValueAtTime(0.18, now + 0.1 + i * 0.12 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.1 + i * 0.12 + 0.25);
      o.connect(g);
      g.connect(this.sfxGain!);
      o.start(now + 0.1 + i * 0.12);
      o.stop(now + 0.1 + i * 0.12 + 0.3);
    });
  }

  /** Tick discret de remplissage XP bar (10% steps). */
  playXpTick() {
    this.playSynth('xptick', {
      freq: 2200,
      duration: 0.04,
      type: 'sine',
      gain: 0.08,
      throttleMs: 80,
    });
  }

  /** Heartbeat sub-bass quand un upgrade est quasi-achetable (95%+). */
  playHeartbeat() {
    this.playSynth('heartbeat', {
      freq: 70,
      freqEnd: 50,
      duration: 0.18,
      type: 'sine',
      gain: 0.18,
      throttleMs: 800,
    });
  }

  /** Rang up : carillon montant 5 notes. */
  playRankUp() {
    const ctx = this.ensureCtx();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    [523, 659, 784, 988, 1175].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, now + i * 0.08);
      g.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
      o.connect(g);
      g.connect(this.sfxGain!);
      o.start(now + i * 0.08);
      o.stop(now + i * 0.08 + 0.32);
    });
  }

  /** Notification "ding" offline ready (idee #647) - 2 notes douces. */
  playDing() {
    const ctx = this.ensureCtx();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    [880, 1175].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, now + i * 0.12);
      g.gain.linearRampToValueAtTime(0.18, now + i * 0.12 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
      o.connect(g);
      g.connect(this.sfxGain!);
      o.start(now + i * 0.12);
      o.stop(now + i * 0.12 + 0.45);
    });
  }

  /** Coq qui rate son chant (easter egg, 1/1000). Pitch chaotique. */
  playRoosterFail() {
    const ctx = this.ensureCtx();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    [400, 700, 350, 280].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(f, now + i * 0.18);
      o.frequency.exponentialRampToValueAtTime(f * 0.5, now + i * 0.18 + 0.16);
      g.gain.setValueAtTime(0, now + i * 0.18);
      g.gain.linearRampToValueAtTime(0.15, now + i * 0.18 + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.18);
      o.connect(g);
      g.connect(this.sfxGain!);
      o.start(now + i * 0.18);
      o.stop(now + i * 0.18 + 0.2);
    });
  }

  /** Rare : papillon dore, bell aigu plus etoile. */
  playRare() {
    const ctx = this.ensureCtx();
    if (!ctx || !this.sfxGain) return;
    const now = ctx.currentTime;
    [1568, 2093, 2637].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, now + i * 0.04);
      g.gain.linearRampToValueAtTime(0.14, now + i * 0.04 + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.4);
      o.connect(g);
      g.connect(this.sfxGain!);
      o.start(now + i * 0.04);
      o.stop(now + i * 0.04 + 0.42);
    });
  }

  /** Ducking general : reduit le master gain temporairement (ex: tab caché). */
  setMasterMultiplier(mult: number, fadeMs = 250) {
    if (!this.masterGain || !this.ctx) return;
    const target = this.prefs.muted ? 0 : Math.max(0, Math.min(1, mult));
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(target, now + fadeMs / 1000);
  }

  /** Charge la musique ambiante (fichier dans /assets/audio/ambient.mp3). */
  loadMusic(url: string) {
    const ctx = this.ensureCtx();
    if (!ctx || !this.musicGain) return;
    if (this.musicEl) {
      this.musicEl.pause();
      this.musicSrc?.disconnect();
    }
    this.musicEl = new Audio(url);
    this.musicEl.loop = true;
    this.musicEl.crossOrigin = 'anonymous';
    this.musicEl.muted = this.prefs.muted;
    try {
      this.musicSrc = ctx.createMediaElementSource(this.musicEl);
      this.musicSrc.connect(this.musicGain);
    } catch {
      // Fallback : direct HTMLAudio (sans gain control).
    }
  }

  startMusic() {
    if (!this.musicEl) return;
    this.musicEl.play().catch(() => {
      // Browsers exigent souvent un user gesture avant de jouer.
      // Si l'audio file n'est pas dispo (404), fallback sur le synth pad.
      this.startSynthAmbient();
    });
    // Verifie apres 500ms si ca a echoue silencieusement (404), bascule synth.
    setTimeout(() => {
      if (this.musicEl && this.musicEl.paused && !this.musicEl.duration) {
        this.startSynthAmbient();
      }
    }, 500);
  }

  stopMusic() {
    if (this.musicEl) this.musicEl.pause();
    this.stopSynthAmbient();
  }

  // === MUSIQUE AMBIANTE SYNTH (FALLBACK SI PAS DE FICHIER MP3) ===
  // Generee via Web Audio API : pad cozy en C lydien (Do-Re-Mi-Fa#-Sol-La-Si)
  // avec progression d'accords doux et pulse de bass subtile.
  // Loop permanent, volume bas, evoque les jeux cottagecore.
  private synthAmbientNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private synthAmbientLoopTimer: ReturnType<typeof setInterval> | null = null;

  private startSynthAmbient() {
    const ctx = this.ensureCtx();
    if (!ctx || !this.musicGain) return;
    if (this.synthAmbientLoopTimer) return; // Deja en cours.

    // Progression d'accords cozy en Do majeur :
    // C - Am - F - G (loop). 4 mesures de 4 secondes = 16s loop.
    const chords: number[][] = [
      [261.63, 329.63, 392.0], // C major (Do-Mi-Sol)
      [220.0, 261.63, 329.63], // A minor (La-Do-Mi)
      [174.61, 220.0, 261.63], // F major (Fa-La-Do)
      [196.0, 246.94, 293.66], // G major (Sol-Si-Re)
    ];
    const measureDur = 4;
    let chordIdx = 0;

    const playChord = () => {
      if (!ctx || !this.musicGain) return;
      const now = ctx.currentTime;
      const chord = chords[chordIdx % chords.length]!;
      // 3 oscillators triangle (pad doux), fade in/out.
      const newNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        // Octave +1 sur la 3eme note pour une couleur lydienne ouverte.
        if (i === 2) osc.frequency.value = freq * 2;
        gain.gain.setValueAtTime(0, now);
        // Volume tres bas (musique d'ambiance, pas un solo).
        gain.gain.linearRampToValueAtTime(0.04, now + 1.0);
        gain.gain.linearRampToValueAtTime(0.03, now + measureDur - 0.5);
        gain.gain.linearRampToValueAtTime(0, now + measureDur);
        osc.connect(gain);
        gain.connect(this.musicGain!);
        osc.start(now);
        osc.stop(now + measureDur + 0.1);
        newNodes.push({ osc, gain });
      });
      // Cleanup ancien chord apres 200ms.
      const old = this.synthAmbientNodes;
      this.synthAmbientNodes = newNodes;
      setTimeout(() => {
        old.forEach(({ osc, gain }) => {
          try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch { /* ignore */ }
        });
      }, 200);
      chordIdx++;
    };

    playChord();
    this.synthAmbientLoopTimer = setInterval(playChord, measureDur * 1000);
  }

  private stopSynthAmbient() {
    if (this.synthAmbientLoopTimer) {
      clearInterval(this.synthAmbientLoopTimer);
      this.synthAmbientLoopTimer = null;
    }
    this.synthAmbientNodes.forEach(({ osc, gain }) => {
      try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch { /* ignore */ }
    });
    this.synthAmbientNodes = [];
  }
}

export const audio = new AudioService();
