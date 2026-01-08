// Simple audio manager using Web Audio API
// Creates fun sounds without needing external files

import { isSoundEnabled } from './state';

let audioContext: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

// Resume audio context on first user interaction (required by browsers)
export function initAudio(): void {
  document.addEventListener('touchstart', () => {
    if (audioContext?.state === 'suspended') {
      audioContext.resume();
    }
  }, { once: true });

  document.addEventListener('click', () => {
    if (audioContext?.state === 'suspended') {
      audioContext.resume();
    }
  }, { once: true });
}

// Play a happy "pop" sound
export function playPop(): void {
  if (!isSoundEnabled()) return;
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
}

// Play a success fanfare
export function playSuccess(): void {
  if (!isSoundEnabled()) return;
  const ctx = getContext();
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.type = 'triangle';

    const startTime = ctx.currentTime + i * 0.1;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

    osc.start(startTime);
    osc.stop(startTime + 0.3);
  });
}

// Play drawing sound
export function playDraw(): void {
  if (!isSoundEnabled()) return;
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(300 + Math.random() * 200, ctx.currentTime);
  osc.type = 'sine';

  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
}

// Play match sound
export function playMatch(): void {
  if (!isSoundEnabled()) return;
  const ctx = getContext();

  // Play two notes together for a happy chord
  [523, 659].forEach(freq => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.type = 'triangle';

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  });
}

// Play wrong/try again sound (gentle)
export function playTryAgain(): void {
  if (!isSoundEnabled()) return;
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.2);
  osc.type = 'sine';

  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}

// Play click sound
export function playClick(): void {
  if (!isSoundEnabled()) return;
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.type = 'square';

  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.05);
}

// ===== ANIMAL SOUNDS =====
// Each animal has a distinctive synthesized sound

function playCatMeow(): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  // Descending meow with slight wobble
  osc.frequency.setValueAtTime(700, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);
  osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.4);
  osc.type = 'sine';

  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.45);
}

function playDogWoof(): void {
  const ctx = getContext();
  // Two oscillators for richer bark
  [180, 360].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, ctx.currentTime + 0.15);
    osc.type = 'sawtooth';

    gain.gain.setValueAtTime(i === 0 ? 0.2 : 0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  });
}

function playCowMoo(): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  // Low sustained moo
  osc.frequency.setValueAtTime(120, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.3);
  osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.6);
  osc.type = 'sine';

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.setValueAtTime(0.2, ctx.currentTime + 0.4);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.65);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.65);
}

function playPigOink(): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  // Quick snorty oink
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.08);
  osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.18);
  osc.type = 'sawtooth';

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}

function playFrogRibbit(): void {
  const ctx = getContext();
  // Two-part ribbit
  [0, 0.15].forEach((delay) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const startTime = ctx.currentTime + delay;
    osc.frequency.setValueAtTime(250, startTime);
    osc.frequency.exponentialRampToValueAtTime(180, startTime + 0.1);
    osc.type = 'square';

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);

    osc.start(startTime);
    osc.stop(startTime + 0.12);
  });
}

function playLionRoar(): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  // Deep rumbling roar
  osc.frequency.setValueAtTime(100, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.5);
  osc.type = 'sawtooth';

  // Amplitude modulation for growl effect
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.setValueAtTime(0.2, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.12, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.18, ctx.currentTime + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.55);
}

function playBirdChirp(): void {
  const ctx = getContext();
  // Quick high chirps
  [0, 0.1, 0.18].forEach((delay) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const startTime = ctx.currentTime + delay;
    const baseFreq = 1800 + Math.random() * 400;
    osc.frequency.setValueAtTime(baseFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, startTime + 0.04);
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.06);

    osc.start(startTime);
    osc.stop(startTime + 0.06);
  });
}

function playDuckQuack(): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  // Nasal quack
  osc.frequency.setValueAtTime(350, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.15);
  osc.type = 'sawtooth';

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.18);
}

function playMonkeyOoh(): void {
  const ctx = getContext();
  // Rising "ooh ooh" sound
  [0, 0.2].forEach((delay) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const startTime = ctx.currentTime + delay;
    osc.frequency.setValueAtTime(400, startTime);
    osc.frequency.exponentialRampToValueAtTime(600, startTime + 0.12);
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

    osc.start(startTime);
    osc.stop(startTime + 0.15);
  });
}

function playElephantTrumpet(): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  // Trumpet call - rising then falling
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.2);
  osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.5);
  osc.type = 'sawtooth';

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.setValueAtTime(0.25, ctx.currentTime + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.55);
}

function playBeeeBuzz(): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  // Buzzing sound
  osc.frequency.setValueAtTime(180, ctx.currentTime);
  osc.type = 'sawtooth';

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.setValueAtTime(0.1, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.06, ctx.currentTime + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.35);
}

function playMouseSqueak(): void {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  // High tiny squeak
  osc.frequency.setValueAtTime(2000, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(2500, ctx.currentTime + 0.08);
  osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.15);
  osc.type = 'sine';

  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.18);
}

function playOwlHoot(): void {
  const ctx = getContext();
  // Two-tone hoot
  [0, 0.3].forEach((delay, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const startTime = ctx.currentTime + delay;
    const freq = i === 0 ? 350 : 280;
    osc.frequency.setValueAtTime(freq, startTime);
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

    osc.start(startTime);
    osc.stop(startTime + 0.25);
  });
}

function playSnakeHiss(): void {
  const ctx = getContext();
  // White noise for hissing
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 3000;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 0.4);
}

function playFishBlub(): void {
  const ctx = getContext();
  // Bubbly blub sounds
  [0, 0.1, 0.18].forEach((delay) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const startTime = ctx.currentTime + delay;
    const freq = 200 + Math.random() * 100;
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + 0.06);
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);

    osc.start(startTime);
    osc.stop(startTime + 0.08);
  });
}

function playChickenCluck(): void {
  const ctx = getContext();
  // Quick clucking sound
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
  osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.1);
  osc.type = 'triangle';

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.12);
}

// Animal sound mapping - maps emoji to sound function
const ANIMAL_SOUNDS: Record<string, () => void> = {
  '🐱': playCatMeow,
  '🐶': playDogWoof,
  '🐮': playCowMoo,
  '🐷': playPigOink,
  '🐸': playFrogRibbit,
  '🦁': playLionRoar,
  '🐦': playBirdChirp,
  '🐤': playBirdChirp,
  '🐥': playBirdChirp,
  '🦆': playDuckQuack,
  '🐵': playMonkeyOoh,
  '🐒': playMonkeyOoh,
  '🐘': playElephantTrumpet,
  '🐝': playBeeeBuzz,
  '🐭': playMouseSqueak,
  '🦉': playOwlHoot,
  '🐍': playSnakeHiss,
  '🐟': playFishBlub,
  '🐠': playFishBlub,
  '🐔': playChickenCluck,
  '🐓': playChickenCluck,
  // Additional mappings for similar animals
  '🐰': playMouseSqueak, // bunny - similar squeak
  '🐹': playMouseSqueak, // hamster
  '🐺': playDogWoof, // wolf
  '🦊': playDogWoof, // fox - similar bark
  '🐻': playLionRoar, // bear - deep growl
  '🐼': playMonkeyOoh, // panda
  '🐨': playMonkeyOoh, // koala
  '🐯': playLionRoar, // tiger
  '🦋': playBeeeBuzz, // butterfly - gentle buzz
  '🐢': playFishBlub, // turtle
  '🐙': playFishBlub, // octopus
  '🦀': playFishBlub, // crab
  '🐬': playFishBlub, // dolphin
  '🦈': playFishBlub, // shark
  '🐧': playBirdChirp, // penguin
  '🦜': playBirdChirp, // parrot
  '🦅': playBirdChirp, // eagle
  '🐊': playFrogRibbit, // crocodile
  '🦎': playFrogRibbit, // lizard
  '🐴': playDogWoof, // horse (simplified)
  '🦄': playDogWoof, // unicorn
  '🐲': playLionRoar, // dragon
  '🦚': playBirdChirp, // peacock
  '🦩': playBirdChirp, // flamingo
  '🐞': playBeeeBuzz, // ladybug
  '🐌': playFishBlub, // snail
};

// Play sound for an animal emoji
export function playAnimalSound(emoji: string): void {
  if (!isSoundEnabled()) return;
  const soundFn = ANIMAL_SOUNDS[emoji];
  if (soundFn) {
    soundFn();
  } else {
    // Fallback for unknown animals
    playPop();
  }
}

// ===== ENCOURAGEMENT FANFARES =====
// Played on level completion for extra celebration

function playAscendingChime(): void {
  const ctx = getContext();
  const notes = [523, 659, 784, 1047, 1319]; // C5, E5, G5, C6, E6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.type = 'sine';

    const startTime = ctx.currentTime + i * 0.08;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

    osc.start(startTime);
    osc.stop(startTime + 0.35);
  });
}

function playVictoryFanfare(): void {
  const ctx = getContext();
  // G major arpeggio
  const arpeggio = [392, 494, 587, 784]; // G4, B4, D5, G5
  arpeggio.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.type = 'triangle';

    const startTime = ctx.currentTime + i * 0.1;
    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.45);

    osc.start(startTime);
    osc.stop(startTime + 0.45);
  });
}

function playSparkleSound(): void {
  const ctx = getContext();
  // High twinkling notes
  for (let i = 0; i < 8; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(1500 + Math.random() * 1000, ctx.currentTime);
    osc.type = 'sine';

    const startTime = ctx.currentTime + i * 0.05;
    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);

    osc.start(startTime);
    osc.stop(startTime + 0.12);
  }
}

function playTriumphChord(): void {
  const ctx = getContext();
  // Full C major chord
  [262, 330, 392, 523].forEach(freq => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.type = 'triangle';

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.7);
  });
}

// Array of encouragement fanfares
const ENCOURAGEMENTS = [
  playAscendingChime,
  playVictoryFanfare,
  playSparkleSound,
  playTriumphChord,
];

// Play a random encouragement fanfare
export function playEncouragement(): void {
  if (!isSoundEnabled()) return;
  const randomFanfare = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
  randomFanfare();
}
