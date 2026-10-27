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
  private musicAudio: HTMLAudioElement | null = null;
  private currentSong: 'bol_na_halke_halke' | 'mohabat' | null = null;
  private isSongPlaying: boolean = false;
  private songListeners: Array<(isPlaying: boolean, song: 'bol_na_halke_halke' | 'mohabat' | null) => void> = [];

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
    if (this.musicAudio) {
      this.musicAudio.volume = this.isMuted ? 0 : 0.65;
    }
    return this.isMuted;
  }

  public onSongChange(listener: (isPlaying: boolean, song: 'bol_na_halke_halke' | 'mohabat' | null) => void): () => void {
    this.songListeners.push(listener);
    return () => {
      this.songListeners = this.songListeners.filter(l => l !== listener);
    };
  }

  private notifySongChange(): void {
    this.songListeners.forEach(l => l(this.isSongPlaying, this.currentSong));
  }

  public getSongPlaying(): boolean {
    return this.isSongPlaying;
  }

  public getCurrentSong(): 'bol_na_halke_halke' | 'mohabat' | null {
    return this.currentSong;
  }

  /**
   * Plays the authentic studio recording of the couple's favorite songs
   */
  public playSong(song: 'bol_na_halke_halke' | 'mohabat' = 'bol_na_halke_halke'): void {
    if (typeof window === 'undefined') return;

    const songFile = song === 'bol_na_halke_halke' 
      ? '/audio/bol_na_halke_halke.mp3' 
      : '/audio/mohabat_jisko_baksh_zindagi.mp3';

    if (this.musicAudio) {
      if (this.currentSong === song && !this.musicAudio.paused) {
        return; // Already playing this song
      }
      this.musicAudio.pause();
    }

    try {
      this.musicAudio = new Audio(songFile);
      this.musicAudio.loop = true;
      this.musicAudio.volume = this.isMuted ? 0 : 0.65;
      this.currentSong = song;

      const playPromise = this.musicAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isSongPlaying = true;
            this.notifySongChange();
          })
          .catch((err) => {
            console.log('Audio autoplay prevented by browser. Will resume on first click.', err);
            this.isSongPlaying = false;
            this.notifySongChange();
            // User interaction unlocker
            const unlock = () => {
              if (this.musicAudio) {
                this.musicAudio.play().then(() => {
                  this.isSongPlaying = true;
                  this.notifySongChange();
                }).catch(() => {});
              }
              window.removeEventListener('click', unlock);
              window.removeEventListener('keydown', unlock);
            };
            window.addEventListener('click', unlock, { once: true });
            window.addEventListener('keydown', unlock, { once: true });
          });
      }
    } catch (e) {
      console.warn('Could not initialize audio player:', e);
    }
  }

  public pauseSong(): void {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.isSongPlaying = false;
      this.notifySongChange();
    }
  }

  public toggleSong(song: 'bol_na_halke_halke' | 'mohabat' = 'bol_na_halke_halke'): boolean {
    if (this.isSongPlaying && this.currentSong === song) {
      this.pauseSong();
      return false;
    } else {
      this.playSong(song);
      return true;
    }
  }

  /**
   * Plays bike / muscle car horn sound
   */
  public playHorn(variant: 1 | 2 = 1): void {
    if (this.isMuted || typeof window === 'undefined') return;
    try {
      const horn = new Audio(`/audio/horn${variant}.mp3`);
      horn.volume = 0.5;
      horn.play().catch(() => {});
    } catch {
      this.playGavel();
    }
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
   * Retro Coin / Paisay Chime (B5 -> E6)
   */
  public playCoin(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [987.77, 1318.51];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.18, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.38);
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

  private tuneTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isTuneLooping: boolean = false;

  /**
   * Official Bollypiano & HitXP Transcription of "Bol Na Halke Halke" (Chorus)
   * 90 BPM in E Minor (E E F# D E A F# E | E E F# D E A F# E | E E F# D E A | A B A G F# E)
   * Pure, plain, crystalline autotuned sine tones.
   */
  public playBolNaHalkeHalkeNotes(): number {
    if (this.isMuted) return 8000;
    const ctx = this.initContext();
    if (!ctx) return 8000;

    // Autotuned exact frequencies (Key of E Minor):
    const E4  = 329.63; // Sa
    const Fs4 = 369.99; // Re
    const G4  = 392.00; // Ga
    const A4  = 440.00; // Ma
    const B4  = 493.88; // Pa
    const D4  = 293.66; // komal Ni

    // Exact Score specified by user:
    // Line 1: Bol Na Halke Halke    -> E E F# D E A
    // Line 2: Bol Na Halke Halke    -> E E F# D E A
    // Line 3: Hooth se halke halke  -> E E F# D E A
    // Line 4: Bol na halke          -> B A G F# E
    const notes: [number, number, number][] = [
      // --- Line 1: booooool na halke halkeeeeeeeee (E E F# D E A) ---
      [620, E4, 0],    // booooool (elongated)
      [330, E4, 0],    // na
      [330, Fs4, 0],   // Hal-
      [330, D4, 0],    // ke
      [330, E4, 0],    // Hal-
      [1300, A4, 380], // halkeeeeeeeee (elongated held) + breath gap

      // --- Line 2: boooool na halkee halkeeeeeee (E E F# D E A) ---
      [600, E4, 0],    // boooool (elongated)
      [330, E4, 0],    // na
      [330, Fs4, 0],   // Hal-
      [420, D4, 0],    // kee (elongated)
      [330, E4, 0],    // Hal-
      [1300, A4, 380], // halkeeeeeee (elongated held) + breath gap

      // --- Line 3: honthhhh say-hal ke hakeeeeeee (E E F# D E A) ---
      [620, E4, 0],    // honthhhh (elongated)
      [220, E4, 0],    // say-
      [240, Fs4, 0],   // hal
      [330, D4, 0],    // ke
      [330, E4, 0],    // hal-
      [1300, A4, 380], // halkeeeeeee (elongated held) + breath gap

      // --- Line 4: booooolllll na halke halkeee (B A G F# F# E) ---
      [650, B4, 0],    // booooolllll (elongated)
      [330, A4, 0],    // na
      [380, G4, 0],    // hal-
      [330, Fs4, 0],   // ke
      [350, Fs4, 0],   // hal- (completes the second halke!)
      [1600, E4, 0],   // keee (long pure root resolution!)
    ];

    const now = ctx.currentTime + 0.05;
    let timeOffsetMs = 0;

    notes.forEach(([durMs, freq, pauseAfterMs]) => {
      const noteStart = now + timeOffsetMs / 1000.0;
      const durSec = durMs / 1000.0;
      const tailSec = Math.min(0.45, durSec * 0.5 + 0.1);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteStart);

      // Clean, pure plain tone envelope
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.linearRampToValueAtTime(0.20, noteStart + 0.015);
      if (durSec > 0.3) {
        // Sustains audible volume throughout the full elongated duration
        gain.gain.setValueAtTime(0.18, noteStart + durSec - 0.08);
      }
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + durSec + tailSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + durSec + tailSec + 0.05);

      timeOffsetMs += durMs + pauseAfterMs;
    });

    return timeOffsetMs;
  }

  public playBolNaHalkeHalke(): void {
    this.playBolNaHalkeHalkeNotes();
  }

  /**
   * Continuous gentle background loop of the procedural celesta tune
   */
  public startBolNaHalkeHalkeTuneLoop(): void {
    if (this.isTuneLooping) return;
    this.isTuneLooping = true;

    const playLoop = () => {
      if (!this.isTuneLooping) return;
      const durationMs = this.playBolNaHalkeHalkeNotes();
      this.tuneTimeoutId = setTimeout(playLoop, durationMs + 2200);
    };

    playLoop();
  }

  public stopBolNaHalkeHalkeTuneLoop(): void {
    this.isTuneLooping = false;
    if (this.tuneTimeoutId) {
      clearTimeout(this.tuneTimeoutId);
      this.tuneTimeoutId = null;
    }
  }

  public toggleTuneLoop(): boolean {
    if (this.isTuneLooping) {
      this.stopBolNaHalkeHalkeTuneLoop();
      return false;
    } else {
      this.startBolNaHalkeHalkeTuneLoop();
      return true;
    }
  }

  public isTunePlaying(): boolean {
    return this.isTuneLooping;
  }
}

export const soundEngine = new SoundEngine();

