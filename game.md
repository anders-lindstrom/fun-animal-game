# Animal Fun! - Learning Game for Kids

A touch-friendly learning game built with TypeScript and Vite, designed for tablets (tested on Samsung 11").

## Overview

Three mini-games focused on developing fine motor skills and pattern recognition:

1. **Draw! (Trace Game)** - Trace dotted shapes by following the dots
2. **Match! (Match Game)** - Find and tap matching animal pairs
3. **Help! (Path Game)** - Guide animals home by drawing along a path

## Tech Stack

- **Vite** - Fast development server and build tool
- **TypeScript** - Type-safe JavaScript
- **HTML5 Canvas** - For drawing/tracing games
- **Web Audio API** - Synthesized sound effects (no audio files needed)
- **localStorage** - Progress persistence

## Project Structure

```
fun_app/
├── index.html              # Entry HTML with mobile viewport settings
├── package.json            # Dependencies (vite, typescript)
├── tsconfig.json           # TypeScript configuration
├── game.md                 # This documentation
├── src/
│   ├── main.ts             # App initialization and routing
│   ├── style.css           # All styles (rainbow theme, animations)
│   ├── components/
│   │   ├── GameMenu.ts     # Home screen with difficulty selector
│   │   └── Celebration.ts  # Confetti and star animations
│   ├── games/
│   │   ├── TraceGame.ts    # Shape tracing game
│   │   ├── MatchGame.ts    # Memory matching game
│   │   └── PathGame.ts     # Path following game
│   └── utils/
│       ├── audio.ts        # Web Audio sound effects
│       └── state.ts        # State management + localStorage
```

## Difficulty Levels

### Easy (😊)
- Large touch targets (20px dots, 45px snap distance)
- Simple shapes: circle, square, triangle
- 2 pairs to match (4 cards)
- Wide paths with generous tolerance

### Medium (😄)
- Medium targets (15px dots, 35px snap distance)
- Adds: house, fish, heart
- 3 pairs to match (6 cards)
- Moderate path difficulty

### Hard (😎)
- Smaller targets (12px dots, 25px snap distance)
- Adds: cat, star, butterfly
- 4 pairs to match (8 cards)
- Narrower paths

### Grown-up (🧠)
- Tiny targets (5px dots, 10px snap distance!)
- Complex shapes only: treble clef, infinity, dragon, spiral, cursive letters
- 8 pairs to match (16 cards, tiny 70px)
- Very narrow paths requiring precision

## Features

### Child-Friendly Design
- No failure states - just encouragement
- Large touch targets (min 80px buttons)
- Bright rainbow color palette
- Fun sound effects for feedback
- Celebration animations (confetti, stars)
- Progress auto-saves

### Settings
- Sound toggle (ON/OFF)
- Fullscreen mode for tablets
- Difficulty persists between sessions

### Reward System
- Stars earned for completing levels
- Animals "collected" and displayed on home screen
- Progress tracked per game type

## Running the Game

```bash
# Install dependencies
npm install

# Development server
npm run dev

# For tablet access (exposes on network)
npm run dev -- --host

# Production build
npm run build
```

## Key Design Decisions

### No External Assets
All sounds are synthesized using Web Audio API oscillators. This keeps the bundle tiny and avoids loading delays.

### Canvas-Based Drawing
HTML5 Canvas provides smooth drawing performance on touch devices with proper touch event handling (passive: false).

### State Management
Simple module-level state with localStorage persistence. No framework overhead.

### Responsive Layout
CSS flexbox/grid with viewport units. Tested on 11" tablets in landscape orientation.

## Game Mechanics

### Trace Game
1. Dots appear in rainbow colors along shape outline
2. Current target dot has yellow ring highlight
3. Touch within snap distance to "hit" the dot
4. Rainbow line follows finger as you draw
5. Complete all dots for celebration + star

### Match Game
1. Cards shuffled and displayed in grid
2. Tap first card to select (yellow glow)
3. Tap second card - if match, both turn green + wiggle
4. Wrong match briefly shows, then deselects
5. Match all pairs for celebration

### Path Game
1. Animal starts at left, goal at right
2. Dotted path with colored guide dots
3. Draw along path to move animal forward
4. Stay close to path (snap distance)
5. Reach goal for celebration

## Extending the Game

### Adding New Shapes (TraceGame.ts)
```typescript
{
  name: 'NewShape',
  emoji: '🆕',
  difficulty: 'medium',  // 'easy' | 'medium' | 'hard' | 'grownup'
  points: [
    { x: 0.5, y: 0.2 },  // Normalized 0-1 coordinates
    { x: 0.8, y: 0.8 },
    // ... more points
  ]
}
```

### Adding New Animals (MatchGame.ts)
Just add emojis to the `ALL_ANIMALS` array.

### Adding New Path Levels (PathGame.ts)
```typescript
{ animal: '🦁', goal: '🌿', goalLabel: 'grass' }
```

## Browser Support

Requires modern browser with:
- ES2020 support
- Web Audio API
- Touch events
- CSS Grid/Flexbox
- localStorage

Tested on: Chrome, Safari, Samsung Internet
