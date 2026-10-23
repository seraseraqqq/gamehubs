const audioStorage={getItem(key){try{return window.localStorage.getItem(key);}catch{return null;}},setItem(key,value){try{window.localStorage.setItem(key,value);}catch{}}};
/**
 * Gulper.io - Web Audio API Procedural Sound Engine
 * Zero external audio files, ultra-low latency, pure synthesized SFX.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = audioStorage.getItem('gulper_muted') !== 'false';
    this.boostOsc = null;
    this.boostGain = null;
    this.isBoosting = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn('Web Audio not supported:', e);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    audioStorage.setItem('gulper_muted', this.isMuted);
    if (this.isMuted && this.boostGain) {
      this.stopBoost();
    }
    return this.isMuted;
  }

  // Soft sparkle chime when swallowing energy pellets
  playEat(mass = 1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 480 + Math.min(mass * 40, 400) + Math.random() * 60;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Continuous thrust hum when boosting
  startBoost() {
    if (this.isMuted || this.isBoosting) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;

    this.isBoosting = true;
    const now = this.ctx.currentTime;

    this.boostOsc = this.ctx.createOscillator();
    this.boostGain = this.ctx.createGain();

    this.boostOsc.type = 'triangle';
    this.boostOsc.frequency.setValueAtTime(95, now);
    this.boostOsc.frequency.linearRampToValueAtTime(140, now + 0.3);

    this.boostGain.gain.setValueAtTime(0.01, now);
    this.boostGain.gain.linearRampToValueAtTime(0.09, now + 0.15);

    this.boostOsc.connect(this.boostGain);
    this.boostGain.connect(this.ctx.destination);

    this.boostOsc.start(now);
  }

  stopBoost() {
    if (!this.isBoosting) return;
    this.isBoosting = false;
    if (this.boostGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.boostGain.gain.linearRampToValueAtTime(0.001, now + 0.1);
      setTimeout(() => {
        if (this.boostOsc) {
          try {
            this.boostOsc.stop();
            this.boostOsc.disconnect();
          } catch (e) {}
          this.boostOsc = null;
        }
      }, 120);
    }
  }

  // Bass thud and electrical pop when a snake crashes and shatters
  playExplosion() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Triumphant chord when you eliminate a rival snake
  playKill() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;

    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.05);

      gain.gain.setValueAtTime(0.12, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.28);
    });
  }
}

window.soundEngine = new SoundEngine();
