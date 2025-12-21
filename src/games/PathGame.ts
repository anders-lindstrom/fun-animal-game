// Follow the Path Game
// Kids draw along a path to help an animal get home

import { playDraw, playSuccess, playClick } from '../utils/audio';
import { showCelebration } from '../components/Celebration';
import { getDifficultySettings, collectAnimal, addStars, completeGame } from '../utils/state';

interface Point {
  x: number;
  y: number;
}

interface PathLevel {
  animal: string;
  goal: string;
  goalLabel: string;
}

const LEVELS: PathLevel[] = [
  { animal: '🐱', goal: '🏠', goalLabel: 'home' },
  { animal: '🐶', goal: '🦴', goalLabel: 'bone' },
  { animal: '🐰', goal: '🥕', goalLabel: 'carrot' },
  { animal: '🐝', goal: '🌸', goalLabel: 'flower' },
  { animal: '🐟', goal: '🌊', goalLabel: 'ocean' },
  { animal: '🐸', goal: '🪷', goalLabel: 'lily pad' },
  { animal: '🦊', goal: '🌲', goalLabel: 'forest' },
  { animal: '🐧', goal: '❄️', goalLabel: 'ice' },
];

const RAINBOW_COLORS = ['#FF6B6B', '#FFA94D', '#FFE066', '#69DB7C', '#74C0FC', '#B197FC'];

export function createPathGame(onBack: () => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'game-container fade-enter';

  let currentLevel = 0;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let pathPoints: Point[] = [];
  let animalProgress = 0;
  let isDrawing = false;
  let drawnPoints: Point[] = [];
  let lastDrawTime = 0;
  let completed = false;
  let earnedStars = 0;

  function generatePath(): void {
    const settings = getDifficultySettings();

    // Generate a winding path - more segments for harder difficulty
    const points: Point[] = [];
    let segments: number;

    if (settings.pathSnapDistance >= 60) {
      // Easy - simple straight-ish path
      segments = 3;
    } else if (settings.pathSnapDistance >= 50) {
      // Medium - gentle curves
      segments = 5;
    } else {
      // Hard - more winding
      segments = 7;
    }

    for (let i = 0; i <= segments; i++) {
      const x = 0.1 + (i / segments) * 0.8;
      // Alternate up and down for a wavy path
      const baseY = 0.5;
      const waveAmplitude = settings.pathSnapDistance >= 60 ? 0.1 : 0.2;
      const wave = Math.sin(i * 1.2) * waveAmplitude;
      const y = baseY + wave;

      points.push({ x, y });
    }

    pathPoints = points;
  }

  function render(): void {
    container.innerHTML = '';

    const settings = getDifficultySettings();
    const level = LEVELS[currentLevel % LEVELS.length];

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
    title.textContent = `Help ${level.animal} find the ${level.goalLabel}!`;
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
    const width = Math.min(window.innerWidth - 40, 800);
    const height = Math.min(window.innerHeight - 200, 500);
    canvas.width = width;
    canvas.height = height;
    canvas.style.background = 'rgba(255,255,255,0.7)';
    canvas.style.borderRadius = '20px';

    ctx = canvas.getContext('2d')!;

    gameArea.appendChild(canvas);
    container.appendChild(gameArea);

    // Generate new path if needed
    if (pathPoints.length === 0) {
      generatePath();
    }

    drawScene(settings);
    setupDrawingEvents(settings);
  }

  function drawScene(settings: ReturnType<typeof getDifficultySettings>): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const level = LEVELS[currentLevel % LEVELS.length];

    // Draw the dotted path
    ctx.setLineDash([15, 15]);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = settings.pathWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    pathPoints.forEach((point, i) => {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw guide dots along the path
    ctx.setLineDash([]);
    pathPoints.forEach((point, i) => {
      const x = point.x * canvas.width;
      const y = point.y * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, settings.pathWidth / 2.5, 0, Math.PI * 2);
      ctx.fillStyle = RAINBOW_COLORS[i % RAINBOW_COLORS.length];
      ctx.fill();
    });

    // Draw the user's path
    if (drawnPoints.length > 1) {
      ctx.setLineDash([]);
      ctx.lineWidth = settings.pathWidth / 2;
      ctx.lineCap = 'round';

      drawnPoints.forEach((point, i) => {
        if (i === 0) return;
        ctx.beginPath();
        ctx.strokeStyle = RAINBOW_COLORS[i % RAINBOW_COLORS.length];
        ctx.moveTo(drawnPoints[i - 1].x, drawnPoints[i - 1].y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      });
    }

    // Draw goal emoji at end
    const endPoint = pathPoints[pathPoints.length - 1];
    ctx.font = '50px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(level.goal, endPoint.x * canvas.width, endPoint.y * canvas.height);

    // Draw animal at current progress position
    const animalPos = getPositionOnPath(animalProgress);
    ctx.font = '60px serif';
    ctx.fillText(level.animal, animalPos.x, animalPos.y);
  }

  function getPositionOnPath(progress: number): Point {
    // Progress is 0 to 1
    const totalSegments = pathPoints.length - 1;
    const segmentProgress = progress * totalSegments;
    const segmentIndex = Math.min(Math.floor(segmentProgress), totalSegments - 1);
    const localProgress = segmentProgress - segmentIndex;

    const start = pathPoints[segmentIndex];
    const end = pathPoints[Math.min(segmentIndex + 1, pathPoints.length - 1)];

    return {
      x: (start.x + (end.x - start.x) * localProgress) * canvas.width,
      y: (start.y + (end.y - start.y) * localProgress) * canvas.height
    };
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
      if (completed) return;
      e.preventDefault();
      isDrawing = true;
      const pos = getPosition(e);
      drawnPoints = [pos];
    }

    function draw(e: TouchEvent | MouseEvent): void {
      if (!isDrawing || completed) return;
      e.preventDefault();

      const pos = getPosition(e);
      drawnPoints.push(pos);

      // Play sound
      const now = Date.now();
      if (now - lastDrawTime > 100) {
        playDraw();
        lastDrawTime = now;
      }

      // Check if drawing is near the path and update animal progress
      updateAnimalProgress(pos, settings);

      drawScene(settings);
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

  function updateAnimalProgress(pos: Point, settings: ReturnType<typeof getDifficultySettings>): void {
    // Find nearest point on path
    let nearestProgress = 0;
    let nearestDistance = Infinity;

    for (let p = 0; p <= 1; p += 0.02) {
      const pathPos = getPositionOnPath(p);
      const dist = Math.sqrt((pos.x - pathPos.x) ** 2 + (pos.y - pathPos.y) ** 2);

      if (dist < nearestDistance && p >= animalProgress - 0.1) {
        nearestDistance = dist;
        nearestProgress = p;
      }
    }

    // Only advance if close to the path (based on difficulty)
    if (nearestDistance < settings.pathSnapDistance && nearestProgress > animalProgress) {
      // Move animal toward the drawn position, scaled by speed
      const progressDelta = nearestProgress - animalProgress;
      animalProgress += progressDelta * Math.min(settings.animalSpeed, 1);
      if (animalProgress > 1) animalProgress = 1;

      // Check if reached the end
      if (animalProgress >= 0.95) {
        completed = true;
        playSuccess();
        showCelebration();
        earnedStars++;
        addStars(1);
        completeGame('path');

        const level = LEVELS[currentLevel % LEVELS.length];
        collectAnimal(level.animal);

        setTimeout(() => {
          currentLevel++;
          pathPoints = [];
          animalProgress = 0;
          drawnPoints = [];
          completed = false;
          render();
        }, 2500);
      }
    }
  }

  render();
  return container;
}
