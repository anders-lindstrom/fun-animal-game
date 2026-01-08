// Home menu with game buttons, difficulty selector, and settings

import { playClick, playAnimalSound } from '../utils/audio';
import {
  getDifficulty,
  setDifficulty,
  isSoundEnabled,
  setSoundEnabled,
  getCollectedAnimals,
  getTotalStars,
  Difficulty,
} from '../utils/state';

export type GameType = 'trace' | 'match' | 'path' | 'freedraw' | 'habitat';

export function createMenu(onSelectGame: (game: GameType) => void): HTMLElement {
  const menu = document.createElement('div');
  menu.className = 'menu';

  // Top bar with settings and stars
  const topBar = document.createElement('div');
  topBar.className = 'menu-top-bar';

  // Settings button
  const settingsBtn = document.createElement('button');
  settingsBtn.className = 'settings-btn';
  settingsBtn.innerHTML = '⚙️';
  settingsBtn.onclick = () => {
    playClick();
    showSettingsModal(menu);
  };
  topBar.appendChild(settingsBtn);

  // Stars display
  const starsDisplay = document.createElement('div');
  starsDisplay.className = 'stars-display';
  starsDisplay.innerHTML = `⭐ ${getTotalStars()}`;
  topBar.appendChild(starsDisplay);

  menu.appendChild(topBar);

  // Title with bouncing emoji
  const title = document.createElement('h1');
  title.className = 'menu-title';
  title.textContent = '🦁 Animal Fun! 🐘';
  menu.appendChild(title);

  // Difficulty selector
  const difficultySection = document.createElement('div');
  difficultySection.className = 'difficulty-section';

  const diffLabel = document.createElement('div');
  diffLabel.className = 'difficulty-label';
  diffLabel.textContent = 'How hard?';
  difficultySection.appendChild(diffLabel);

  const diffButtons = document.createElement('div');
  diffButtons.className = 'difficulty-buttons';

  const difficulties: { value: Difficulty; emoji: string; label: string }[] = [
    { value: 'easy', emoji: '😊', label: 'Easy' },
    { value: 'medium', emoji: '😄', label: 'Medium' },
    { value: 'hard', emoji: '😎', label: 'Hard' },
    { value: 'grownup', emoji: '🧠', label: 'Grown-up' },
  ];

  difficulties.forEach(({ value, emoji, label }) => {
    const btn = document.createElement('button');
    btn.className = `diff-btn ${getDifficulty() === value ? 'active' : ''}`;
    btn.innerHTML = `<span class="diff-emoji">${emoji}</span><span class="diff-label">${label}</span>`;
    btn.onclick = () => {
      playClick();
      setDifficulty(value);
      // Update active state
      diffButtons.querySelectorAll('.diff-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    };
    diffButtons.appendChild(btn);
  });

  difficultySection.appendChild(diffButtons);
  menu.appendChild(difficultySection);

  // Game buttons container
  const buttons = document.createElement('div');
  buttons.className = 'menu-buttons';

  // Trace button
  const traceBtn = createButton('btn-trace', '✏️', 'Draw!', () => {
    playClick();
    onSelectGame('trace');
  });
  buttons.appendChild(traceBtn);

  // Match button
  const matchBtn = createButton('btn-match', '🎯', 'Match!', () => {
    playClick();
    onSelectGame('match');
  });
  buttons.appendChild(matchBtn);

  // Path button
  const pathBtn = createButton('btn-path', '🏠', 'Help!', () => {
    playClick();
    onSelectGame('path');
  });
  buttons.appendChild(pathBtn);

  // Free Draw button
  const drawBtn = createButton('btn-freedraw', '🎨', 'Create!', () => {
    playClick();
    onSelectGame('freedraw');
  });
  buttons.appendChild(drawBtn);

  menu.appendChild(buttons);

  // Collected animals section
  const collected = getCollectedAnimals();
  if (collected.length > 0) {
    const collectedSection = document.createElement('div');
    collectedSection.className = 'collected-section';

    const collectedHeader = document.createElement('div');
    collectedHeader.className = 'collected-header';

    const collectedLabel = document.createElement('div');
    collectedLabel.className = 'collected-label';
    collectedLabel.textContent = `My Collection (${collected.length}):`;
    collectedHeader.appendChild(collectedLabel);

    // Visit habitat button
    const habitatBtn = document.createElement('button');
    habitatBtn.className = 'habitat-btn';
    habitatBtn.textContent = '🏡 Visit';
    habitatBtn.onclick = (e) => {
      e.stopPropagation();
      playClick();
      onSelectGame('habitat');
    };
    collectedHeader.appendChild(habitatBtn);

    collectedSection.appendChild(collectedHeader);

    // Tappable animal grid
    const collectedAnimals = document.createElement('div');
    collectedAnimals.className = 'collected-animals';

    collected.forEach((emoji) => {
      const animalBtn = document.createElement('button');
      animalBtn.className = 'animal-btn';
      animalBtn.textContent = emoji;
      animalBtn.onclick = (e) => {
        e.stopPropagation();
        playAnimalSound(emoji);
        // Add bounce animation
        animalBtn.classList.add('bounce');
        setTimeout(() => animalBtn.classList.remove('bounce'), 300);
      };
      collectedAnimals.appendChild(animalBtn);
    });

    collectedSection.appendChild(collectedAnimals);

    // Hint to visit habitat
    const hint = document.createElement('div');
    hint.className = 'collected-hint';
    hint.textContent = '👆 Tap animals to hear them!';
    collectedSection.appendChild(hint);

    menu.appendChild(collectedSection);
  }

  return menu;
}

function createButton(
  className: string,
  emoji: string,
  label: string,
  onClick: () => void
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = `menu-btn ${className}`;

  const emojiSpan = document.createElement('div');
  emojiSpan.textContent = emoji;
  btn.appendChild(emojiSpan);

  const labelSpan = document.createElement('span');
  labelSpan.textContent = label;
  btn.appendChild(labelSpan);

  btn.addEventListener('click', onClick);
  btn.addEventListener('touchend', (e) => {
    e.preventDefault();
    onClick();
  });

  return btn;
}

function showSettingsModal(menuElement: HTMLElement): void {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'settings-modal';

  // Title
  const title = document.createElement('h2');
  title.className = 'modal-title';
  title.textContent = '⚙️ Settings';
  modal.appendChild(title);

  // Sound toggle
  const soundRow = document.createElement('div');
  soundRow.className = 'settings-row';

  const soundLabel = document.createElement('span');
  soundLabel.textContent = '🔊 Sounds';
  soundRow.appendChild(soundLabel);

  const soundToggle = document.createElement('button');
  soundToggle.className = `toggle-btn ${isSoundEnabled() ? 'on' : 'off'}`;
  soundToggle.textContent = isSoundEnabled() ? 'ON' : 'OFF';
  soundToggle.onclick = () => {
    const newState = !isSoundEnabled();
    setSoundEnabled(newState);
    soundToggle.className = `toggle-btn ${newState ? 'on' : 'off'}`;
    soundToggle.textContent = newState ? 'ON' : 'OFF';
    if (newState) playClick();
  };
  soundRow.appendChild(soundToggle);

  modal.appendChild(soundRow);

  // Fullscreen toggle
  const fullscreenRow = document.createElement('div');
  fullscreenRow.className = 'settings-row';

  const fullscreenLabel = document.createElement('span');
  fullscreenLabel.textContent = '📺 Fullscreen';
  fullscreenRow.appendChild(fullscreenLabel);

  const fullscreenBtn = document.createElement('button');
  fullscreenBtn.className = 'toggle-btn';
  fullscreenBtn.textContent = document.fullscreenElement ? 'EXIT' : 'GO';
  fullscreenBtn.onclick = () => {
    playClick();
    if (document.fullscreenElement) {
      document.exitFullscreen();
      fullscreenBtn.textContent = 'GO';
    } else {
      document.documentElement.requestFullscreen();
      fullscreenBtn.textContent = 'EXIT';
    }
  };
  fullscreenRow.appendChild(fullscreenBtn);

  modal.appendChild(fullscreenRow);

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close-btn';
  closeBtn.textContent = '✓ Done';
  closeBtn.onclick = () => {
    playClick();
    overlay.remove();
  };
  modal.appendChild(closeBtn);

  overlay.appendChild(modal);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      playClick();
      overlay.remove();
    }
  });

  menuElement.appendChild(overlay);
}
