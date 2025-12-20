// Fun celebration animations - confetti and stars!

const COLORS = ['#FF6B6B', '#FFA94D', '#FFE066', '#69DB7C', '#74C0FC', '#B197FC', '#F783AC'];

export function showCelebration(): void {
  const container = document.createElement('div');
  container.className = 'celebration';
  document.body.appendChild(container);

  // Create confetti pieces
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    container.appendChild(confetti);
  }

  // Create star bursts
  for (let i = 0; i < 8; i++) {
    const star = document.createElement('div');
    star.className = 'star-burst';
    star.textContent = '⭐';
    star.style.left = `${10 + Math.random() * 80}%`;
    star.style.top = `${10 + Math.random() * 80}%`;
    star.style.animationDelay = `${Math.random() * 0.3}s`;
    container.appendChild(star);
  }

  // Remove after animation
  setTimeout(() => {
    container.remove();
  }, 3000);
}

export function showStars(x: number, y: number): void {
  const container = document.createElement('div');
  container.className = 'celebration';
  document.body.appendChild(container);

  // Create stars around the point
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('div');
    star.className = 'star-burst';
    star.textContent = '✨';
    star.style.left = `${x + (Math.random() - 0.5) * 100}px`;
    star.style.top = `${y + (Math.random() - 0.5) * 100}px`;
    star.style.fontSize = '40px';
    star.style.animationDelay = `${i * 0.1}s`;
    container.appendChild(star);
  }

  setTimeout(() => {
    container.remove();
  }, 1500);
}
