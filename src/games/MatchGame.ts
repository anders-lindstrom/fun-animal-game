// Connect the Pairs Game
// Kids tap two matching animals to connect them

import { playClick, playMatch, playSuccess, playTryAgain, playEncouragement } from '../utils/audio';
import { showCelebration, showStars } from '../components/Celebration';
import { getDifficultySettings, collectAnimal, addStars, completeGame } from '../utils/state';

interface Card {
  id: number;
  emoji: string;
  matched: boolean;
}

const ALL_ANIMALS = [
  '🐱', '🐶', '🐰', '🦁', '🐘', '🐵',
  '🐟', '🐙', '🦀', '🦋', '🐝', '🐞',
  '🐸', '🐢', '🦎', '🐼', '🦊', '🐨',
  '🐷', '🐮', '🐔', '🦆', '🦉', '🐧',
];

export function createMatchGame(onBack: () => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'game-container fade-enter';

  let levelNum = 0;
  let cards: Card[] = [];
  let selectedCard: Card | null = null;
  let matchedCount = 0;
  let canSelect = true;
  let earnedStars = 0;

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function initCards(): void {
    const settings = getDifficultySettings();
    const numPairs = settings.matchPairs;

    // Pick random animals for this level
    const shuffledAnimals = shuffleArray(ALL_ANIMALS);
    const selectedAnimals = shuffledAnimals.slice(0, numPairs);

    // Create pairs
    const allEmojis = [...selectedAnimals, ...selectedAnimals];
    const shuffled = shuffleArray(allEmojis);

    cards = shuffled.map((emoji, i) => ({
      id: i,
      emoji,
      matched: false
    }));

    selectedCard = null;
    matchedCount = 0;
    canSelect = true;
  }

  function render(): void {
    container.innerHTML = '';

    const settings = getDifficultySettings();

    // Header
    const header = document.createElement('div');
    header.className = 'game-header';

    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.textContent = '←';
    backBtn.onclick = () => {
      playClick();
      onBack();
    };
    header.appendChild(backBtn);

    const title = document.createElement('div');
    title.className = 'game-title';
    title.textContent = 'Find the Pairs!';
    header.appendChild(title);

    const stars = document.createElement('div');
    stars.className = 'stars';
    stars.textContent = '⭐'.repeat(earnedStars);
    header.appendChild(stars);

    container.appendChild(header);

    // Instruction
    const instruction = document.createElement('div');
    instruction.className = 'instruction';
    instruction.textContent = '👆 Tap two matching animals!';
    container.appendChild(instruction);

    // Game area
    const gameArea = document.createElement('div');
    gameArea.className = 'game-area';

    const grid = document.createElement('div');
    grid.className = 'match-grid';

    // Adjust grid columns based on card count
    const numPairs = settings.matchPairs;
    if (numPairs <= 2) {
      grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else if (numPairs <= 3) {
      grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else {
      grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    }

    cards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'match-card';
      cardEl.style.width = `${settings.matchCardSize}px`;
      cardEl.style.height = `${settings.matchCardSize}px`;
      cardEl.style.fontSize = `${settings.matchCardSize * 0.45}px`;

      if (card.matched) {
        cardEl.classList.add('matched');
      }
      if (selectedCard?.id === card.id) {
        cardEl.classList.add('selected');
      }
      cardEl.textContent = card.emoji;

      cardEl.onclick = () => handleCardClick(card, cardEl);

      grid.appendChild(cardEl);
    });

    gameArea.appendChild(grid);
    container.appendChild(gameArea);
  }

  function handleCardClick(card: Card, element: HTMLElement): void {
    if (!canSelect || card.matched) return;

    playClick();

    if (selectedCard === null) {
      // First card selected
      selectedCard = card;
      render();
    } else if (selectedCard.id === card.id) {
      // Same card clicked, deselect
      selectedCard = null;
      render();
    } else {
      // Second card selected
      canSelect = false;

      if (selectedCard.emoji === card.emoji) {
        // Match found!
        playMatch();
        selectedCard.matched = true;
        card.matched = true;
        matchedCount += 2;

        // Collect this animal!
        collectAnimal(card.emoji);

        const rect = element.getBoundingClientRect();
        showStars(rect.left + rect.width / 2, rect.top + rect.height / 2);

        // Show animal being collected
        showAnimalCollect(card.emoji, rect.left + rect.width / 2, rect.top + rect.height / 2);

        selectedCard = null;
        canSelect = true;
        render();

        // Check if all matched
        if (matchedCount >= cards.length) {
          setTimeout(() => {
            playSuccess();
            playEncouragement();
            showCelebration();
            earnedStars++;
            addStars(1);
            completeGame('match');

            setTimeout(() => {
              levelNum++;
              initCards();
              render();
            }, 2000);
          }, 300);
        }
      } else {
        // No match
        playTryAgain();
        render();

        // Show both cards briefly, then hide selection
        setTimeout(() => {
          selectedCard = null;
          canSelect = true;
          render();
        }, 800);
      }
    }
  }

  function showAnimalCollect(emoji: string, x: number, y: number): void {
    const el = document.createElement('div');
    el.className = 'animal-collect';
    el.textContent = emoji;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 1000);
  }

  initCards();
  render();
  return container;
}
