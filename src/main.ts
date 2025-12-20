// Animal Fun! - A learning game for kids
// Main entry point

import './style.css';
import { createMenu, GameType } from './components/GameMenu';
import { createTraceGame } from './games/TraceGame';
import { createMatchGame } from './games/MatchGame';
import { createPathGame } from './games/PathGame';
import { initAudio } from './utils/audio';
import { loadState } from './utils/state';

// Initialize the app
function init(): void {
  const app = document.getElementById('app')!;

  // Load saved state (difficulty, collected animals, etc)
  loadState();

  // Initialize audio system
  initAudio();

  // Show the main menu
  showMenu();

  function showMenu(): void {
    app.innerHTML = '';
    const menu = createMenu(handleGameSelect);
    app.appendChild(menu);
  }

  function handleGameSelect(game: GameType): void {
    app.innerHTML = '';

    switch (game) {
      case 'trace':
        app.appendChild(createTraceGame(showMenu));
        break;
      case 'match':
        app.appendChild(createMatchGame(showMenu));
        break;
      case 'path':
        app.appendChild(createPathGame(showMenu));
        break;
    }
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    // Re-render current view on resize
    const currentView = app.firstElementChild;
    if (currentView?.classList.contains('menu')) {
      showMenu();
    }
  });

  // Prevent zoom on double-tap (for mobile)
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd < 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
}

let lastTouchEnd = 0;

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
