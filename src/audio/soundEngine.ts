/**
 * Web Audio API Procedural Sound Engine
 * Synthesizes retro chimes, clicks, stamps, and gavels without relying on external MP3 downloads.
 * Guarantees zero broken audio links and instantaneous playback on GitHub Pages.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;

  constructor() {
    // Check saved mute state from localStorage
    const savedMute = localStorage.getItem('beenish_expedition_muted');
    this.isMuted = savedMute === 'true';
  }

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('beenish_expedition_muted', String(this.isMuted));
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx?.currentTime || 0);
    }
    return this.isMuted;
  }

  /**
   * Delicate star recovery chime (C5 -> E5 -> G5 -> C6 arpeggio)
   */
  public playStarChime(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.50];
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.001, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.65);
    });
  }

  /**
   * Crisp retro UI click
   */
  public playClick(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Bureau Rubber Stamp Thud
   */
  public playStamp(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Low pitch impact
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  /**
   * Courtroom Gavel Impact
   */
  public playGavel(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Wooden thud
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.21);
  }

  /**
   * Paper / File folder shuffle
   */
  public playPaperRustle(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // White noise burst filtered
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  /**
   * Ambient Night Soundscape (gentle breeze & soft crickets synth)
   */
  public startNightAmbience(): void {
    if (this.isAmbientPlaying || typeof window === 'undefined') return;
    const ctx = this.initContext();
    if (!ctx) return;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, ctx.currentTime);
    this.ambientGain.connect(ctx.destination);

    // Filtered pink-like noise generator for gentle wind
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2) * 0.03;
    }

    const windSource = ctx.createBufferSource();
    windSource.buffer = buffer;
    windSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    windSource.connect(filter);
    filter.connect(this.ambientGain);
    windSource.start();

    this.isAmbientPlaying = true;
  }

  /**
   * Metallic Key Unlock Click
   */
  public playKeyUnlock(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Two rapid metallic clicks
    [0, 0.08].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now + offset);
      osc.frequency.exponentialRampToValueAtTime(800, now + offset + 0.04);

      gain.gain.setValueAtTime(0.2, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.06);
    });
  }

  /**
   * Door opening sound (warm wooden shift)
   */
  public playDoorOpen(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.25);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  private gardenTimer: number | null = null;

  /**
   * Serene music box arpeggios for the Secret Garden
   */
  public startGardenMelody(): void {
    if (this.isMuted || this.gardenTimer !== null || typeof window === 'undefined') return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Gentle chord progression: C - G/B - Am - F (peaceful, nostalgic)
    const melodyNotes = [
      523.25, 659.25, 783.99, 1046.50, // C chord
      493.88, 587.33, 783.99, 987.77,  // G chord
      440.00, 523.25, 659.25, 880.00,  // Am chord
      349.23, 440.00, 523.25, 698.46,  // F chord
    ];

    let noteIdx = 0;
    const playNextNote = () => {
      if (this.isMuted || !this.ctx) return;
      const freq = melodyNotes[noteIdx];
      noteIdx = (noteIdx + 1) % melodyNotes.length;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    };

    playNextNote();
    this.gardenTimer = window.setInterval(playNextNote, 800);
  }

  public stopGardenMelody(): void {
    if (this.gardenTimer !== null) {
      clearInterval(this.gardenTimer);
      this.gardenTimer = null;
    }
  }
}

export const soundEngine = new SoundEngine();

