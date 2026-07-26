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
    // Fallback if UI is missing
    setTimeout(onComplete, 500);
    return;
  }

  // Clear existing static steps and replace with dynamic single progress
  engineStepsContainer.innerHTML = `
    <div class="engine-step active" id="dynamicStep">
      <span class="step-icon">✨</span>
      <div class="step-content">
        <p id="dynamicStepText">Starting engine...</p>
        <div class="step-progress"><div class="step-fill" id="dynamicStepFill"></div></div>
      </div>
      <div class="progress-percent" id="dynamicStepPercent" style="font-family: var(--font-cinzel); color: var(--accent-cyan); width: 40px; text-align: right; font-weight: bold;">0%</div>
    </div>
  `;

  const stepFill = document.getElementById('dynamicStepFill');
  const stepText = document.getElementById('dynamicStepText');
  const stepPercent = document.getElementById('dynamicStepPercent');
  
  let currentProgress = 0;
  let stepIndex = 0;

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  let startTime = null;
  const duration = 2200; // Total 2.2s animation

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    
    // Non-linear easing so it slows at the end
    currentProgress = easeOutCubic(rawProgress) * 100;
    
    // Update UI
    stepFill.style.width = `${currentProgress}%`;
    stepPercent.innerText = `${Math.floor(currentProgress)}%`;

    // Update text based on targets
    if (stepIndex < steps.length && currentProgress >= steps[stepIndex].target) {
      stepText.innerText = steps[stepIndex].text;
      stepIndex++;
    }

    if (rawProgress < 1) {
      requestAnimationFrame(animate);
    } else {
      setTimeout(onComplete, 300);
    }
  }

  requestAnimationFrame(animate);
}
