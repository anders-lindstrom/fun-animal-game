// Game state management with localStorage persistence

export type Difficulty = 'easy' | 'medium' | 'hard' | 'grownup';

interface GameState {
  difficulty: Difficulty;
  soundEnabled: boolean;
  collectedAnimals: string[];
  totalStars: number;
  gamesCompleted: {
    trace: number;
    match: number;
    path: number;
  };
}

const STORAGE_KEY = 'animal-fun-state';

const defaultState: GameState = {
  difficulty: 'easy',
  soundEnabled: true,
  collectedAnimals: [],
  totalStars: 0,
  gamesCompleted: {
    trace: 0,
    match: 0,
    path: 0,
  },
};

let state: GameState = { ...defaultState };

// Load state from localStorage
export function loadState(): void {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      state = { ...defaultState, ...JSON.parse(saved) };
    }
  } catch {
    state = { ...defaultState };
  }
}

// Save state to localStorage
function saveState(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage might be full or disabled
  }
}

// Getters
export function getDifficulty(): Difficulty {
  return state.difficulty;
}

export function isSoundEnabled(): boolean {
  return state.soundEnabled;
}

export function getCollectedAnimals(): string[] {
  return [...state.collectedAnimals];
}

export function getTotalStars(): number {
  return state.totalStars;
}

export function getGamesCompleted(game: 'trace' | 'match' | 'path'): number {
  return state.gamesCompleted[game];
}

// Setters
export function setDifficulty(difficulty: Difficulty): void {
  state.difficulty = difficulty;
  saveState();
}

export function setSoundEnabled(enabled: boolean): void {
  state.soundEnabled = enabled;
  saveState();
}

export function collectAnimal(emoji: string): void {
  if (!state.collectedAnimals.includes(emoji)) {
    state.collectedAnimals.push(emoji);
    saveState();
  }
}

export function addStars(count: number): void {
  state.totalStars += count;
  saveState();
}

export function completeGame(game: 'trace' | 'match' | 'path'): void {
  state.gamesCompleted[game]++;
  saveState();
}

// Difficulty settings for each game
export interface DifficultySettings {
  // Trace game
  tracePointSize: number;
  traceLineWidth: number;
  traceSnapDistance: number;

  // Match game
  matchPairs: number;
  matchCardSize: number;

  // Path game
  pathWidth: number;
  pathSnapDistance: number;
  animalSpeed: number;
}

export function getDifficultySettings(): DifficultySettings {
  switch (state.difficulty) {
    case 'easy':
      return {
        tracePointSize: 20,
        traceLineWidth: 14,
        traceSnapDistance: 45,
        matchPairs: 3,
        matchCardSize: 140,
        pathWidth: 40,
        pathSnapDistance: 70,
        animalSpeed: 1.5,
      };
    case 'medium':
      return {
        tracePointSize: 15,
        traceLineWidth: 10,
        traceSnapDistance: 35,
        matchPairs: 4,
        matchCardSize: 120,
        pathWidth: 30,
        pathSnapDistance: 55,
        animalSpeed: 1.2,
      };
    case 'hard':
      return {
        tracePointSize: 12,
        traceLineWidth: 8,
        traceSnapDistance: 25,
        matchPairs: 6,
        matchCardSize: 100,
        pathWidth: 25,
        pathSnapDistance: 40,
        animalSpeed: 1.0,
      };
    case 'grownup':
      return {
        tracePointSize: 5,
        traceLineWidth: 3,
        traceSnapDistance: 10,
        matchPairs: 12,
        matchCardSize: 60,
        pathWidth: 10,
        pathSnapDistance: 15,
        animalSpeed: 0.7,
      };
  }
}

// Initialize
loadState();
