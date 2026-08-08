import '../styles/main.css';
import '../chart/chart.css';
import { initializeBackground } from '../ui/background.js';
import { runLoadingSequence } from '../ui/loading.js';
import { TAU, planetInfo, formatLongitude, interpretation, metricCards, numberMeanings } from '../astrology/index.js';

function renderReport(report) {
  const container = document.querySelector("#reportContainer");
  if (!container) return;

  // Create report HTML
  // Editorial Magazine Layout
  const reportHTML = `
    <a href="#chapter-1-title" class="sr-only focus:not-sr-only skip-link no-print">Skip to report</a>
    <main class="editorial-container" style="width: 100%;">
      
      <!-- HERO VIEWPORT (Sprint 2: Majestic Linear Flow) -->
      <header aria-label="Hero Introduction" style="display: flex; flex-direction: column; align-items: center; padding-top: var(--space-8); padding-bottom: var(--space-12);">
        
        <!-- TITLE -->
        <div class="animate-slide-up stagger-in" style="--stagger-step: 1; text-align: center; margin-bottom: var(--space-6);">
          <h1 class="font-serif" style="font-size: clamp(2rem, 5vw, 4rem); letter-spacing: 0.25em; color: var(--color-primary); line-height: 1; margin: 0;">YOUR</h1>
          <h1 class="font-serif" style="font-size: clamp(2.5rem, 6vw, 4.5rem); letter-spacing: 0.15em; color: var(--color-text-primary); line-height: 1; margin: 0;">BIRTH BLUEPRINT</h1>
        </div>

        <!-- METADATA HEADER -->
        <div class="animate-slide-up stagger-in flex justify-between items-center" style="--stagger-step: 1; width: 100%; border-top: 1px solid var(--color-border-strong); border-bottom: 1px solid var(--color-border-strong); padding: var(--space-4) 0; margin-bottom: var(--space-16);">
          <div>
            <p class="text-caption text-secondary m-0" style="letter-spacing: 0.2em; font-size: 0.75rem;">PREPARED FOR</p>
            <p class="font-serif m-0" style="font-size: 1.25rem; color: var(--color-text-primary); letter-spacing: 0.05em;">${report.fullName}</p>
          </div>
          <div style="text-align: right;">
            <p class="text-caption text-secondary m-0" style="letter-spacing: 0.2em; font-size: 0.75rem;">ORIGIN</p>
            <p class="font-serif m-0" style="font-size: 1.25rem; color: var(--color-text-primary); letter-spacing: 0.05em;">${report.place}</p>
            <p class="text-mono text-muted m-0" style="font-size: 0.8rem; margin-top: 2px;">${String(report.day).padStart(2, "0")}/${String(report.month).padStart(2, "0")}/${report.year}</p>
          </div>
        </div>

        <!-- HERO HOOK -->
        <div class="animate-slide-up stagger-in" style="--stagger-step: 2; text-align: center; margin-bottom: var(--space-16);">
          <p class="font-serif" style="font-size: clamp(1.75rem, 4vw, 2.75rem); font-style: italic; color: var(--color-text-primary); line-height: 1.3; max-width: 900px; margin: 0 auto;">
            "The ${report.dominant.topElement} Architect. Driven by ${report.ascSign.name} energy."
          </p>
        </div>

        <!-- CELESTIAL MAP CENTERPIECE -->
        <div class="animate-fade-in stagger-in" style="--stagger-step: 4; width: 100%; max-width: 750px; aspect-ratio: 1/1; margin: 0 auto var(--space-16); position: relative; opacity: 0.95;">
          <div class="sr-only">Astrology chart displaying a ${report.dominant.topElement}-heavy signature with ${report.ascSign.name} rising.</div>
          <div id="interactiveChartContainer" style="position: absolute; inset: 0;" aria-hidden="true"></div>
        </div>

        <!-- FOUR KEY METRICS ROW -->
        <div class="animate-slide-up stagger-in metrics-row" style="--stagger-step: 3; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-6); width: 100%; max-width: 900px; text-align: center; margin-bottom: var(--space-16);">
          <div>
            <p class="text-caption text-secondary m-0" style="letter-spacing: 0.2em; font-size: 0.7rem; margin-bottom: var(--space-2);">ASCENDANT</p>
            <p class="font-serif m-0" style="font-size: 1.75rem; color: var(--color-text-primary);">${report.ascSign.name}</p>
          </div>
          <div>
            <p class="text-caption text-secondary m-0" style="letter-spacing: 0.2em; font-size: 0.7rem; margin-bottom: var(--space-2);">DOMINANT</p>
            <p class="font-serif m-0" style="font-size: 1.75rem; color: var(--color-text-primary);">${report.dominant.topElement}</p>
          </div>
          <div>
            <p class="text-caption text-secondary m-0" style="letter-spacing: 0.2em; font-size: 0.7rem; margin-bottom: var(--space-2);">MULANK</p>
            <p class="font-serif m-0" style="font-size: 1.75rem; color: var(--color-text-primary);">${report.mulank}</p>
            <p class="text-caption text-primary m-0" style="margin-top: 4px; font-size: 0.7rem;">${numberMeanings[report.mulank].title}</p>
          </div>
          <div>
            <p class="text-caption text-secondary m-0" style="letter-spacing: 0.2em; font-size: 0.7rem; margin-bottom: var(--space-2);">BHAGYANK</p>
            <p class="font-serif m-0" style="font-size: 1.75rem; color: var(--color-text-primary);">${report.bhagyank}</p>
            <p class="text-caption text-primary m-0" style="margin-top: 4px; font-size: 0.7rem;">${numberMeanings[report.bhagyank].title}</p>
          </div>
        </div>
        
        <!-- READING JOURNEY INDICATOR -->
        <div class="no-print" style="display: flex; align-items: center; justify-content: center; gap: var(--space-4); flex-wrap: wrap; opacity: 0.8;">
          <span class="text-caption" style="color: var(--color-text-primary); letter-spacing: 0.1em;">Essence</span>
          <span class="text-muted" style="font-size: 0.8rem;">→</span>
          <span class="text-caption text-secondary" style="letter-spacing: 0.1em;">Numbers</span>
          <span class="text-muted" style="font-size: 0.8rem;">→</span>
          <span class="text-caption text-secondary" style="letter-spacing: 0.1em;">Map</span>
          <span class="text-muted" style="font-size: 0.8rem;">→</span>
          <span class="text-caption text-secondary" style="letter-spacing: 0.1em;">Reading</span>
        </div>

      </header>

      <!-- CHAPTER I : NUMEROLOGICAL FOUNDATION -->
      <div class="chapter-divider" aria-hidden="true" style="margin-top: var(--space-8);"></div>
      <section class="scroll-reveal" aria-labelledby="chapter-1-title" style="margin-bottom: var(--space-20);">
        <div class="chapter-header" style="margin-bottom: var(--space-12);">
          <p class="chapter-number">I</p>
          <h2 id="chapter-1-title" class="chapter-title">Numerological Foundation</h2>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-12); align-items: center;">
          <!-- Left: Mulank Hero -->
          <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px solid var(--color-border-subtle); padding-right: var(--space-6);">
            <span class="font-serif text-primary" style="font-size: 8rem; line-height: 1;">${report.mulank}</span>
            <span class="text-caption text-secondary" style="letter-spacing: 0.2em; text-transform: uppercase;">The ${numberMeanings[report.mulank].title}</span>
          </div>
          
          <!-- Right: Narrative -->
          <div>
            <p class="text-caption text-secondary m-0" style="letter-spacing: 0.1em; margin-bottom: var(--space-6);">
              Before the stars align, your foundational numbers establish your innate temperament.
            </p>
            <p class="text-body text-secondary" style="line-height: 1.8; font-size: 1.1rem; margin-bottom: var(--space-4);">
              Your Mulank (${report.mulank}), known as ${numberMeanings[report.mulank].title}, governs your day-to-day interactions and fundamental worldview. Meanwhile, your Bhagyank (${report.bhagyank}), ${numberMeanings[report.bhagyank].title}, acts as an undercurrent pulling you toward your ultimate life lessons and purpose.
            </p>
            
            <!-- Recommendation -->
            <div class="recommendation-box">
              <p class="recommendation-box-title">PRACTICAL ALIGNMENT</p>
              <p class="text-body-sm text-secondary m-0" style="line-height: 1.6;">
                Lean into the core traits of ${report.mulank} for immediate problem-solving, but trust the intuition of ${report.bhagyank} for long-term career and relationship decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CHAPTER II : CELESTIAL ARCHITECTURE -->
      <div class="chapter-divider" aria-hidden="true"></div>
      <section class="scroll-reveal" aria-labelledby="chapter-2-title" style="margin-bottom: var(--space-20);">
        <div class="chapter-header" style="margin-bottom: var(--space-12);">
          <p class="chapter-number">II</p>
          <h2 id="chapter-2-title" class="chapter-title">Celestial Architecture</h2>
        </div>
        
        <p class="text-caption text-secondary text-center m-0" style="letter-spacing: 0.1em; margin-bottom: var(--space-8);">
          The precise positions of the celestial bodies at your exact moment of birth dictate the flow of your life force.
        </p>
        
        <!-- Insight -->
        <p class="font-serif text-center" style="font-size: 1.75rem; font-style: italic; color: var(--color-primary); max-width: 600px; margin: 0 auto var(--space-12);">
          "Anchored by a ${report.dominant.topElement}-heavy signature, you navigate the world through ${report.dominant.topMode.toLowerCase()} energy."
        </p>

        <!-- Ledger -->
        <ul class="ledger-list" style="margin-top: 0; margin-bottom: var(--space-12); max-width: 500px; margin-left: auto; margin-right: auto;">
          ${report.planetRows.map((planet) => `
            <li class="ledger-row">
              <span style="color: var(--color-primary); width: 24px;" aria-hidden="true">${planetInfo[planet.name].glyph}</span>
              <strong>${planet.name}</strong>
              <div class="ledger-leader" aria-hidden="true"></div>
              <span>${planet.sign.name}</span>
              <div class="ledger-leader" aria-hidden="true"></div>
              <span class="ledger-value">${planet.house} House</span>
            </li>
          `).join('')}
        </ul>
        
        <!-- Recommendation -->
        <div class="recommendation-box center" style="max-width: 600px;">
          <p class="recommendation-box-title">PRACTICAL ALIGNMENT</p>
          <p class="text-body-sm text-secondary m-0" style="line-height: 1.6;">
            With heavy ${report.dominant.topElement} placements, seek out environments that allow you to channel this element—whether through grounding exercises, creative flow, intellectual debate, or dynamic movement.
          </p>
        </div>
      </section>

      <!-- CHAPTER III : THE SYNTHESIS -->
      <div class="chapter-divider" aria-hidden="true"></div>
      <section class="scroll-reveal" aria-labelledby="chapter-3-title" style="margin-bottom: var(--space-12);">
        <div class="chapter-header" style="margin-bottom: var(--space-12);">
          <p class="chapter-number">III</p>
          <h2 id="chapter-3-title" class="chapter-title">The Synthesis</h2>
        </div>
        
        <p class="text-caption text-secondary text-center m-0" style="letter-spacing: 0.1em; margin-bottom: var(--space-12);">
          Your natal chart is not a static destiny, but a living script. Here is how your placements interact.
        </p>
        
        <div class="flex-col" style="gap: var(--space-16);">
          ${interpretation(report).map((item, index) => {
            const isEven = index % 2 === 1;
            const extractedQuote = item.body.split('.')[0] + '.';
            
            return `
              <div style="display: flex; flex-direction: column; align-items: ${isEven ? 'flex-end' : 'flex-start'}; text-align: ${isEven ? 'right' : 'left'};">
                <div style="max-width: 85%; ${isEven ? 'border-right: 2px solid var(--color-primary); padding-right: var(--space-6);' : 'border-left: 2px solid var(--color-primary); padding-left: var(--space-6);'}">
                  <h3 class="text-caption" style="letter-spacing: 0.15em; color: var(--color-primary); margin-top: 0; margin-bottom: var(--space-3); text-transform: uppercase;">${item.title}</h3>
                  <div class="drop-cap" style="${isEven ? 'text-align: right;' : 'text-align: left;'}">
                    <p class="text-body text-secondary" style="line-height: 1.8; font-size: 1.1rem; margin: 0;">${item.body}</p>
                  </div>
                </div>
              </div>
              
              ${index === 1 ? `
                <!-- Injected Highlighted Insight halfway through -->
                <div style="width: 100%; border-top: 1px dashed var(--color-border-strong); border-bottom: 1px dashed var(--color-border-strong); padding: var(--space-8) 0; margin: var(--space-4) 0; text-align: center;">
                  <p class="font-serif" style="font-size: 1.5rem; color: var(--color-text-primary); margin: 0; font-style: italic;">
                    "${extractedQuote}"
                  </p>
                </div>
              ` : ''}
            `;
          }).join('')}
        </div>
        
        <!-- Closing Recommendation -->
        <div class="recommendation-box center" style="margin-top: var(--space-16); max-width: 500px;">
          <p class="recommendation-box-title">CLOSING THOUGHT</p>
          <p class="text-body-sm text-secondary m-0" style="line-height: 1.6;">
            Your chart maps the potential, but your free will acts as the catalyst. Return to this synthesis whenever you feel misaligned with your path.
          </p>
        </div>
      </section>

      <!-- READING NOTE -->
      <div class="chapter-divider" aria-hidden="true"></div>
      <section class="scroll-reveal" aria-label="Reading Note" style="margin-bottom: var(--space-8); padding-top: var(--space-4);">
        <p class="text-caption text-primary" style="text-align: center; letter-spacing: 0.15em; margin-bottom: var(--space-4); margin-top: 0;">HOW TO READ THIS REPORT</p>
        <p class="text-body-sm text-muted" style="line-height: 1.8; font-style: italic; text-align: center; max-width: 650px; margin: 0 auto;">
          Astrology and numerology are symbolic tools for self-reflection and entertainment. This application uses simplified astronomical estimates and an equal-house system. Professional astrology software should be used for exact geocoded ephemerides.
        </p>
      </section>

      <!-- FOOTER ACTIONS -->
      <div class="no-print" style="border-top: 1px solid var(--color-border-subtle); padding-top: var(--space-6); padding-bottom: var(--space-12);">
        <div class="flex justify-between items-center" style="flex-wrap: wrap; gap: var(--space-4);">
          <button onclick="tryPrintKeepsake()" class="btn btn-ghost text-caption hover-spring focus-halo" style="letter-spacing: 0.1em; color: var(--color-text-primary);" aria-label="Print or save as PDF">
            [ PRINT KEEPSAKE ]
          </button>
          <a href="index.html" class="btn btn-ghost text-caption hover-spring focus-halo" style="letter-spacing: 0.1em; color: var(--color-text-secondary); text-decoration: none;" aria-label="Start a new reading">
            [ NEW READING ]
          </a>
        </div>
        <div id="printErrorContainer" class="form-error" aria-live="polite" style="text-align: left; width: 100%; margin-top: 8px;"></div>
      </div>
      
      <!-- PRINT-ONLY REPEATING FOOTER -->
      <div class="print-only print-footer" aria-hidden="true" style="display: none;">
        COSMIC BLUEPRINT
      </div>
    </main>
  `;

  container.innerHTML = reportHTML;

  // Initialize IntersectionObserver for scroll-reveal elements
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // Unobserve properly
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
  
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
}

window.tryPrintKeepsake = function() {
  const errorContainer = document.getElementById('printErrorContainer');
  if (errorContainer) {
    errorContainer.innerHTML = "";
    errorContainer.closest('.form-group')?.classList.remove('has-error');
  }
  
  try {
    const printed = window.print();
    // Some browsers return boolean from print, most return undefined, but if it throws we catch it.
  } catch (err) {
    console.error("Print generation failed:", err);
    if (errorContainer) {
      errorContainer.closest('.no-print')?.classList.add('has-error');
      errorContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.05); padding: var(--space-3); border-radius: var(--radius-sm); border-left: 2px solid var(--color-danger);">
          <span>Unable to generate PDF/print. Please check your browser settings.</span>
          <button onclick="tryPrintKeepsake()" class="btn btn-secondary hover-spring" style="padding: var(--space-2) var(--space-4); min-height: auto;">Try Again</button>
        </div>
      `;
      errorContainer.style.opacity = "1";
    }
  }
};

// Get report data from sessionStorage
function getReportData() {
  const stored = sessionStorage.getItem('astroReport');
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
}

function initSkyCanvas() {
  const skyCanvas = document.querySelector("#skyCanvas");
  if (skyCanvas) {
    const ctx = skyCanvas.getContext("2d");
    const draw = () => {
      const rect = skyCanvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      skyCanvas.width = Math.round(rect.width * scale);
      skyCanvas.height = Math.round(rect.height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, "#102235");
      gradient.addColorStop(0.52, "#173d46");
      gradient.addColorStop(1, "#5b3043");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      const stars = 84;
      for (let i = 0; i < stars; i += 1) {
        const x = (i * 97) % rect.width;
        const y = (i * 53) % rect.height;
        const r = 0.8 + (i % 4) * 0.35;
        ctx.fillStyle = `rgba(255, 250, 220, ${0.28 + (i % 5) * 0.12})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
      }
    };
    draw();
    window.addEventListener("resize", draw);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeBackground();
  initSkyCanvas();

  const reportData = getReportData();
  
  if (reportData && reportData.fullName) {
    runLoadingSequence(async () => {
      renderReport(reportData);
      
      // Lazy load chart module
      try {
        const { renderInteractiveChart } = await import('../chart/chart.js');
        const chartContainer = document.getElementById('interactiveChartContainer');
        if (chartContainer) {
          renderInteractiveChart(chartContainer, reportData, { animate: true });
        }
      } catch (err) {
        console.error("Failed to load interactive chart:", err);
        const chartContainer = document.getElementById('interactiveChartContainer');
        if (chartContainer) {
          chartContainer.innerHTML = `
            <div style="display: flex; height: 100%; align-items: center; justify-content: center; text-align: center; border: 1px dashed var(--color-border-strong); padding: var(--space-4);">
              <p class="text-caption text-secondary" style="letter-spacing: 0.1em; color: var(--color-text-muted);">CHART RENDERING UNAVAILABLE</p>
            </div>
          `;
        }
      }
    });
  } else {
    // Show error if no data using editorial fallback
    const container = document.querySelector("#reportContainer");
    if (container) {
      container.innerHTML = `
        <main class="editorial-container" style="width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
          <h1 class="font-serif" style="font-size: clamp(2rem, 5vw, 3rem); letter-spacing: 0.15em; color: var(--color-primary); margin-bottom: var(--space-6);">Blueprint Unavailable</h1>
          <p class="text-body text-secondary" style="max-width: 500px; margin-bottom: var(--space-8); line-height: 1.8;">
            Your celestial coordinates and numerological alignments could not be located in this session.
          </p>
          <a href="index.html" class="btn btn-secondary hover-spring" style="text-decoration: none;">Return to Origin</a>
        </main>
      `;
    }
  }
});