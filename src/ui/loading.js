export function runLoadingSequence(onComplete) {
  const steps = [
    { target: 5, text: "Initializing celestial engine..." },
    { target: 20, text: "Calculating planetary positions..." },
    { target: 45, text: "Computing houses..." },
    { target: 65, text: "Analyzing numerology..." },
    { target: 82, text: "Matching personality traits..." },
    { target: 94, text: "Building personalized report..." },
    { target: 100, text: "Blueprint ready." }
  ];

  const loadingEngine = document.querySelector('.loading-engine');
  const engineStepsContainer = document.getElementById('engineSteps');
  
  if (!loadingEngine || !engineStepsContainer) {
    setTimeout(onComplete, 500);
    return;
  }

  engineStepsContainer.innerHTML = `
    <div class="flex flex-col items-center justify-center animate-fade-in" style="height: 100vh;">
      <div id="dynamicStepText" class="text-mono text-secondary" style="font-size: var(--text-body-sm); letter-spacing: 0.05em; text-transform: uppercase;">Initializing celestial engine...</div>
    </div>
  `;

  // Timeout safeguard for stuck loading states
  const safeguardTimeout = setTimeout(() => {
    if (loadingEngine && !loadingEngine.classList.contains('is-complete')) {
      engineStepsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center animate-fade-in" style="height: 100vh; text-align: center;">
          <p class="text-caption text-secondary mb-4" style="letter-spacing: 0.1em; color: var(--color-text-secondary);">PROCESSING TAKING LONGER THAN EXPECTED</p>
          <p class="text-body text-secondary mb-6" style="max-width: 400px; line-height: 1.6;">Your calculations are still running, but you can return to the form if you prefer.</p>
          <a href="index.html" class="btn btn-secondary hover-spring" style="text-decoration: none;">Return to Details</a>
        </div>
      `;
    }
  }, 10000);

  const stepText = document.getElementById('dynamicStepText');
  
  let currentProgress = 0;
  let stepIndex = 0;

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  let startTime = null;
  const duration = 2200;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    
    currentProgress = easeOutCubic(rawProgress) * 100;
    
    while (stepIndex < steps.length - 1 && currentProgress >= steps[stepIndex].target) {
      stepIndex++;
      if (stepText) stepText.textContent = steps[stepIndex].text;
    }

    if (currentProgress < 100) {
      requestAnimationFrame(animate);
    } else {
      if (stepText) stepText.textContent = "Blueprint ready.";
      
      // Fade out loading, fade in report — using CSS classes
      setTimeout(() => {
        clearTimeout(safeguardTimeout);
        if (loadingEngine) {
          loadingEngine.classList.add('is-complete');
        }
        
        setTimeout(() => {
          if (loadingEngine) loadingEngine.style.display = 'none';
          
          const reportContainer = document.getElementById('reportContainer');
          if (reportContainer) {
            reportContainer.classList.add('is-visible');
          }
          onComplete();
        }, 800);
      }, 500);
    }
  }

  requestAnimationFrame(animate);
}
