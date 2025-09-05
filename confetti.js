function burstConfetti() {
  const container = document.getElementById('confetti');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.width = '6px';
    el.style.height = '10px';
    el.style.left = 50 + (Math.random() - 0.5) * 40 + '%';
    el.style.top = 20 + Math.random() * 12 + '%';
    el.style.background = ['#00f0ff', '#a24bff', '#00ff88', '#ff7a3d'][
      Math.floor(Math.random() * 4)
    ];
    el.style.opacity = '0.95';
    el.style.transform = 'translateY(0) rotate(' + Math.random() * 360 + 'deg)';
    el.style.borderRadius = '2px';
    el.style.pointerEvents = 'none';
    container.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'transform 1500ms ease-out, opacity 1400ms';
      el.style.transform = 'translateY(300px) rotate(720deg)';
      el.style.opacity = '0';
    }, 60 + Math.random() * 200);
    setTimeout(() => {
      el.remove();
    }, 1800);
  }
}
