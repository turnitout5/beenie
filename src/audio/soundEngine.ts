/**
 * Web Audio API Procedural Sound Engine & Studio MP3 Jukebox
 * Synthesizes retro chimes, clicks, stamps, and gavels via a Master GainNode architecture,
 * and manages studio MP3 playback ("Bol Na Halke Halke", "Mohabbat Jisko Bakhsh De Zindagi")
 * with zero melody clashes and instantaneous mute response.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private melodyGain: GainNode | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;
  private musicAudio: HTMLAudioElement | null = null;
  private currentSong: 'bol_na_halke_halke' | 'mohabat' | null = null;
  private isSongPlaying: boolean = false;
  private songListeners: Array<(isPlaying: boolean, song: 'bol_na_halke_halke' | 'mohabat' | null) => void> = [];
  private gardenTimer: number | null = null;
  private tuneTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isTuneLooping: boolean = false;
  private isGardenActive: boolean = false;
  private masterVolume: number = 0.8;
  private currentRoomTheme: string | null = null;
  private roomThemeInterval: ReturnType<typeof setInterval> | null = null;
  private roomThemeGain: GainNode | null = null;
  private birthdayTuneTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isBirthdayTuneLooping: boolean = false;
  private birthdayGain: GainNode | null = null;

  constructor() {
    const savedMute = localStorage.getItem('beenish_expedition_muted');
    this.isMuted = savedMute === 'true';
  }

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.melodyGain = this.ctx.createGain();
        this.melodyGain.gain.setValueAtTime(1, this.ctx.currentTime);
        this.melodyGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private getDestination(): AudioNode | null {
    const ctx = this.initContext();
    if (!ctx) return null;
    return this.masterGain || ctx.destination;
  }

  private getMelodyDestination(): AudioNode | null {
    const ctx = this.initContext();
    if (!ctx) return null;
    return this.melodyGain || this.masterGain || ctx.destination;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public setMasterVolume(vol: number): void {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    if (this.musicAudio) {
      this.musicAudio.volume = this.isMuted ? 0 : this.masterVolume * 0.8;
    }
    if (this.ctx && this.birthdayGain) {
      this.birthdayGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85 * this.masterVolume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('beenish_expedition_muted', String(this.isMuted));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    if (this.musicAudio) {
      this.musicAudio.volume = this.isMuted ? 0 : this.masterVolume * 0.8;
    }
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04 * this.masterVolume, this.ctx?.currentTime || 0);
    }
    if (this.roomThemeGain) {
      this.roomThemeGain.gain.setValueAtTime(this.isMuted ? 0 : 0.14 * this.masterVolume, this.ctx?.currentTime || 0);
    }
    if (this.birthdayGain && this.ctx) {
      this.birthdayGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85 * this.masterVolume, this.ctx.currentTime);
    }
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);
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
   * Automatically pauses procedural celesta loop to prevent audio clashes.
   */
  public playSong(song: 'bol_na_halke_halke' | 'mohabat' = 'bol_na_halke_halke'): void {
    if (typeof window === 'undefined') return;

    // Silence procedural tune loop while studio track plays
    this.stopBolNaHalkeHalkeTuneLoop();
    this.stopGardenMelody();

    const songFile = song === 'bol_na_halke_halke'
      ? './audio/bol_na_halke_halke.mp3'
      : './audio/mohabat_jisko_baksh_zindagi.mp3';

    if (this.musicAudio) {
      if (this.currentSong === song && !this.musicAudio.paused) {
        return;
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
   * Plays bike / muscle car / funny celebration horn sound
   */
  public playHorn(variant: 1 | 2 = 1): void {
    if (this.isMuted || typeof window === 'undefined') return;
    try {
      const horn = new Audio(`./audio/horn${variant}.mp3`);
      horn.volume = 0.75;
      horn.play().catch(() => {
        const unlockHorn = () => {
          if (!this.isMuted) {
            const retryHorn = new Audio(`./audio/horn${variant}.mp3`);
            retryHorn.volume = 0.75;
            retryHorn.play().catch(() => {});
          }
          window.removeEventListener('click', unlockHorn);
          window.removeEventListener('touchstart', unlockHorn);
          window.removeEventListener('keydown', unlockHorn);
        };
        window.addEventListener('click', unlockHorn, { once: true });
        window.addEventListener('touchstart', unlockHorn, { once: true });
        window.addEventListener('keydown', unlockHorn, { once: true });
      });
    } catch {
      this.playGavel();
    }
  }

  /**
   * Plays the full funny horn celebration sequence (horn1 + horn2 burst) for 00:00:00 Oct 31 unlock
   */
  public playBirthdayHornFanfare(): void {
    if (this.isMuted || typeof window === 'undefined') return;
    const hornSequence: Array<{ variant: 1 | 2; delay: number }> = [
      { variant: 1, delay: 0 },
      { variant: 1, delay: 140 },
      { variant: 2, delay: 300 },
      { variant: 1, delay: 480 },
      { variant: 2, delay: 660 },
      { variant: 1, delay: 840 },
      { variant: 1, delay: 1020 },
      { variant: 2, delay: 1220 },
      { variant: 2, delay: 1440 },
      { variant: 1, delay: 1680 },
      { variant: 2, delay: 1920 },
      { variant: 1, delay: 2160 },
      { variant: 2, delay: 2400 },
    ];

    hornSequence.forEach(({ variant, delay }) => {
      setTimeout(() => {
        if (!this.isMuted) this.playHorn(variant);
      }, delay);
    });
  }

  /**
   * Sweet sparkly kiss / heart pop sound
   */
  public playKissChime(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const dest = this.getDestination();
    if (!ctx || !dest) return;

    const now = ctx.currentTime;
    const freqs = [659.25, 830.61, 987.77, 1318.51];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.055);
      gain.gain.setValueAtTime(0.001, now + idx * 0.055);
      gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.055 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.055 + 0.35);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 0.38);
    });
  }

  /**
   * Lonely muffled clock tick for the dark pre-birthday countdown
   */
  public playSadTick(): void {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    const dest = this.getDestination();
    if (!dest) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.045);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.055);
  }

  /**
   * Delicate star recovery chime (C5 -> E5 -> G5 -> C6 arpeggio)
   */
  public playStarChime(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const dest = this.getDestination();
    if (!ctx || !dest) return;

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
      gain.connect(dest);

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
    const dest = this.getDestination();
    if (!ctx || !dest) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Bureau Rubber Stamp Thud
   */
  public playStamp(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const dest = this.getDestination();
    if (!ctx || !dest) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  /**
   * Courtroom Gavel Impact
   */
  public playGavel(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const dest = this.getDestination();
    if (!ctx || !dest) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.21);
  }

  /**
   * Paper / File folder shuffle
   */
  public playPaperRustle(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const dest = this.getDestination();
    if (!ctx || !dest) return;

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
    gain.connect(dest);

    noise.start();
  }

  /**
   * Ambient Night Soundscape (gentle breeze & soft crickets synth)
   */
  public startNightAmbience(): void {
    if (this.isAmbientPlaying || typeof window === 'undefined') return;
    const ctx = this.initContext();
    const dest = this.getDestination();
    if (!ctx || !dest) return;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, ctx.currentTime);
    this.ambientGain.connect(dest);

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
    const dest = this.getDestination();
    if (!ctx || !dest) return;

    const now = ctx.currentTime;
    [0, 0.08].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now + offset);
      osc.frequency.exponentialRampToValueAtTime(800, now + offset + 0.04);

      gain.gain.setValueAtTime(0.2, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.05);

      osc.connect(gain);
      gain.connect(dest);
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
    const dest = this.getDestination();
    if (!ctx || !dest) return;

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
      gain.connect(dest);
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
    const dest = this.getDestination();
    if (!ctx || !dest) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.25);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Serene music box arpeggios for the Secret Garden
   * Ducks the main celesta tune loop while inside the Garden to prevent clashing keys.
   */
  public startGardenMelody(): void {
    this.isGardenActive = true;
    if (this.isMuted || this.isSongPlaying || this.gardenTimer !== null || typeof window === 'undefined') return;
    const ctx = this.initContext();
    const dest = this.getDestination();
    if (!ctx || !dest) return;

    // Duck background celesta loop while inside the Secret Garden
    if (this.melodyGain) {
      this.melodyGain.gain.setValueAtTime(0, ctx.currentTime);
    }

    const melodyNotes = [
      523.25, 659.25, 783.99, 1046.50, // C chord
      493.88, 587.33, 783.99, 987.77,  // G chord
      440.00, 523.25, 659.25, 880.00,  // Am chord
      349.23, 440.00, 523.25, 698.46,  // F chord
    ];

    let noteIdx = 0;
    const playNextNote = () => {
      if (this.isMuted || this.isSongPlaying || !this.ctx || !this.masterGain) return;
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
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.3);
    };

    playNextNote();
    this.gardenTimer = window.setInterval(playNextNote, 800);
  }

  public stopGardenMelody(): void {
    this.isGardenActive = false;
    if (this.gardenTimer !== null) {
      clearInterval(this.gardenTimer);
      this.gardenTimer = null;
    }
    if (this.ctx && this.melodyGain && this.isTuneLooping && !this.isSongPlaying) {
      this.melodyGain.gain.setValueAtTime(1, this.ctx.currentTime);
    }
  }

  /**
   * Subtle surface-reactive footstep tap
   */
  public playFootstep(surface: 'grass' | 'wood' | 'stone' = 'grass'): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const dest = this.getDestination();
    if (!ctx || !dest) return;

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
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Cute retro companion emote sound
   */
  public playEmote(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const dest = this.getDestination();
    if (!ctx || !dest) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  /**
   * Procedural Happy Birthday Music Box Jingle
   */
  /**
   * Continuous celebratory music-box loop of Happy Birthday melody for Beenish
   */
  public startBirthdayTuneLoop(): void {
    if (this.isBirthdayTuneLooping) return;
    this.pauseSong();
    this.stopBolNaHalkeHalkeTuneLoop();
    this.isBirthdayTuneLooping = true;

    const ctx = this.initContext();
    if (!ctx) return;

    if (!this.birthdayGain) {
      this.birthdayGain = ctx.createGain();
      this.birthdayGain.connect(this.masterGain || ctx.destination);
    }
    const targetGain = this.isMuted ? 0 : 0.85 * this.masterVolume;
    this.birthdayGain.gain.setValueAtTime(targetGain, ctx.currentTime);

    const playLoop = () => {
      if (!this.isBirthdayTuneLooping) return;
      const durationMs = this.playFullBirthdayMelody();
      this.birthdayTuneTimeoutId = setTimeout(playLoop, durationMs + 1200);
    };

    playLoop();
  }

  public stopBirthdayTuneLoop(): void {
    this.isBirthdayTuneLooping = false;
    if (this.birthdayTuneTimeoutId) {
      clearTimeout(this.birthdayTuneTimeoutId);
      this.birthdayTuneTimeoutId = null;
    }
    if (this.ctx && this.birthdayGain) {
      this.birthdayGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  public isBirthdayTunePlaying(): boolean {
    return this.isBirthdayTuneLooping;
  }

  private playFullBirthdayMelody(): number {
    const ctx = this.initContext();
    if (!ctx || !this.birthdayGain || this.isMuted) return 12000;

    const notes: [number, number, number][] = [
      // Phrase 1: Happy birthday to you
      [392.00, 0.28, 261.63],
      [392.00, 0.28, 261.63],
      [440.00, 0.54, 261.63],
      [392.00, 0.54, 261.63],
      [523.25, 0.54, 261.63],
      [493.88, 1.10, 246.94],

      // Phrase 2: Happy birthday to you
      [392.00, 0.28, 196.00],
      [392.00, 0.28, 196.00],
      [440.00, 0.54, 196.00],
      [392.00, 0.54, 196.00],
      [587.33, 0.54, 196.00],
      [523.25, 1.10, 261.63],

      // Phrase 3: Happy birthday dear Beenish / Paaaari
      [392.00, 0.28, 261.63],
      [392.00, 0.28, 261.63],
      [783.99, 0.54, 261.63],
      [659.25, 0.54, 329.63],
      [523.25, 0.54, 261.63],
      [493.88, 0.54, 220.00],
      [440.00, 1.10, 220.00],

      // Phrase 4: Happy birthday to you!
      [698.46, 0.28, 174.61],
      [698.46, 0.28, 174.61],
      [659.25, 0.54, 261.63],
      [523.25, 0.54, 261.63],
      [587.33, 0.65, 196.00],
      [523.25, 1.40, 261.63],
    ];

    let timeOffset = ctx.currentTime + 0.05;

    notes.forEach(([freq, dur, bassFreq], idx) => {
      const osc = ctx.createOscillator();
      const oscHarmonic = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, timeOffset);

      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2, timeOffset);

      const peakGain = 0.13 * this.masterVolume;
      noteGain.gain.setValueAtTime(0.001, timeOffset);
      noteGain.gain.exponentialRampToValueAtTime(peakGain, timeOffset + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, timeOffset + dur + 0.18);

      osc.connect(noteGain);
      oscHarmonic.connect(noteGain);
      noteGain.connect(this.birthdayGain!);

      osc.start(timeOffset);
      oscHarmonic.start(timeOffset);
      osc.stop(timeOffset + dur + 0.22);
      oscHarmonic.stop(timeOffset + dur + 0.22);

      if (idx === 0 || idx === 4 || idx === 6 || idx === 10 || idx === 12 || idx === 14 || idx === 19 || idx === 21) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(bassFreq, timeOffset);
        bassGain.gain.setValueAtTime(0.001, timeOffset);
        bassGain.gain.exponentialRampToValueAtTime(0.06 * this.masterVolume, timeOffset + 0.03);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, timeOffset + dur + 0.35);
        bassOsc.connect(bassGain);
        bassGain.connect(this.birthdayGain!);
        bassOsc.start(timeOffset);
        bassOsc.stop(timeOffset + dur + 0.4);
      }

      timeOffset += dur + 0.08;
    });

    return Math.ceil((timeOffset - ctx.currentTime) * 1000);
  }

  public playBirthdayJingle(): void {
    this.playFullBirthdayMelody();
  }

  public playBlowCandles(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const dest = this.getDestination();
    if (!ctx || !dest) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  /**
   * Cheerful confetti pop sound
   */
  public playConfettiPop(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const dest = this.getDestination();
    if (!ctx || !dest) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  /**
   * Official Bollypiano & HitXP Transcription of "Bol Na Halke Halke" (Chorus)
   * 90 BPM in E Minor (E E F# D E A | E E F# D E A | E E F# D E A | B A G F# F# E)
   */
  public playBolNaHalkeHalkeNotes(): number {
    if (this.isMuted || this.isSongPlaying || this.isGardenActive) return 8000;
    const ctx = this.initContext();
    const dest = this.getMelodyDestination();
    if (!ctx || !dest) return 8000;

    const E4  = 329.63;
    const Fs4 = 369.99;
    const G4  = 392.00;
    const A4  = 440.00;
    const B4  = 493.88;
    const D4  = 293.66;

    const notes: [number, number, number][] = [
      // --- Line 1: booooool na halke halkeeeeeeeee (E E F# D E A) ---
      [620, E4, 0],
      [330, E4, 0],
      [330, Fs4, 0],
      [330, D4, 0],
      [330, E4, 0],
      [1300, A4, 380],

      // --- Line 2: boooool na halkee halkeeeeeee (E E F# D E A) ---
      [600, E4, 0],
      [330, E4, 0],
      [330, Fs4, 0],
      [420, D4, 0],
      [330, E4, 0],
      [1300, A4, 380],

      // --- Line 3: honthhhh say-hal ke hakeeeeeee (E E F# D E A) ---
      [620, E4, 0],
      [220, E4, 0],
      [240, Fs4, 0],
      [330, D4, 0],
      [330, E4, 0],
      [1300, A4, 380],

      // --- Line 4: booooolllll na halke halkeee (B A G F# F# E) ---
      [650, B4, 0],
      [330, A4, 0],
      [380, G4, 0],
      [330, Fs4, 0],
      [350, Fs4, 0],
      [1600, E4, 0],
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

      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.linearRampToValueAtTime(0.20, noteStart + 0.015);
      if (durSec > 0.3) {
        gain.gain.setValueAtTime(0.18, noteStart + durSec - 0.08);
      }
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + durSec + tailSec);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(noteStart);
      osc.stop(noteStart + durSec + tailSec + 0.05);

      timeOffsetMs += durMs + pauseAfterMs;
    });

    return timeOffsetMs;
  }

  public playBolNaHalkeHalke(): void {
    if (!this.isTuneLooping) {
      this.playBolNaHalkeHalkeNotes();
    } else {
      this.playStarChime();
    }
  }

  /**
   * Continuous gentle background loop of the procedural celesta tune
   */
  public startBolNaHalkeHalkeTuneLoop(): void {
    if (this.isTuneLooping) return;
    this.pauseSong();
    this.isTuneLooping = true;

    if (this.ctx && this.melodyGain && !this.isGardenActive) {
      this.melodyGain.gain.setValueAtTime(1, this.ctx.currentTime);
    }

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
    if (this.ctx && this.melodyGain) {
      this.melodyGain.gain.setValueAtTime(0, this.ctx.currentTime);
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

  public stopRoomTheme(): void {
    if (this.roomThemeInterval) {
      clearInterval(this.roomThemeInterval);
      this.roomThemeInterval = null;
    }
    if (this.ctx && this.roomThemeGain) {
      this.roomThemeGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
    }
    this.currentRoomTheme = null;
  }

  public setRoomTheme(roomId: string): void {
    if (this.currentRoomTheme === roomId) return;
    this.stopRoomTheme();
    this.currentRoomTheme = roomId;

    const ctx = this.initContext();
    const dest = this.getDestination();
    if (!ctx || !dest) return;

    if (!this.roomThemeGain) {
      this.roomThemeGain = ctx.createGain();
      this.roomThemeGain.connect(dest);
    }
    const targetGain = this.isMuted ? 0 : 0.14 * this.masterVolume;
    this.roomThemeGain.gain.setValueAtTime(0, ctx.currentTime);
    this.roomThemeGain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.4);

    if (roomId === 'mafia_realm') {
      let beat = 0;
      const playBatmanBeat = () => {
        if (this.currentRoomTheme !== 'mafia_realm' || !this.ctx || !this.roomThemeGain) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        const freqs = [55, 49, 58, 43.6];
        osc.frequency.setValueAtTime(freqs[beat % freqs.length], now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(160, now);
        filter.frequency.exponentialRampToValueAtTime(70, now + 1.2);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.roomThemeGain);

        osc.start(now);
        osc.stop(now + 1.5);
        beat++;
      };
      playBatmanBeat();
      this.roomThemeInterval = setInterval(playBatmanBeat, 1600);
    } else if (roomId === 'haveli_realm') {
      let folkStep = 0;
      const folkScale = [293.66, 329.63, 369.99, 392.00, 440.00, 493.88];
      const playDesiBeat = () => {
        if (this.currentRoomTheme !== 'haveli_realm' || !this.ctx || !this.roomThemeGain) return;
        const now = this.ctx.currentTime;
        const isThump = folkStep % 2 === 0;

        if (isThump) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(65, now + 0.12);
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.connect(gain);
          gain.connect(this.roomThemeGain);
          osc.start(now);
          osc.stop(now + 0.2);
        }

        const melodyOsc = this.ctx.createOscillator();
        const melodyGain = this.ctx.createGain();
        melodyOsc.type = 'triangle';
        const note = folkScale[(folkStep * 2 + (folkStep % 3)) % folkScale.length];
        melodyOsc.frequency.setValueAtTime(note, now);
        melodyGain.gain.setValueAtTime(0.12, now);
        melodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        melodyOsc.connect(melodyGain);
        melodyGain.connect(this.roomThemeGain);
        melodyOsc.start(now);
        melodyOsc.stop(now + 0.24);

        folkStep++;
      };
      playDesiBeat();
      this.roomThemeInterval = setInterval(playDesiBeat, 320);
    } else if (roomId === 'bakery_realm') {
      let waltzBeat = 0;
      const playWaltz = () => {
        if (this.currentRoomTheme !== 'bakery_realm' || !this.ctx || !this.roomThemeGain) return;
        const now = this.ctx.currentTime;
        const step = waltzBeat % 3;

        if (step === 0) {
          const bass = this.ctx.createOscillator();
          const bg = this.ctx.createGain();
          bass.type = 'triangle';
          bass.frequency.setValueAtTime(174.61, now);
          bg.gain.setValueAtTime(0.2, now);
          bg.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          bass.connect(bg);
          bg.connect(this.roomThemeGain);
          bass.start(now);
          bass.stop(now + 0.38);
        } else {
          [220.00, 261.63].forEach((f, idx) => {
            if (!this.ctx || !this.roomThemeGain) return;
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f + (idx * 0.8), now);
            g.gain.setValueAtTime(0.1, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
            osc.connect(g);
            g.connect(this.roomThemeGain);
            osc.start(now);
            osc.stop(now + 0.3);
          });
        }
        waltzBeat++;
      };
      playWaltz();
      this.roomThemeInterval = setInterval(playWaltz, 440);
    } else if (roomId === 'castle_realm') {
      const harpNotes = [523.25, 659.25, 783.99, 880.00, 1046.50];
      const playHarpSweep = () => {
        if (this.currentRoomTheme !== 'castle_realm' || !this.ctx || !this.roomThemeGain) return;
        const now = this.ctx.currentTime;
        harpNotes.forEach((f, idx) => {
          if (!this.ctx || !this.roomThemeGain) return;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + idx * 0.08);
          g.gain.setValueAtTime(0.14, now + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);
          osc.connect(g);
          g.connect(this.roomThemeGain);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.5);
        });
      };
      playHarpSweep();
      this.roomThemeInterval = setInterval(playHarpSweep, 2800);
    } else if (roomId === 'islamabad_realm') {
      const chords = [
        [174.61, 220.00, 261.63, 329.63],
        [164.81, 196.00, 246.94, 293.66],
        [146.83, 174.61, 220.00, 261.63],
        [130.81, 164.81, 196.00, 246.94],
      ];
      let chordIdx = 0;
      const playLofiChord = () => {
        if (this.currentRoomTheme !== 'islamabad_realm' || !this.ctx || !this.roomThemeGain) return;
        const now = this.ctx.currentTime;
        const currentChord = chords[chordIdx % chords.length];
        currentChord.forEach((f) => {
          if (!this.ctx || !this.roomThemeGain) return;
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);
          g.gain.setValueAtTime(0.08, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
          osc.connect(g);
          g.connect(this.roomThemeGain);
          osc.start(now);
          osc.stop(now + 1.9);
        });
        chordIdx++;
      };
      playLofiChord();
      this.roomThemeInterval = setInterval(playLofiChord, 2200);
    } else if (roomId === 'garden') {
      this.startGardenMelody();
    } else if (roomId === 'overworld' || roomId === 'hub') {
      this.startNightAmbience();
    }
  }
}

export const soundEngine = new SoundEngine();
