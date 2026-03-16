// ── Hero Canvas — soft floating pixels ──
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  stars = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.floor(Math.random() * 3 + 1) * 2,
    speed: Math.random() * 0.3 + 0.1,
    alpha: Math.random() * 0.5 + 0.2,
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    ctx.fillStyle = `rgba(126, 200, 227, ${s.alpha})`;
    ctx.fillRect(s.x, s.y, s.size, s.size);
    s.y -= s.speed;
    if (s.y + s.size < 0) {
      s.y = canvas.height;
      s.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawStars();

// ── Typing Effect ──
const titles = ['Game Developer', 'C++ Programmer', 'Teacher'];
let tIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = titles[tIdx];
  typedEl.textContent = deleting ? current.slice(0, cIdx--) : current.slice(0, cIdx++);
  if (!deleting && cIdx > current.length) { setTimeout(() => { deleting = true; type(); }, 2000); return; }
  if (deleting && cIdx < 0) { deleting = false; tIdx = (tIdx + 1) % titles.length; }
  setTimeout(type, deleting ? 45 : 85);
}
setTimeout(type, 1200);

// ── Mobile Nav ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ── Active Nav ──
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  const y = window.scrollY + 100;
  sections.forEach(sec => {
    if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight)
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${sec.id}`));
  });
});

// ── Scroll Fade-in ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.game-card, .repo-widget, .teaching-card, .skill-group, .stat-card, .contact-card, .role-badge')
  .forEach(el => { el.classList.add('fade-in-up'); observer.observe(el); });

// ── Stat Counter ──
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.target;
    let count = 0;
    const iv = setInterval(() => {
      count = Math.min(count + Math.ceil(target / 30), target);
      el.textContent = count + (target >= 10 ? '+' : '');
      if (count >= target) clearInterval(iv);
    }, 50);
    statObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statObs.observe(el));

// ── Skill Bars ──
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.skill-fill').forEach(b => b.style.width = b.dataset.width + '%');
    skillObs.unobserve(e.target);
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-group').forEach(el => skillObs.observe(el));
