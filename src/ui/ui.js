(function initUI() {
  // Auto-focus logic for date to time (only on index page)
  const birthDateInput = document.getElementById('birthDate');
  const birthTimeInput = document.getElementById('birthTime');
  
  if (birthDateInput && birthTimeInput) {
    birthDateInput.addEventListener('change', () => {
      if (birthDateInput.value) {
        // slight delay to let native picker close
        setTimeout(() => birthTimeInput.focus(), 150);
      }
    });
  }

  // Ripple effect for buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = '2px';
      ripple.style.height = '2px';
      ripple.style.background = 'rgba(255, 255, 255, 0.4)';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.transition = 'width 0.4s ease-out, height 0.4s ease-out, opacity 0.4s ease-out';
      ripple.style.pointerEvents = 'none';
      
      this.appendChild(ripple);
      
      // Trigger animation
      requestAnimationFrame(() => {
        ripple.style.width = '300px';
        ripple.style.height = '300px';
        ripple.style.opacity = '0';
      });
      
      setTimeout(() => ripple.remove(), 400);
    });
  });
})();
