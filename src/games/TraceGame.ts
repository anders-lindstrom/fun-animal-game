// Trace the Animal Game
// Kids trace dotted animal outlines with their finger

import { playDraw, playSuccess, playClick, playPop, playEncouragement } from '../utils/audio';
import { showCelebration } from '../components/Celebration';
import { getDifficultySettings, collectAnimal, addStars, completeGame } from '../utils/state';

interface Point {
  x: number;
  y: number;
}

interface AnimalShape {
  name: string;
  emoji: string;
  points: Point[];
  difficulty: 'easy' | 'medium' | 'hard' | 'grownup';
}

// Shapes organized by difficulty - animals, objects, and letters
const ANIMALS: AnimalShape[] = [
  // ===== EASY SHAPES =====
  // Simple animals
  { name: 'Mouse', emoji: '🐭', difficulty: 'easy', points: [
    { x: 0.3, y: 0.35 }, { x: 0.4, y: 0.45 }, { x: 0.5, y: 0.35 }, { x: 0.6, y: 0.45 },
    { x: 0.7, y: 0.35 }, { x: 0.65, y: 0.55 }, { x: 0.5, y: 0.65 }, { x: 0.35, y: 0.55 }, { x: 0.3, y: 0.35 },
  ]},
  { name: 'Pig', emoji: '🐷', difficulty: 'easy', points: [
    { x: 0.25, y: 0.4 }, { x: 0.35, y: 0.25 }, { x: 0.5, y: 0.3 }, { x: 0.65, y: 0.25 },
    { x: 0.75, y: 0.4 }, { x: 0.75, y: 0.6 }, { x: 0.5, y: 0.75 }, { x: 0.25, y: 0.6 }, { x: 0.25, y: 0.4 },
  ]},
  { name: 'Chick', emoji: '🐥', difficulty: 'easy', points: [
    { x: 0.5, y: 0.2 }, { x: 0.7, y: 0.35 }, { x: 0.75, y: 0.55 }, { x: 0.6, y: 0.75 },
    { x: 0.4, y: 0.75 }, { x: 0.25, y: 0.55 }, { x: 0.3, y: 0.35 }, { x: 0.5, y: 0.2 },
  ]},
  { name: 'Apple', emoji: '🍎', difficulty: 'easy', points: [
    { x: 0.5, y: 0.2 }, { x: 0.5, y: 0.3 }, { x: 0.7, y: 0.35 }, { x: 0.8, y: 0.55 },
    { x: 0.65, y: 0.8 }, { x: 0.35, y: 0.8 }, { x: 0.2, y: 0.55 }, { x: 0.3, y: 0.35 }, { x: 0.5, y: 0.3 },
  ]},
  { name: 'Frog', emoji: '🐸', difficulty: 'easy', points: [
    { x: 0.2, y: 0.4 }, { x: 0.3, y: 0.25 }, { x: 0.4, y: 0.35 }, { x: 0.5, y: 0.3 },
    { x: 0.6, y: 0.35 }, { x: 0.7, y: 0.25 }, { x: 0.8, y: 0.4 }, { x: 0.75, y: 0.65 },
    { x: 0.5, y: 0.75 }, { x: 0.25, y: 0.65 }, { x: 0.2, y: 0.4 },
  ]},
  { name: 'Snail', emoji: '🐌', difficulty: 'easy', points: [
    { x: 0.15, y: 0.6 }, { x: 0.3, y: 0.55 }, { x: 0.4, y: 0.4 }, { x: 0.55, y: 0.3 },
    { x: 0.7, y: 0.35 }, { x: 0.8, y: 0.5 }, { x: 0.7, y: 0.65 }, { x: 0.5, y: 0.7 },
    { x: 0.3, y: 0.65 }, { x: 0.15, y: 0.6 },
  ]},
  { name: 'Bee', emoji: '🐝', difficulty: 'easy', points: [
    { x: 0.25, y: 0.5 }, { x: 0.35, y: 0.35 }, { x: 0.55, y: 0.3 }, { x: 0.75, y: 0.4 },
    { x: 0.8, y: 0.55 }, { x: 0.7, y: 0.7 }, { x: 0.5, y: 0.75 }, { x: 0.3, y: 0.65 }, { x: 0.25, y: 0.5 },
  ]},
  { name: 'Duck', emoji: '🦆', difficulty: 'easy', points: [
    { x: 0.2, y: 0.55 }, { x: 0.3, y: 0.4 }, { x: 0.5, y: 0.35 }, { x: 0.7, y: 0.4 },
    { x: 0.85, y: 0.45 }, { x: 0.75, y: 0.55 }, { x: 0.55, y: 0.6 }, { x: 0.35, y: 0.65 }, { x: 0.2, y: 0.55 },
  ]},
  // Easy letters
  { name: 'Letter O', emoji: '🅾️', difficulty: 'easy', points: [
    { x: 0.5, y: 0.2 }, { x: 0.75, y: 0.35 }, { x: 0.8, y: 0.55 }, { x: 0.7, y: 0.75 },
    { x: 0.5, y: 0.8 }, { x: 0.3, y: 0.75 }, { x: 0.2, y: 0.55 }, { x: 0.25, y: 0.35 }, { x: 0.5, y: 0.2 },
  ]},
  { name: 'Letter C', emoji: '🇨', difficulty: 'easy', points: [
    { x: 0.75, y: 0.3 }, { x: 0.55, y: 0.2 }, { x: 0.35, y: 0.25 }, { x: 0.2, y: 0.4 },
    { x: 0.2, y: 0.6 }, { x: 0.35, y: 0.75 }, { x: 0.55, y: 0.8 }, { x: 0.75, y: 0.7 },
  ]},
  { name: 'Letter L', emoji: '🇱', difficulty: 'easy', points: [
    { x: 0.3, y: 0.2 }, { x: 0.3, y: 0.5 }, { x: 0.3, y: 0.8 }, { x: 0.55, y: 0.8 }, { x: 0.75, y: 0.8 },
  ]},
  { name: 'Letter V', emoji: '🇻', difficulty: 'easy', points: [
    { x: 0.2, y: 0.2 }, { x: 0.35, y: 0.5 }, { x: 0.5, y: 0.8 }, { x: 0.65, y: 0.5 }, { x: 0.8, y: 0.2 },
  ]},
  // Easy numbers
  { name: 'Number 1', emoji: '1️⃣', difficulty: 'easy', points: [
    { x: 0.4, y: 0.25 }, { x: 0.5, y: 0.2 }, { x: 0.5, y: 0.5 }, { x: 0.5, y: 0.8 },
  ]},
  { name: 'Number 0', emoji: '0️⃣', difficulty: 'easy', points: [
    { x: 0.5, y: 0.2 }, { x: 0.7, y: 0.3 }, { x: 0.75, y: 0.5 }, { x: 0.7, y: 0.7 },
    { x: 0.5, y: 0.8 }, { x: 0.3, y: 0.7 }, { x: 0.25, y: 0.5 }, { x: 0.3, y: 0.3 }, { x: 0.5, y: 0.2 },
  ]},
  { name: 'Number 7', emoji: '7️⃣', difficulty: 'easy', points: [
    { x: 0.25, y: 0.2 }, { x: 0.5, y: 0.2 }, { x: 0.75, y: 0.2 }, { x: 0.5, y: 0.5 }, { x: 0.35, y: 0.8 },
  ]},

  // ===== MEDIUM SHAPES =====
  // Medium animals
  { name: 'Cat Face', emoji: '🐱', difficulty: 'medium', points: [
    { x: 0.2, y: 0.5 }, { x: 0.2, y: 0.3 }, { x: 0.3, y: 0.15 }, { x: 0.4, y: 0.3 }, { x: 0.5, y: 0.25 },
    { x: 0.6, y: 0.3 }, { x: 0.7, y: 0.15 }, { x: 0.8, y: 0.3 }, { x: 0.8, y: 0.5 },
    { x: 0.7, y: 0.7 }, { x: 0.5, y: 0.8 }, { x: 0.3, y: 0.7 }, { x: 0.2, y: 0.5 },
  ]},
  { name: 'Dog Face', emoji: '🐶', difficulty: 'medium', points: [
    { x: 0.15, y: 0.4 }, { x: 0.2, y: 0.6 }, { x: 0.25, y: 0.35 }, { x: 0.4, y: 0.3 }, { x: 0.5, y: 0.25 },
    { x: 0.6, y: 0.3 }, { x: 0.75, y: 0.35 }, { x: 0.8, y: 0.6 }, { x: 0.85, y: 0.4 },
    { x: 0.75, y: 0.55 }, { x: 0.7, y: 0.75 }, { x: 0.5, y: 0.85 }, { x: 0.3, y: 0.75 }, { x: 0.25, y: 0.55 }, { x: 0.15, y: 0.4 },
  ]},
  { name: 'Bunny', emoji: '🐰', difficulty: 'medium', points: [
    { x: 0.35, y: 0.1 }, { x: 0.38, y: 0.35 }, { x: 0.5, y: 0.35 }, { x: 0.62, y: 0.35 }, { x: 0.65, y: 0.1 },
    { x: 0.68, y: 0.35 }, { x: 0.75, y: 0.5 }, { x: 0.7, y: 0.7 }, { x: 0.5, y: 0.8 },
    { x: 0.3, y: 0.7 }, { x: 0.25, y: 0.5 }, { x: 0.32, y: 0.35 }, { x: 0.35, y: 0.1 },
  ]},
  { name: 'Fish', emoji: '🐟', difficulty: 'medium', points: [
    { x: 0.15, y: 0.5 }, { x: 0.25, y: 0.35 }, { x: 0.4, y: 0.3 }, { x: 0.6, y: 0.3 }, { x: 0.8, y: 0.4 },
    { x: 0.85, y: 0.5 }, { x: 0.8, y: 0.6 }, { x: 0.6, y: 0.7 }, { x: 0.4, y: 0.7 }, { x: 0.25, y: 0.65 }, { x: 0.15, y: 0.5 },
  ]},
  { name: 'Heart', emoji: '❤️', difficulty: 'medium', points: [
    { x: 0.5, y: 0.85 }, { x: 0.25, y: 0.6 }, { x: 0.15, y: 0.4 }, { x: 0.2, y: 0.25 }, { x: 0.35, y: 0.2 },
    { x: 0.5, y: 0.35 }, { x: 0.65, y: 0.2 }, { x: 0.8, y: 0.25 }, { x: 0.85, y: 0.4 }, { x: 0.75, y: 0.6 }, { x: 0.5, y: 0.85 },
  ]},
  { name: 'Penguin', emoji: '🐧', difficulty: 'medium', points: [
    { x: 0.5, y: 0.15 }, { x: 0.65, y: 0.25 }, { x: 0.75, y: 0.45 }, { x: 0.7, y: 0.7 },
    { x: 0.55, y: 0.85 }, { x: 0.45, y: 0.85 }, { x: 0.3, y: 0.7 }, { x: 0.25, y: 0.45 },
    { x: 0.35, y: 0.25 }, { x: 0.5, y: 0.15 },
  ]},
  { name: 'Turtle', emoji: '🐢', difficulty: 'medium', points: [
    { x: 0.2, y: 0.55 }, { x: 0.15, y: 0.45 }, { x: 0.25, y: 0.35 }, { x: 0.4, y: 0.3 },
    { x: 0.6, y: 0.3 }, { x: 0.75, y: 0.35 }, { x: 0.85, y: 0.45 }, { x: 0.85, y: 0.55 },
    { x: 0.75, y: 0.65 }, { x: 0.55, y: 0.7 }, { x: 0.35, y: 0.7 }, { x: 0.2, y: 0.55 },
  ]},
  { name: 'Ladybug', emoji: '🐞', difficulty: 'medium', points: [
    { x: 0.5, y: 0.2 }, { x: 0.7, y: 0.3 }, { x: 0.8, y: 0.5 }, { x: 0.75, y: 0.7 },
    { x: 0.55, y: 0.8 }, { x: 0.45, y: 0.8 }, { x: 0.25, y: 0.7 }, { x: 0.2, y: 0.5 },
    { x: 0.3, y: 0.3 }, { x: 0.5, y: 0.2 },
  ]},
  { name: 'Crab', emoji: '🦀', difficulty: 'medium', points: [
    { x: 0.15, y: 0.35 }, { x: 0.25, y: 0.45 }, { x: 0.35, y: 0.35 }, { x: 0.5, y: 0.3 },
    { x: 0.65, y: 0.35 }, { x: 0.75, y: 0.45 }, { x: 0.85, y: 0.35 }, { x: 0.8, y: 0.55 },
    { x: 0.65, y: 0.7 }, { x: 0.35, y: 0.7 }, { x: 0.2, y: 0.55 }, { x: 0.15, y: 0.35 },
  ]},
  { name: 'Whale', emoji: '🐋', difficulty: 'medium', points: [
    { x: 0.1, y: 0.5 }, { x: 0.15, y: 0.35 }, { x: 0.3, y: 0.3 }, { x: 0.5, y: 0.32 },
    { x: 0.7, y: 0.38 }, { x: 0.85, y: 0.5 }, { x: 0.7, y: 0.62 }, { x: 0.5, y: 0.68 },
    { x: 0.3, y: 0.65 }, { x: 0.1, y: 0.5 },
  ]},
  // Medium letters
  { name: 'Letter A', emoji: '🅰️', difficulty: 'medium', points: [
    { x: 0.2, y: 0.8 }, { x: 0.35, y: 0.5 }, { x: 0.5, y: 0.2 }, { x: 0.65, y: 0.5 }, { x: 0.8, y: 0.8 },
    { x: 0.65, y: 0.55 }, { x: 0.35, y: 0.55 },
  ]},
  { name: 'Letter B', emoji: '🅱️', difficulty: 'medium', points: [
    { x: 0.25, y: 0.2 }, { x: 0.25, y: 0.5 }, { x: 0.25, y: 0.8 }, { x: 0.55, y: 0.8 },
    { x: 0.7, y: 0.7 }, { x: 0.7, y: 0.58 }, { x: 0.55, y: 0.5 }, { x: 0.25, y: 0.5 },
    { x: 0.55, y: 0.5 }, { x: 0.7, y: 0.42 }, { x: 0.7, y: 0.3 }, { x: 0.55, y: 0.2 }, { x: 0.25, y: 0.2 },
  ]},
  { name: 'Letter D', emoji: '🇩', difficulty: 'medium', points: [
    { x: 0.25, y: 0.2 }, { x: 0.25, y: 0.8 }, { x: 0.5, y: 0.8 }, { x: 0.7, y: 0.65 },
    { x: 0.75, y: 0.5 }, { x: 0.7, y: 0.35 }, { x: 0.5, y: 0.2 }, { x: 0.25, y: 0.2 },
  ]},
  { name: 'Letter E', emoji: '🇪', difficulty: 'medium', points: [
    { x: 0.7, y: 0.2 }, { x: 0.3, y: 0.2 }, { x: 0.3, y: 0.5 }, { x: 0.6, y: 0.5 },
    { x: 0.3, y: 0.5 }, { x: 0.3, y: 0.8 }, { x: 0.7, y: 0.8 },
  ]},
  { name: 'Letter S', emoji: '🇸', difficulty: 'medium', points: [
    { x: 0.7, y: 0.25 }, { x: 0.5, y: 0.2 }, { x: 0.3, y: 0.28 }, { x: 0.28, y: 0.4 },
    { x: 0.4, y: 0.5 }, { x: 0.6, y: 0.5 }, { x: 0.72, y: 0.6 }, { x: 0.7, y: 0.72 },
    { x: 0.5, y: 0.8 }, { x: 0.3, y: 0.75 },
  ]},
  { name: 'Letter M', emoji: '🇲', difficulty: 'medium', points: [
    { x: 0.15, y: 0.8 }, { x: 0.15, y: 0.2 }, { x: 0.5, y: 0.55 }, { x: 0.85, y: 0.2 }, { x: 0.85, y: 0.8 },
  ]},
  // Medium numbers
  { name: 'Number 2', emoji: '2️⃣', difficulty: 'medium', points: [
    { x: 0.3, y: 0.3 }, { x: 0.4, y: 0.2 }, { x: 0.6, y: 0.2 }, { x: 0.7, y: 0.3 },
    { x: 0.65, y: 0.45 }, { x: 0.5, y: 0.55 }, { x: 0.35, y: 0.7 }, { x: 0.3, y: 0.8 }, { x: 0.7, y: 0.8 },
  ]},
  { name: 'Number 3', emoji: '3️⃣', difficulty: 'medium', points: [
    { x: 0.3, y: 0.25 }, { x: 0.5, y: 0.2 }, { x: 0.7, y: 0.3 }, { x: 0.65, y: 0.45 },
    { x: 0.5, y: 0.5 }, { x: 0.65, y: 0.55 }, { x: 0.7, y: 0.7 }, { x: 0.5, y: 0.8 }, { x: 0.3, y: 0.75 },
  ]},
  { name: 'Number 5', emoji: '5️⃣', difficulty: 'medium', points: [
    { x: 0.7, y: 0.2 }, { x: 0.35, y: 0.2 }, { x: 0.3, y: 0.45 }, { x: 0.55, y: 0.45 },
    { x: 0.7, y: 0.55 }, { x: 0.7, y: 0.7 }, { x: 0.5, y: 0.8 }, { x: 0.3, y: 0.75 },
  ]},
  { name: 'Number 6', emoji: '6️⃣', difficulty: 'medium', points: [
    { x: 0.65, y: 0.25 }, { x: 0.5, y: 0.2 }, { x: 0.35, y: 0.3 }, { x: 0.3, y: 0.5 },
    { x: 0.35, y: 0.7 }, { x: 0.5, y: 0.8 }, { x: 0.65, y: 0.7 }, { x: 0.65, y: 0.55 },
    { x: 0.5, y: 0.5 }, { x: 0.35, y: 0.55 },
  ]},

  // ===== HARD SHAPES =====
  { name: 'Lion', emoji: '🦁', difficulty: 'hard', points: [
    { x: 0.5, y: 0.1 }, { x: 0.7, y: 0.15 }, { x: 0.85, y: 0.3 }, { x: 0.9, y: 0.5 },
    { x: 0.85, y: 0.7 }, { x: 0.7, y: 0.85 }, { x: 0.5, y: 0.9 }, { x: 0.3, y: 0.85 },
    { x: 0.15, y: 0.7 }, { x: 0.1, y: 0.5 }, { x: 0.15, y: 0.3 }, { x: 0.3, y: 0.15 }, { x: 0.5, y: 0.1 },
  ]},
  { name: 'Star', emoji: '⭐', difficulty: 'hard', points: [
    { x: 0.5, y: 0.1 }, { x: 0.42, y: 0.38 }, { x: 0.12, y: 0.38 }, { x: 0.35, y: 0.55 },
    { x: 0.25, y: 0.85 }, { x: 0.5, y: 0.68 }, { x: 0.75, y: 0.85 }, { x: 0.65, y: 0.55 },
    { x: 0.88, y: 0.38 }, { x: 0.58, y: 0.38 }, { x: 0.5, y: 0.1 },
  ]},
  { name: 'Butterfly', emoji: '🦋', difficulty: 'hard', points: [
    { x: 0.5, y: 0.25 }, { x: 0.3, y: 0.15 }, { x: 0.1, y: 0.3 }, { x: 0.15, y: 0.5 },
    { x: 0.3, y: 0.55 }, { x: 0.5, y: 0.5 }, { x: 0.7, y: 0.55 }, { x: 0.85, y: 0.5 },
    { x: 0.9, y: 0.3 }, { x: 0.7, y: 0.15 }, { x: 0.5, y: 0.25 }, { x: 0.5, y: 0.85 },
  ]},
  { name: 'Elephant', emoji: '🐘', difficulty: 'hard', points: [
    { x: 0.25, y: 0.35 }, { x: 0.15, y: 0.5 }, { x: 0.25, y: 0.55 }, { x: 0.3, y: 0.45 },
    { x: 0.5, y: 0.4 }, { x: 0.7, y: 0.45 }, { x: 0.75, y: 0.55 }, { x: 0.85, y: 0.5 },
    { x: 0.75, y: 0.35 }, { x: 0.6, y: 0.5 }, { x: 0.55, y: 0.7 }, { x: 0.5, y: 0.85 },
    { x: 0.45, y: 0.7 }, { x: 0.4, y: 0.5 }, { x: 0.25, y: 0.35 },
  ]},
  { name: 'Giraffe', emoji: '🦒', difficulty: 'hard', points: [
    { x: 0.45, y: 0.1 }, { x: 0.55, y: 0.1 }, { x: 0.6, y: 0.2 }, { x: 0.58, y: 0.35 },
    { x: 0.55, y: 0.5 }, { x: 0.65, y: 0.6 }, { x: 0.7, y: 0.75 }, { x: 0.6, y: 0.85 },
    { x: 0.4, y: 0.85 }, { x: 0.3, y: 0.75 }, { x: 0.35, y: 0.6 }, { x: 0.45, y: 0.5 },
    { x: 0.42, y: 0.35 }, { x: 0.4, y: 0.2 }, { x: 0.45, y: 0.1 },
  ]},
  { name: 'Octopus', emoji: '🐙', difficulty: 'hard', points: [
    { x: 0.5, y: 0.15 }, { x: 0.7, y: 0.25 }, { x: 0.8, y: 0.45 }, { x: 0.85, y: 0.7 },
    { x: 0.75, y: 0.85 }, { x: 0.6, y: 0.75 }, { x: 0.5, y: 0.85 }, { x: 0.4, y: 0.75 },
    { x: 0.25, y: 0.85 }, { x: 0.15, y: 0.7 }, { x: 0.2, y: 0.45 }, { x: 0.3, y: 0.25 }, { x: 0.5, y: 0.15 },
  ]},
  { name: 'Monkey', emoji: '🐵', difficulty: 'hard', points: [
    { x: 0.15, y: 0.45 }, { x: 0.2, y: 0.55 }, { x: 0.25, y: 0.4 }, { x: 0.35, y: 0.25 },
    { x: 0.5, y: 0.2 }, { x: 0.65, y: 0.25 }, { x: 0.75, y: 0.4 }, { x: 0.8, y: 0.55 },
    { x: 0.85, y: 0.45 }, { x: 0.78, y: 0.55 }, { x: 0.7, y: 0.7 }, { x: 0.5, y: 0.8 },
    { x: 0.3, y: 0.7 }, { x: 0.22, y: 0.55 }, { x: 0.15, y: 0.45 },
  ]},
  { name: 'Panda', emoji: '🐼', difficulty: 'hard', points: [
    { x: 0.2, y: 0.3 }, { x: 0.25, y: 0.2 }, { x: 0.35, y: 0.25 }, { x: 0.4, y: 0.35 },
    { x: 0.5, y: 0.3 }, { x: 0.6, y: 0.35 }, { x: 0.65, y: 0.25 }, { x: 0.75, y: 0.2 },
    { x: 0.8, y: 0.3 }, { x: 0.8, y: 0.55 }, { x: 0.7, y: 0.75 }, { x: 0.5, y: 0.8 },
    { x: 0.3, y: 0.75 }, { x: 0.2, y: 0.55 }, { x: 0.2, y: 0.3 },
  ]},
  { name: 'Koala', emoji: '🐨', difficulty: 'hard', points: [
    { x: 0.15, y: 0.35 }, { x: 0.2, y: 0.5 }, { x: 0.25, y: 0.35 }, { x: 0.4, y: 0.25 },
    { x: 0.5, y: 0.3 }, { x: 0.6, y: 0.25 }, { x: 0.75, y: 0.35 }, { x: 0.8, y: 0.5 },
    { x: 0.85, y: 0.35 }, { x: 0.78, y: 0.55 }, { x: 0.65, y: 0.75 }, { x: 0.5, y: 0.8 },
    { x: 0.35, y: 0.75 }, { x: 0.22, y: 0.55 }, { x: 0.15, y: 0.35 },
  ]},
  { name: 'Fox', emoji: '🦊', difficulty: 'hard', points: [
    { x: 0.2, y: 0.2 }, { x: 0.25, y: 0.4 }, { x: 0.35, y: 0.5 }, { x: 0.5, y: 0.45 },
    { x: 0.65, y: 0.5 }, { x: 0.75, y: 0.4 }, { x: 0.8, y: 0.2 }, { x: 0.75, y: 0.55 },
    { x: 0.65, y: 0.7 }, { x: 0.5, y: 0.85 }, { x: 0.35, y: 0.7 }, { x: 0.25, y: 0.55 }, { x: 0.2, y: 0.2 },
  ]},
  // Hard letters
  { name: 'Letter R', emoji: '🇷', difficulty: 'hard', points: [
    { x: 0.25, y: 0.8 }, { x: 0.25, y: 0.5 }, { x: 0.25, y: 0.2 }, { x: 0.55, y: 0.2 },
    { x: 0.7, y: 0.3 }, { x: 0.7, y: 0.42 }, { x: 0.55, y: 0.5 }, { x: 0.25, y: 0.5 },
    { x: 0.45, y: 0.6 }, { x: 0.7, y: 0.8 },
  ]},
  { name: 'Letter K', emoji: '🇰', difficulty: 'hard', points: [
    { x: 0.25, y: 0.2 }, { x: 0.25, y: 0.5 }, { x: 0.25, y: 0.8 }, { x: 0.25, y: 0.5 },
    { x: 0.45, y: 0.5 }, { x: 0.7, y: 0.2 }, { x: 0.45, y: 0.5 }, { x: 0.7, y: 0.8 },
  ]},
  { name: 'Letter W', emoji: '🇼', difficulty: 'hard', points: [
    { x: 0.1, y: 0.2 }, { x: 0.25, y: 0.8 }, { x: 0.4, y: 0.45 }, { x: 0.5, y: 0.6 },
    { x: 0.6, y: 0.45 }, { x: 0.75, y: 0.8 }, { x: 0.9, y: 0.2 },
  ]},
  { name: 'Letter G', emoji: '🇬', difficulty: 'hard', points: [
    { x: 0.75, y: 0.28 }, { x: 0.55, y: 0.2 }, { x: 0.35, y: 0.25 }, { x: 0.2, y: 0.4 },
    { x: 0.2, y: 0.6 }, { x: 0.35, y: 0.75 }, { x: 0.55, y: 0.8 }, { x: 0.75, y: 0.72 },
    { x: 0.75, y: 0.55 }, { x: 0.55, y: 0.55 },
  ]},
  // Hard numbers
  { name: 'Number 4', emoji: '4️⃣', difficulty: 'hard', points: [
    { x: 0.6, y: 0.2 }, { x: 0.35, y: 0.55 }, { x: 0.7, y: 0.55 }, { x: 0.6, y: 0.55 },
    { x: 0.6, y: 0.8 },
  ]},
  { name: 'Number 8', emoji: '8️⃣', difficulty: 'hard', points: [
    { x: 0.5, y: 0.5 }, { x: 0.35, y: 0.4 }, { x: 0.35, y: 0.28 }, { x: 0.5, y: 0.2 },
    { x: 0.65, y: 0.28 }, { x: 0.65, y: 0.4 }, { x: 0.5, y: 0.5 }, { x: 0.35, y: 0.6 },
    { x: 0.35, y: 0.72 }, { x: 0.5, y: 0.8 }, { x: 0.65, y: 0.72 }, { x: 0.65, y: 0.6 }, { x: 0.5, y: 0.5 },
  ]},
  { name: 'Number 9', emoji: '9️⃣', difficulty: 'hard', points: [
    { x: 0.65, y: 0.45 }, { x: 0.5, y: 0.5 }, { x: 0.35, y: 0.4 }, { x: 0.35, y: 0.28 },
    { x: 0.5, y: 0.2 }, { x: 0.65, y: 0.28 }, { x: 0.7, y: 0.45 }, { x: 0.65, y: 0.65 },
    { x: 0.5, y: 0.8 }, { x: 0.35, y: 0.75 },
  ]},

  // ===== GROWNUP SHAPES =====
  { name: 'Unicorn', emoji: '🦄', difficulty: 'grownup', points: [
    { x: 0.5, y: 0.08 }, { x: 0.48, y: 0.2 }, { x: 0.35, y: 0.15 }, { x: 0.3, y: 0.25 },
    { x: 0.2, y: 0.35 }, { x: 0.15, y: 0.5 }, { x: 0.2, y: 0.65 }, { x: 0.35, y: 0.75 },
    { x: 0.5, y: 0.82 }, { x: 0.65, y: 0.75 }, { x: 0.8, y: 0.65 }, { x: 0.85, y: 0.5 },
    { x: 0.8, y: 0.35 }, { x: 0.7, y: 0.25 }, { x: 0.65, y: 0.15 }, { x: 0.52, y: 0.2 }, { x: 0.5, y: 0.08 },
  ]},
  { name: 'Dragon', emoji: '🐉', difficulty: 'grownup', points: [
    { x: 0.1, y: 0.45 }, { x: 0.2, y: 0.4 }, { x: 0.25, y: 0.3 }, { x: 0.35, y: 0.25 },
    { x: 0.4, y: 0.35 }, { x: 0.5, y: 0.28 }, { x: 0.55, y: 0.38 }, { x: 0.65, y: 0.32 },
    { x: 0.72, y: 0.25 }, { x: 0.78, y: 0.35 }, { x: 0.85, y: 0.45 }, { x: 0.8, y: 0.55 },
    { x: 0.7, y: 0.6 }, { x: 0.55, y: 0.65 }, { x: 0.4, y: 0.7 }, { x: 0.25, y: 0.65 },
    { x: 0.15, y: 0.55 }, { x: 0.1, y: 0.45 },
  ]},
  { name: 'Owl', emoji: '🦉', difficulty: 'grownup', points: [
    { x: 0.3, y: 0.15 }, { x: 0.35, y: 0.25 }, { x: 0.5, y: 0.2 }, { x: 0.65, y: 0.25 },
    { x: 0.7, y: 0.15 }, { x: 0.75, y: 0.3 }, { x: 0.8, y: 0.45 }, { x: 0.75, y: 0.65 },
    { x: 0.65, y: 0.8 }, { x: 0.5, y: 0.85 }, { x: 0.35, y: 0.8 }, { x: 0.25, y: 0.65 },
    { x: 0.2, y: 0.45 }, { x: 0.25, y: 0.3 }, { x: 0.3, y: 0.15 },
  ]},
  { name: 'Dolphin', emoji: '🐬', difficulty: 'grownup', points: [
    { x: 0.9, y: 0.5 }, { x: 0.8, y: 0.4 }, { x: 0.65, y: 0.32 }, { x: 0.5, y: 0.25 },
    { x: 0.45, y: 0.35 }, { x: 0.3, y: 0.4 }, { x: 0.15, y: 0.45 }, { x: 0.08, y: 0.5 },
    { x: 0.12, y: 0.55 }, { x: 0.08, y: 0.6 }, { x: 0.2, y: 0.55 }, { x: 0.35, y: 0.58 },
    { x: 0.5, y: 0.6 }, { x: 0.65, y: 0.58 }, { x: 0.8, y: 0.55 }, { x: 0.9, y: 0.5 },
  ]},
  { name: 'Phoenix', emoji: '🔥', difficulty: 'grownup', points: [
    { x: 0.5, y: 0.1 }, { x: 0.6, y: 0.15 }, { x: 0.7, y: 0.25 }, { x: 0.8, y: 0.4 },
    { x: 0.85, y: 0.55 }, { x: 0.8, y: 0.7 }, { x: 0.65, y: 0.8 }, { x: 0.5, y: 0.75 },
    { x: 0.35, y: 0.8 }, { x: 0.2, y: 0.7 }, { x: 0.15, y: 0.55 }, { x: 0.2, y: 0.4 },
    { x: 0.3, y: 0.25 }, { x: 0.4, y: 0.15 }, { x: 0.5, y: 0.1 },
  ]},
  { name: 'Peacock', emoji: '🦚', difficulty: 'grownup', points: [
    { x: 0.5, y: 0.08 }, { x: 0.7, y: 0.12 }, { x: 0.85, y: 0.25 }, { x: 0.92, y: 0.45 },
    { x: 0.88, y: 0.65 }, { x: 0.75, y: 0.8 }, { x: 0.5, y: 0.88 }, { x: 0.25, y: 0.8 },
    { x: 0.12, y: 0.65 }, { x: 0.08, y: 0.45 }, { x: 0.15, y: 0.25 }, { x: 0.3, y: 0.12 }, { x: 0.5, y: 0.08 },
  ]},
  { name: 'Shark', emoji: '🦈', difficulty: 'grownup', points: [
    { x: 0.9, y: 0.5 }, { x: 0.8, y: 0.42 }, { x: 0.65, y: 0.35 }, { x: 0.5, y: 0.2 },
    { x: 0.45, y: 0.35 }, { x: 0.3, y: 0.4 }, { x: 0.12, y: 0.45 }, { x: 0.05, y: 0.55 },
    { x: 0.15, y: 0.52 }, { x: 0.05, y: 0.6 }, { x: 0.2, y: 0.55 }, { x: 0.4, y: 0.58 },
    { x: 0.6, y: 0.55 }, { x: 0.75, y: 0.52 }, { x: 0.9, y: 0.5 },
  ]},
  { name: 'Crocodile', emoji: '🐊', difficulty: 'grownup', points: [
    { x: 0.95, y: 0.48 }, { x: 0.85, y: 0.42 }, { x: 0.7, y: 0.4 }, { x: 0.55, y: 0.38 },
    { x: 0.4, y: 0.4 }, { x: 0.25, y: 0.42 }, { x: 0.1, y: 0.48 }, { x: 0.05, y: 0.52 },
    { x: 0.1, y: 0.58 }, { x: 0.25, y: 0.6 }, { x: 0.4, y: 0.58 }, { x: 0.55, y: 0.56 },
    { x: 0.7, y: 0.54 }, { x: 0.85, y: 0.52 }, { x: 0.95, y: 0.48 },
  ]},
  // Grownup letters
  { name: 'Letter Q', emoji: '🇶', difficulty: 'grownup', points: [
    { x: 0.5, y: 0.18 }, { x: 0.72, y: 0.28 }, { x: 0.8, y: 0.5 }, { x: 0.72, y: 0.72 },
    { x: 0.5, y: 0.82 }, { x: 0.28, y: 0.72 }, { x: 0.2, y: 0.5 }, { x: 0.28, y: 0.28 },
    { x: 0.5, y: 0.18 }, { x: 0.55, y: 0.65 }, { x: 0.75, y: 0.88 },
  ]},
  { name: 'Letter Z', emoji: '🇿', difficulty: 'grownup', points: [
    { x: 0.2, y: 0.2 }, { x: 0.5, y: 0.2 }, { x: 0.8, y: 0.2 }, { x: 0.5, y: 0.5 },
    { x: 0.2, y: 0.8 }, { x: 0.5, y: 0.8 }, { x: 0.8, y: 0.8 },
  ]},
  { name: 'Ampersand', emoji: '🔣', difficulty: 'grownup', points: [
    { x: 0.7, y: 0.75 }, { x: 0.55, y: 0.8 }, { x: 0.35, y: 0.72 }, { x: 0.3, y: 0.58 },
    { x: 0.4, y: 0.48 }, { x: 0.55, y: 0.42 }, { x: 0.6, y: 0.3 }, { x: 0.5, y: 0.2 },
    { x: 0.35, y: 0.25 }, { x: 0.3, y: 0.38 }, { x: 0.45, y: 0.52 }, { x: 0.7, y: 0.78 },
  ]},
];

const RAINBOW_COLORS = ['#FF6B6B', '#FFA94D', '#FFE066', '#69DB7C', '#74C0FC', '#B197FC'];

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createTraceGame(onBack: () => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'game-container fade-enter';

  let currentAnimalIndex = 0;
  let filteredAnimals: AnimalShape[] = [];
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let isDrawing = false;
  let drawnPoints: Point[] = [];
  let lastDrawTime = 0;
  let completedPoints = 0;
  let earnedStars = 0;

  function getAnimalsForDifficulty(): AnimalShape[] {
    const settings = getDifficultySettings();
    const snapDist = settings.traceSnapDistance;

    // Filter animals based on difficulty and shuffle for random order
    if (snapDist >= 40) {
      // Easy - only easy shapes
      return shuffleArray(ANIMALS.filter(a => a.difficulty === 'easy'));
    } else if (snapDist >= 30) {
      // Medium - easy and medium
      return shuffleArray(ANIMALS.filter(a => a.difficulty === 'easy' || a.difficulty === 'medium'));
    } else if (snapDist >= 20) {
      // Hard - easy, medium and hard shapes
      return shuffleArray(ANIMALS.filter(a => a.difficulty !== 'grownup'));
    } else {
      // Grown-up - only grownup shapes (very challenging!)
      return shuffleArray(ANIMALS.filter(a => a.difficulty === 'grownup'));
    }
  }

  function render(): void {
    container.innerHTML = '';

    const settings = getDifficultySettings();

    // Get appropriate animals for difficulty
    if (filteredAnimals.length === 0) {
      filteredAnimals = getAnimalsForDifficulty();
    }

    const currentAnimal = filteredAnimals[currentAnimalIndex % filteredAnimals.length];

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
    title.textContent = `Trace the ${currentAnimal.emoji}`;
    header.appendChild(title);

    const stars = document.createElement('div');
    stars.className = 'stars';
    stars.textContent = '⭐'.repeat(earnedStars);
    header.appendChild(stars);

    container.appendChild(header);

    // Game area
    const gameArea = document.createElement('div');
    gameArea.className = 'game-area';

    canvas = document.createElement('canvas');
    const size = Math.min(window.innerWidth - 40, window.innerHeight - 180);
    canvas.width = size;
    canvas.height = size;
    canvas.style.background = 'rgba(255,255,255,0.7)';
    canvas.style.borderRadius = '20px';

    ctx = canvas.getContext('2d')!;

    gameArea.appendChild(canvas);
    container.appendChild(gameArea);

    // Draw the dotted outline
    drawAnimalOutline(settings);

    // Hint text
    const hint = document.createElement('div');
    hint.className = 'trace-hint';
    hint.textContent = '👆 Trace the dots!';
    container.appendChild(hint);

    // Show tutorial hand on first point
    if (completedPoints === 0) {
      showTutorialHand();
    }

    // Touch/mouse event handlers
    setupDrawingEvents(settings);
  }

  function showTutorialHand(): void {
    const animal = filteredAnimals[currentAnimalIndex % filteredAnimals.length];
    const firstPoint = animal.points[0];

    const hand = document.createElement('div');
    hand.className = 'tutorial-hand';
    hand.textContent = '👆';

    const canvasRect = canvas.getBoundingClientRect();
    hand.style.left = `${canvasRect.left + firstPoint.x * canvas.width - 25}px`;
    hand.style.top = `${canvasRect.top + firstPoint.y * canvas.height - 10}px`;

    container.appendChild(hand);

    // Remove after a few seconds
    setTimeout(() => hand.remove(), 3000);
  }

  function drawAnimalOutline(settings: ReturnType<typeof getDifficultySettings>): void {
    const animal = filteredAnimals[currentAnimalIndex % filteredAnimals.length];
    const points = animal.points;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw faded emoji reference in the background
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.font = `${canvas.width * 0.6}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(animal.emoji, canvas.width / 2, canvas.height / 2);
    ctx.restore();

    // Draw dotted lines between points
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = settings.traceLineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    points.forEach((point, i) => {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw dots at each point
    ctx.setLineDash([]);
    points.forEach((point, i) => {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, settings.tracePointSize, 0, Math.PI * 2);
      ctx.fillStyle = i < completedPoints ? '#69DB7C' : RAINBOW_COLORS[i % RAINBOW_COLORS.length];
      ctx.fill();

      // Start indicator (next point to trace)
      if (i === completedPoints) {
        ctx.beginPath();
        ctx.arc(x, y, settings.tracePointSize + 10, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFE066';
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    });

    // Draw the user's traced line
    if (drawnPoints.length > 1) {
      ctx.setLineDash([]);
      ctx.lineWidth = settings.traceLineWidth + 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      drawnPoints.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.strokeStyle = RAINBOW_COLORS[i % RAINBOW_COLORS.length];
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
        }
      });
    }
  }

  function setupDrawingEvents(settings: ReturnType<typeof getDifficultySettings>): void {
    function getPosition(e: TouchEvent | MouseEvent): Point {
      const rect = canvas.getBoundingClientRect();
      if ('touches' in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      }
      return {
        x: (e as MouseEvent).clientX - rect.left,
        y: (e as MouseEvent).clientY - rect.top
      };
    }

    function startDraw(e: TouchEvent | MouseEvent): void {
      e.preventDefault();
      isDrawing = true;
      drawnPoints = [getPosition(e)];
    }

    function draw(e: TouchEvent | MouseEvent): void {
      if (!isDrawing) return;
      e.preventDefault();

      const pos = getPosition(e);
      drawnPoints.push(pos);

      // Play drawing sound occasionally
      const now = Date.now();
      if (now - lastDrawTime > 100) {
        playDraw();
        lastDrawTime = now;
      }

      // Check if near a target point
      checkProgress(pos, settings);

      drawAnimalOutline(settings);
    }

    function endDraw(): void {
      isDrawing = false;
    }

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);
  }

  function checkProgress(pos: Point, settings: ReturnType<typeof getDifficultySettings>): void {
    const animal = filteredAnimals[currentAnimalIndex % filteredAnimals.length];
    const targetPoint = animal.points[completedPoints];

    if (!targetPoint) return;

    const targetX = targetPoint.x * canvas.width;
    const targetY = targetPoint.y * canvas.height;

    const distance = Math.sqrt((pos.x - targetX) ** 2 + (pos.y - targetY) ** 2);

    if (distance < settings.traceSnapDistance) {
      completedPoints++;
      playPop();

      if (completedPoints >= animal.points.length) {
        // Completed this animal!
        playSuccess();
        playEncouragement();
        showCelebration();
        earnedStars++;
        addStars(1);
        completeGame('trace');
        collectAnimal(animal.emoji);

        setTimeout(() => {
          currentAnimalIndex++;
          completedPoints = 0;
          drawnPoints = [];
          render();
        }, 2000);
      }
    }
  }

  filteredAnimals = getAnimalsForDifficulty();
  render();
  return container;
}
