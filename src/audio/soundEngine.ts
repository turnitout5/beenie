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

  /**
   * Subtle surface-reactive footstep tap
   */
  public playFootstep(surface: 'grass' | 'wood' | 'stone' = 'grass'): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    const baseFreq = surface === 'grass' ? 90 : surface === 'wood' ? 140 : 210;
    osc.type = surface === 'grass' ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.05);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Cute retro companion emote sound
   */
  public playEmote(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  /**
   * Procedural Happy Birthday Music Box Jingle
   */
  public playBirthdayJingle(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Happy birthday notes [freq, duration, pause]
    const notes: [number, number][] = [
      [392.00, 0.22], // G4
      [392.00, 0.22], // G4
      [440.00, 0.44], // A4
      [392.00, 0.44], // G4
      [523.25, 0.44], // C5
      [493.88, 0.88], // B4
      [392.00, 0.22], // G4
      [392.00, 0.22], // G4
      [440.00, 0.44], // A4
      [392.00, 0.44], // G4
      [587.33, 0.44], // D5
      [523.25, 0.90], // C5
    ];

    let timeOffset = ctx.currentTime + 0.05;

    notes.forEach(([freq, dur]) => {
      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      // Music box bell chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, timeOffset);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2, timeOffset);

      gain.gain.setValueAtTime(0.001, timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.12, timeOffset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, timeOffset + dur);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(ctx.destination);

      osc.start(timeOffset);
      oscHarmonic.start(timeOffset);
      osc.stop(timeOffset + dur + 0.05);
      oscHarmonic.stop(timeOffset + dur + 0.05);

      timeOffset += dur + 0.06;
    });
  }

  /**
   * Soft airy puff sound when blowing out birthday candles
   */
  public playBlowCandles(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  /**
   * Cheerful confetti pop sound
   */
  public playConfettiPop(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  /**
   * Nostalgic music-box celesta motif of "Bol Na Halke Halke"
   * Dedicated anthem for Beenish and Ted.
   */
  public playBolNaHalkeHalke(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Melody sequence: [freq, duration, pause]
    // "Bol na halke halke... bol na halke halke..."
    const notes: [number, number, number][] = [
      [392.00, 0.38, 0.05], // G4 ("Bol")
      [440.00, 0.32, 0.04], // A4 ("na")
      [493.88, 0.42, 0.06], // B4 ("hal-")
      [440.00, 0.28, 0.04], // A4 ("ke")
      [392.00, 0.55, 0.15], // G4 ("hal-ke...")
      [369.99, 0.35, 0.05], // F#4
      [392.00, 0.38, 0.05], // G4 ("Bol")
      [440.00, 0.32, 0.04], // A4 ("na")
      [523.25, 0.45, 0.06], // C5 ("hal-")
      [493.88, 0.35, 0.05], // B4 ("ke")
      [440.00, 0.60, 0.20], // A4 ("hal-ke...")
      [392.00, 0.70, 0.25], // G4 (resolving tender chord)
    ];

    let timeOffset = ctx.currentTime + 0.05;

    notes.forEach(([freq, dur, pause]) => {
      const osc = ctx.createOscillator();
      const harmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft singing celesta tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, timeOffset);

      harmonic.type = 'triangle';
      harmonic.frequency.setValueAtTime(freq * 2, timeOffset);

      gain.gain.setValueAtTime(0.001, timeOffset);
      gain.gain.linearRampToValueAtTime(0.09, timeOffset + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, timeOffset + dur + 0.4);

      osc.connect(gain);
      harmonic.connect(gain);
      gain.connect(ctx.destination);

      osc.start(timeOffset);
      harmonic.start(timeOffset);
      osc.stop(timeOffset + dur + 0.45);
      harmonic.stop(timeOffset + dur + 0.45);

      timeOffset += dur + pause;
    });
  }
}

export const soundEngine = new SoundEngine();

