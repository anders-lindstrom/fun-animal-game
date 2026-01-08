// Animated Animal Habitat
// A living environment where collected animals float and can be tapped

import { playAnimalSound, playClick } from '../utils/audio';
import { getCollectedAnimals } from '../utils/state';

interface AnimatedAnimal {
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  bouncePhase: number;
  bounceSpeed: number;
}

export function createHabitat(onBack: () => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'game-container fade-enter';

  const collected = getCollectedAnimals();
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animals: AnimatedAnimal[] = [];
  let animationId: number;

  function initAnimals(): void {
    animals = collected.map((emoji) => ({
      emoji,
      x: 0.1 + Math.random() * 0.8, // 10%-90% of canvas width
      y: 0.15 + Math.random() * 0.55, // 15%-70% of canvas height (above grass)
      vx: (Math.random() - 0.5) * 0.002,
      vy: (Math.random() - 0.5) * 0.002,
      size: 45 + Math.random() * 15,
      baseSize: 45 + Math.random() * 15,
      bouncePhase: Math.random() * Math.PI * 2,
      bounceSpeed: 0.03 + Math.random() * 0.02,
    }));
  }

  function render(): void {
    container.innerHTML = '';

    // Header
    const header = document.createElement('div');
    header.className = 'game-header';

    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.textContent = '←';
    backBtn.onclick = () => {
      playClick();
      cancelAnimationFrame(animationId);
      onBack();
    };
    header.appendChild(backBtn);

    const title = document.createElement('div');
    title.className = 'game-title';
    title.textContent = `🏡 My Habitat (${collected.length})`;
    header.appendChild(title);

    container.appendChild(header);

    // Canvas habitat
    const gameArea = document.createElement('div');
    gameArea.className = 'game-area habitat-area';

    canvas = document.createElement('canvas');
    const width = Math.min(window.innerWidth - 40, 800);
    const height = Math.min(window.innerHeight - 150, 550);
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'habitat-canvas';

    ctx = canvas.getContext('2d')!;
    gameArea.appendChild(canvas);
    container.appendChild(gameArea);

    // Hint
    const hint = document.createElement('div');
    hint.className = 'habitat-hint';
    hint.textContent = '👆 Tap animals to hear them!';
    container.appendChild(hint);

    initAnimals();
    setupTouchEvents();
    animate();
  }

  function drawBackground(): void {
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.85);
    skyGradient.addColorStop(0, '#87CEEB'); // Light blue
    skyGradient.addColorStop(0.7, '#B0E0E6'); // Powder blue
    skyGradient.addColorStop(1, '#98D8AA'); // Light green transition
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sun
    ctx.fillStyle = '#FFE066';
    ctx.beginPath();
    ctx.arc(canvas.width * 0.85, canvas.height * 0.12, 35, 0, Math.PI * 2);
    ctx.fill();

    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    drawCloud(canvas.width * 0.2, canvas.height * 0.1, 40);
    drawCloud(canvas.width * 0.5, canvas.height * 0.18, 30);
    drawCloud(canvas.width * 0.7, canvas.height * 0.08, 35);

    // Grass
    const grassGradient = ctx.createLinearGradient(0, canvas.height * 0.85, 0, canvas.height);
    grassGradient.addColorStop(0, '#69DB7C');
    grassGradient.addColorStop(1, '#40C057');
    ctx.fillStyle = grassGradient;
    ctx.fillRect(0, canvas.height * 0.85, canvas.width, canvas.height * 0.15);

    // Grass blades
    ctx.strokeStyle = '#2F9E44';
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 20) {
      const x = i + Math.random() * 10;
      const grassHeight = 8 + Math.random() * 12;
      ctx.beginPath();
      ctx.moveTo(x, canvas.height * 0.85);
      ctx.quadraticCurveTo(
        x + (Math.random() - 0.5) * 10,
        canvas.height * 0.85 - grassHeight / 2,
        x + (Math.random() - 0.5) * 5,
        canvas.height * 0.85 - grassHeight
      );
      ctx.stroke();
    }
  }

  function drawCloud(x: number, y: number, size: number): void {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y - size * 0.2, size * 0.7, 0, Math.PI * 2);
    ctx.arc(x + size * 1.4, y, size * 0.6, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y + size * 0.3, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function animate(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    // Update and draw each animal
    animals.forEach((animal) => {
      // Update position
      animal.x += animal.vx;
      animal.y += animal.vy;

      // Bounce off walls
      if (animal.x < 0.08 || animal.x > 0.92) {
        animal.vx *= -1;
        animal.x = Math.max(0.08, Math.min(0.92, animal.x));
      }
      if (animal.y < 0.1 || animal.y > 0.72) {
        animal.vy *= -1;
        animal.y = Math.max(0.1, Math.min(0.72, animal.y));
      }

      // Gentle floating motion
      animal.bouncePhase += animal.bounceSpeed;
      const bounceOffset = Math.sin(animal.bouncePhase) * 5;

      // Gradually return to base size after tap animation
      if (animal.size > animal.baseSize) {
        animal.size -= 1;
      }

      // Draw animal
      const drawX = animal.x * canvas.width;
      const drawY = animal.y * canvas.height + bounceOffset;

      ctx.font = `${animal.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(animal.emoji, drawX, drawY);
    });

    animationId = requestAnimationFrame(animate);
  }

  function setupTouchEvents(): void {
    function handleTap(e: TouchEvent | MouseEvent): void {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const tapX = (clientX - rect.left) / canvas.width;
      const tapY = (clientY - rect.top) / canvas.height;

      // Check if tapped on an animal
      let tappedAnimal: AnimatedAnimal | null = null;
      let minDist = Infinity;

      for (const animal of animals) {
        const dist = Math.sqrt((tapX - animal.x) ** 2 + (tapY - animal.y) ** 2);
        if (dist < 0.08 && dist < minDist) {
          minDist = dist;
          tappedAnimal = animal;
        }
      }

      if (tappedAnimal) {
        // Play sound
        playAnimalSound(tappedAnimal.emoji);
        // Bounce animation - make bigger and jump
        tappedAnimal.size = tappedAnimal.baseSize + 20;
        tappedAnimal.vy = -0.015; // Jump up
      }
    }

    canvas.addEventListener('touchstart', handleTap, { passive: false });
    canvas.addEventListener('click', handleTap);
  }

  if (collected.length === 0) {
    // Empty state
    const emptyContainer = document.createElement('div');
    emptyContainer.className = 'habitat-empty';

    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.textContent = '←';
    backBtn.onclick = () => {
      playClick();
      onBack();
    };
    emptyContainer.appendChild(backBtn);

    const emptyContent = document.createElement('div');
    emptyContent.className = 'empty-content';
    emptyContent.innerHTML = `
      <div class="empty-icon">🏡</div>
      <div class="empty-text">Your habitat is empty!</div>
      <div class="empty-hint">Play games to collect animals</div>
    `;
    emptyContainer.appendChild(emptyContent);

    return emptyContainer;
  }

  render();
  return container;
}
