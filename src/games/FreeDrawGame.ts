// Free Draw Game
// Kids can draw freely with a color palette

import { playDraw, playClick, playPop } from '../utils/audio';
import { isSoundEnabled } from '../utils/state';

interface Point {
  x: number;
  y: number;
}

const PALETTE_COLORS = [
  '#FF6B6B', // Red
  '#FFA94D', // Orange
  '#FFE066', // Yellow
  '#69DB7C', // Green
  '#74C0FC', // Blue
  '#B197FC', // Purple
  '#F783AC', // Pink
  '#FFFFFF', // White (eraser)
  '#333333', // Black
];

export function createFreeDrawGame(onBack: () => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'game-container fade-enter';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let isDrawing = false;
  let lastPoint: Point | null = null;
  let currentColor = PALETTE_COLORS[0];
  let brushSize = 12;
  let lastDrawTime = 0;

  function render(): void {
    container.innerHTML = '';

    // Header
    const header = document.createElement('div');
    header.className = 'game-header';

    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.textContent = '←';
    backBtn.onclick = handleBack;
    header.appendChild(backBtn);

    const title = document.createElement('div');
    title.className = 'game-title';
    title.textContent = '🎨 Free Draw!';
    header.appendChild(title);

    // Header buttons container
    const headerBtns = document.createElement('div');
    headerBtns.className = 'header-btns';

    // Clear button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'icon-btn clear-btn';
    clearBtn.textContent = '🗑️';
    clearBtn.title = 'Clear';
    clearBtn.onclick = () => {
      playPop();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    headerBtns.appendChild(clearBtn);

    // Save button
    const saveBtn = document.createElement('button');
    saveBtn.className = 'icon-btn save-btn';
    saveBtn.textContent = '📷';
    saveBtn.title = 'Save';
    saveBtn.onclick = async () => {
      playClick();
      await saveDrawing();
    };
    headerBtns.appendChild(saveBtn);

    header.appendChild(headerBtns);
    container.appendChild(header);

    // Canvas area
    const gameArea = document.createElement('div');
    gameArea.className = 'game-area freedraw-area';

    canvas = document.createElement('canvas');
    const width = Math.min(window.innerWidth - 40, 800);
    const height = Math.min(window.innerHeight - 280, 500);
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'draw-canvas';

    ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    gameArea.appendChild(canvas);
    container.appendChild(gameArea);

    // Color palette
    const palette = document.createElement('div');
    palette.className = 'color-palette';

    PALETTE_COLORS.forEach((color) => {
      const colorBtn = document.createElement('button');
      colorBtn.className = `color-btn ${color === currentColor ? 'selected' : ''}`;
      colorBtn.style.backgroundColor = color;
      if (color === '#FFFFFF') {
        colorBtn.style.border = '2px solid #ccc';
      }
      colorBtn.onclick = () => {
        playClick();
        currentColor = color;
        brushSize = color === '#FFFFFF' ? 30 : 12; // Bigger eraser
        // Update selection
        palette.querySelectorAll('.color-btn').forEach((btn) => btn.classList.remove('selected'));
        colorBtn.classList.add('selected');
      };
      palette.appendChild(colorBtn);
    });

    container.appendChild(palette);

    setupDrawingEvents();
    setupKeyboardEvents();
  }

  function handleBack(): void {
    playClick();
    cleanup();
    onBack();
  }

  function cleanup(): void {
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('mouseup', handleMouseup);
  }

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      handleBack();
    }
  }

  function handleMouseup(): void {
    isDrawing = false;
    lastPoint = null;
  }

  function setupKeyboardEvents(): void {
    document.addEventListener('keydown', handleKeydown);
  }

  async function saveDrawing(): Promise<void> {
    // Dynamic import to avoid circular dependencies
    const { shareOrDownloadCanvas } = await import('../utils/share');
    // Fun names for kid drawings
    const funNames = ['masterpiece', 'artwork', 'creation', 'picture', 'doodle'];
    const funName = funNames[Math.floor(Math.random() * funNames.length)];
    const timestamp = new Date().toTimeString().slice(0, 5).replace(':', '');
    await shareOrDownloadCanvas(canvas, `my-${funName}-${timestamp}`);
  }

  function setupDrawingEvents(): void {
    function getPosition(e: TouchEvent | MouseEvent): Point {
      const rect = canvas.getBoundingClientRect();
      if ('touches' in e && e.touches.length > 0) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
      return {
        x: (e as MouseEvent).clientX - rect.left,
        y: (e as MouseEvent).clientY - rect.top,
      };
    }

    function startDraw(e: TouchEvent | MouseEvent): void {
      e.preventDefault();
      isDrawing = true;
      lastPoint = getPosition(e);

      // Draw a dot for single taps
      ctx.beginPath();
      ctx.fillStyle = currentColor;
      ctx.arc(lastPoint.x, lastPoint.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw(e: TouchEvent | MouseEvent): void {
      if (!isDrawing) return;
      e.preventDefault();

      const pos = getPosition(e);

      // Draw line from last point
      if (lastPoint) {
        ctx.beginPath();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }

      lastPoint = pos;

      // Play sound occasionally
      const now = Date.now();
      if (now - lastDrawTime > 80 && isSoundEnabled()) {
        playDraw();
        lastDrawTime = now;
      }
    }

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', handleMouseup);
    canvas.addEventListener('touchcancel', handleMouseup);

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    // Use document-level mouseup so drawing ends even if mouse is outside canvas
    document.addEventListener('mouseup', handleMouseup);
  }

  render();
  return container;
}
