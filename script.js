/* ============================================================
   PixelNestDev — Site Script
   ============================================================ */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ===================== Site-wide starfield background ===================== */
(function () {
  const c = document.getElementById("dust-canvas");
  if (!c) return;
  const ctx = c.getContext("2d");
  let w, h, dpr, cx, cy;

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    c.width = w * dpr;
    c.height = h * dpr;
    c.style.width = w + "px";
    c.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w / 2;
    cy = h / 2;
  }
  size();
  window.addEventListener("resize", size);

  const COUNT = prefersReducedMotion ? 0 : 260;
  const FOCAL = 260;
  const BASE_SPEED = 0.09;
  const BURST_MS = 2200;
  const BURST_MULT = 7;

  function spawnStar() {
    return {
      x: (Math.random() - 0.5) * w * 1.6,
      y: (Math.random() - 0.5) * h * 1.6,
      z: 0.15 + Math.random() * 1,
      gold: Math.random() < 0.3,
      tw: Math.random() * Math.PI * 2,
    };
  }
  const stars = Array.from({ length: COUNT }, spawnStar);

  const start = performance.now();
  function speedNow(now) {
    const elapsed = now - start;
    if (elapsed >= BURST_MS) return BASE_SPEED;
    const p = elapsed / BURST_MS;
    const ease = 1 - Math.pow(1 - p, 2);
    return BASE_SPEED * (1 + (1 - ease) * (BURST_MULT - 1));
  }

  function draw(now) {
    const speed = speedNow(now);
    ctx.fillStyle = "rgba(10,10,10,0.35)";
    ctx.fillRect(0, 0, w, h);

    for (const s of stars) {
      s.z -= speed * 0.016;
      if (s.z <= 0.02) {
        Object.assign(s, spawnStar(), { z: 1 });
      }
      const sx = cx + (s.x / s.z) * (FOCAL / 300);
      const sy = cy + (s.y / s.z) * (FOCAL / 300);
      if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) continue;

      const depth = 1 - s.z;
      const r = Math.max(0.3, depth * 1.8);
      const tw = 0.5 + 0.4 * Math.sin(now * 0.002 + s.tw);
      const alpha = Math.min(0.85, depth * 0.9) * tw;

      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = s.gold
        ? `rgba(201,168,76,${alpha})`
        : `rgba(201,206,214,${alpha * 0.85})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  if (!prefersReducedMotion) {
    requestAnimationFrame(draw);
  } else {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);
  }
})();

/* ===================== Hero icon parallax ===================== */
(function () {
  const icon = document.querySelector(".hero-icon-wrap img");
  if (!icon || prefersReducedMotion) return;

  let targetX = 0, targetY = 0, curX = 0, curY = 0;

  window.addEventListener("mousemove", (e) => {
    const nx = (e.clientX / window.innerWidth) - 0.5;
    const ny = (e.clientY / window.innerHeight) - 0.5;
    targetX = nx * 24;
    targetY = ny * 24;
  });

  function animate() {
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;
    icon.style.transform = `translate(${curX}px, ${curY}px) rotate(${curX * 0.15}deg)`;
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===================== Hamburger menu ===================== */
(function () {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
})();

/* ===================== Scroll reveal ===================== */
(function () {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("show"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

/* ===================== Staggered hero entrance on load ===================== */
window.addEventListener("DOMContentLoaded", () => {
  const heroEls = document.querySelectorAll(".hero-animate");
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add("show"), prefersReducedMotion ? 0 : i * 150);
  });
});

/* ===================== Smooth scroll for in-page anchors ===================== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId.length <= 1) return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
