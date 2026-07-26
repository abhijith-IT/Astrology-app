export function initializeBackground() {
  const canvas = document.getElementById('cosmicBg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  
  let width, height;
  let stars = [];
  let shootingStars = [];
  let animationFrameId;
  let isVisible = true;

  // Parallax state
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  // Reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initStars();
  }

  function initStars() {
    stars = [];
    const numStars = Math.floor((width * height) / 3000); // Dynamic density
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        baseAlpha: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        angle: Math.random() * Math.PI * 2,
        parallaxFactor: Math.random() * 0.5 + 0.1
      });
    }
  }

  function spawnShootingStar() {
    if (prefersReducedMotion || !isVisible) return;
    shootingStars.push({
      x: width + Math.random() * width * 0.5,
      y: -Math.random() * height * 0.5,
      length: Math.random() * 80 + 40,
      speed: Math.random() * 10 + 15,
      opacity: 1
    });
  }

  function draw() {
    // Fill deep space background
    const bgGradient = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, Math.max(width, height));
    bgGradient.addColorStop(0, '#0B1020');
    bgGradient.addColorStop(1, '#050816');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Parallax interpolation
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    // Draw static/twinkling stars
    stars.forEach(star => {
      star.angle += star.twinkleSpeed;
      const alpha = star.baseAlpha + Math.sin(star.angle) * 0.2;
      
      const px = star.x + (prefersReducedMotion ? 0 : currentX * star.parallaxFactor);
      const py = star.y + (prefersReducedMotion ? 0 : currentY * star.parallaxFactor);
      
      // Wrap around
      const wrapX = (px % width + width) % width;
      const wrapY = (py % height + height) % height;

      ctx.beginPath();
      ctx.arc(wrapX, wrapY, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, alpha)})`;
      ctx.fill();
    });

    // Draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.x -= ss.speed;
      ss.y += ss.speed;
      ss.opacity -= 0.01;

      if (ss.opacity <= 0 || ss.x < -ss.length || ss.y > height + ss.length) {
        shootingStars.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x + ss.length, ss.y - ss.length);
      ctx.strokeStyle = `rgba(255, 255, 255, ${ss.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    if (isVisible) {
      animationFrameId = requestAnimationFrame(draw);
    }
  }

  // Event Listeners
  window.addEventListener('resize', resize);
  
  if (!prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / width - 0.5) * 40;
      mouseY = (e.clientY / height - 0.5) * 40;
    });
  }

  // Visibility API for performance
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
    if (isVisible) {
      draw();
    } else {
      cancelAnimationFrame(animationFrameId);
    }
  });

  // Spawn shooting stars randomly
  setInterval(() => {
    if (Math.random() > 0.3) spawnShootingStar();
  }, 8000);

  // Init
  resize();
  draw();
}
