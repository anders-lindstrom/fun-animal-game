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
