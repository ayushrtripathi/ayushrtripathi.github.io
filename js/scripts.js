/* InMetis Research Labs — Interactive Elements */

(function () {
  'use strict';

  // ── Wireframe Globe ──
  function initGlobe() {
    const canvas = document.getElementById('globe-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, cx, cy, radius;
    let angleX = 0;
    let angleY = 0.3;

    const latLines = 18;
    const lonLines = 24;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      cx = width / 2;
      cy = height / 2;
      radius = Math.min(width, height) * 0.42;
    }

    function project(lat, lon) {
      const x3 = radius * Math.cos(lat) * Math.cos(lon + angleY);
      const y3 = radius * Math.sin(lat);
      const z3 = radius * Math.cos(lat) * Math.sin(lon + angleY);

      const x2 = x3;
      const y2 = y3 * Math.cos(angleX) - z3 * Math.sin(angleX);
      const z2 = y3 * Math.sin(angleX) + z3 * Math.cos(angleX);

      const scale = 1 / (1 + z2 / (radius * 3));
      return { x: cx + x2 * scale, y: cy + y2 * scale, z: z2 };
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      angleY += 0.003;

      // Latitude lines
      for (let i = 1; i < latLines; i++) {
        const lat = -Math.PI / 2 + (Math.PI * i) / latLines;
        ctx.beginPath();
        let started = false;
        for (let j = 0; j <= 64; j++) {
          const lon = (2 * Math.PI * j) / 64;
          const p = project(lat, lon);
          if (p.z < -radius * 0.1) {
            started = false;
            continue;
          }
          if (!started) { ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = 'rgba(200, 255, 0, 0.08)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Longitude lines
      for (let i = 0; i < lonLines; i++) {
        const lon = (2 * Math.PI * i) / lonLines;
        ctx.beginPath();
        let started = false;
        for (let j = 0; j <= 64; j++) {
          const lat = -Math.PI / 2 + (Math.PI * j) / 64;
          const p = project(lat, lon);
          if (p.z < -radius * 0.1) {
            started = false;
            continue;
          }
          if (!started) { ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = 'rgba(200, 255, 0, 0.08)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Dots at intersections
      for (let i = 0; i <= latLines; i++) {
        const lat = -Math.PI / 2 + (Math.PI * i) / latLines;
        for (let j = 0; j < lonLines; j++) {
          const lon = (2 * Math.PI * j) / lonLines;
          const p = project(lat, lon);
          if (p.z < 0) continue;
          const alpha = 0.15 + (p.z / radius) * 0.35;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 255, 0, ${alpha})`;
          ctx.fill();
        }
      }

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
  }

  // ── Featured Carousel ──
  function initFeatured() {
    const items = document.querySelectorAll('.featured-item');
    const prev = document.getElementById('featPrev');
    const next = document.getElementById('featNext');
    if (!items.length) return;

    let current = 0;

    function show(index) {
      items.forEach(item => item.classList.remove('active'));
      current = (index + items.length) % items.length;
      items[current].classList.add('active');
    }

    if (prev) prev.addEventListener('click', () => show(current - 1));
    if (next) next.addEventListener('click', () => show(current + 1));

    setInterval(() => show(current + 1), 6000);
  }

  // ── Mobile Navigation ──
  function initNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    const actions = document.getElementById('navActions');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
      actions.classList.toggle('open');
    });

    links.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
        actions.classList.remove('open');
      });
    });
  }

  // ── Scroll Animations ──
  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  }

  // ── Contact Form ──
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const original = btn.innerHTML;
      btn.textContent = 'Message Sent ✓';
      btn.style.opacity = '0.7';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.opacity = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', () => {
    initGlobe();
    initFeatured();
    initNav();
    initScrollAnimations();
    initContactForm();
  });
})();
