const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let w, h;
function resize() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
}
window.addEventListener('resize', resize);
resize();
let stars = [];
let shooting = [];
let mouseX = 0,
  mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - w / 2) / w;
  mouseY = (e.clientY - h / 2) / h;
});
function initStars() {
  stars = [];
  const count = Math.max(80, Math.round((w * h) / 15000));
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      ox: Math.random() * w,
      oy: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.1,
    });
  }
}
initStars();
function spawnShooting() {
  if (Math.random() < 0.01)
    shooting.push({
      x: Math.random() * w,
      y: Math.random() * h * 0.4,
      vx: -6 - Math.random() * 4,
      vy: 1 + Math.random() * 2,
      life: 0,
    });
}
function draw() {
  ctx.clearRect(0, 0, w, h); // nebula gradient
  let g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#020417');
  g.addColorStop(0.5, '#08102a');
  g.addColorStop(1, '#0b0420');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // soft nebula blobs
  for (let i = 0; i < 3; i++) {
    let gx = Math.sin(performance.now() * 0.0002 + i) * w * 0.2 + w * 0.5;
    let gy = Math.cos(performance.now() * 0.00015 + i) * h * 0.15 + h * 0.45;
    let rg = Math.max(w, h) * 0.6;
    let gr = ctx.createRadialGradient(gx, gy, 10, gx, gy, rg);
    gr.addColorStop(0, 'rgba(60,20,120,0.04)');
    gr.addColorStop(1, 'rgba(5,5,10,0)');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
  }
  // draw stars with subtle parallax
  for (let s of stars) {
    let px = s.x + mouseX * 40 * (s.r * 0.8);
    let py = s.y + mouseY * 30 * (s.r * 0.8);
    ctx.beginPath();
    ctx.arc(px, py, s.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200,230,255,' + (0.7 + s.r * 0.1) + ')';
    ctx.fill();
  }
  // constellations: connect nearby stars
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      let a = stars[i],
        b = stars[j];
      let dx = a.x - b.x,
        dy = a.y - b.y;
      let d = Math.hypot(dx, dy);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(a.x + mouseX * 10, a.y + mouseY * 8);
        ctx.lineTo(b.x + mouseX * 10, b.y + mouseY * 8);
        ctx.strokeStyle = 'rgba(120,180,255,' + (0.12 - (d / 120) * 0.08) + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
  // shooting stars
  spawnShooting();
  for (let i = shooting.length - 1; i >= 0; i--) {
    let p = shooting[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life += 1;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
    ctx.strokeStyle = 'rgba(200,240,255,0.9)';
    ctx.lineWidth = 2.2;
    ctx.stroke();
    if (p.life > 80) shooting.splice(i, 1);
  }
  // loop
  requestAnimationFrame(draw);
}
draw();
