import '../styles/style.css';
import '../chart/chart.css';
import { initializeBackground } from '../ui/background.js';
import { runLoadingSequence } from '../ui/loading.js';
import { TAU, planetInfo, formatLongitude, interpretation, metricCards } from '../astrology/index.js';

function renderReport(report) {
  const container = document.querySelector("#reportContainer");
  if (!container) return;

  // Create report HTML
  const reportHTML = `
    <article class="report">
      <section class="panel hero-report">
        <div>
          <p class="eyebrow report-kicker">${report.place} • ${String(report.day).padStart(2, "0")}/${String(report.month).padStart(2, "0")}/${report.year}</p>
          <h2 class="report-name">${report.fullName}</h2>
          <p class="report-summary">You carry a ${report.dominant.topElement.toLowerCase()}-leaning chart with ${report.dominant.topMode.toLowerCase()} momentum. This reading blends birth numbers with planetary house placement to outline your temperament, relationships, work, money, and growth themes.</p>
        </div>
        <div class="chart-wrap" id="interactiveChartContainer" style="position: relative; width: 100%; aspect-ratio: 1/1; max-width: 600px; margin: 0 auto;">
          <!-- SVG chart will be injected here -->
        </div>
      </section>

      <section class="metric-grid">
        ${metricCards(report).map(([label, value, text]) => `
          <article class="metric panel">
            <span>${label}</span>
            <strong>${value}</strong>
            <p>${text}</p>
          </article>
        `).join('')}
      </section>

      <section class="panel">
        <div class="section-title">
          <span>♆</span>
          <h3>Planets In Houses</h3>
        </div>
        <div class="planet-table">
          ${report.planetRows.map((planet) => `
            <article class="planet-row">
              <div class="planet-glyph">${planetInfo[planet.name].glyph}</div>
              <div>
                <h4>${planet.name} in ${planet.sign.glyph} ${planet.sign.name}</h4>
                <p>${formatLongitude(planet.longitude)} • ${planetInfo[planet.name].key}</p>
              </div>
              <div class="house-pill">${planet.house} House</div>
            </article>
          `).join('')}
        </div>
      </section>

      <section class="reading-grid">
        ${interpretation(report).map((item) => `
          <article class="reading-card panel">
            <h3>${item.title}</h3>
            <p>${item.body}</p>
          </article>
        `).join('')}
      </section>

      <section class="panel note-panel">
        <h3>Reading Note</h3>
        <p>This app uses simplified astronomical estimates and an equal-house system for self-reflection and entertainment. Professional astrology software uses high-precision ephemerides and exact geocoding.</p>
      </section>

      <div class="action-row" style="margin-top: 24px;">
        <button onclick="window.print()" class="primary-button">🖨️ Print Report</button>
        <a href="index.html" class="ghost-button" style="text-decoration: none; display: inline-block; text-align: center; line-height: 44px;">← New Reading</a>
      </div>
    </article>
  `;

  container.innerHTML = reportHTML;
}

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
      }
    });
  } else {
    // Show error if no data
    const container = document.querySelector("#reportContainer");
    if (container) {
      container.innerHTML = `
        <div class="empty-state panel">
          <div class="empty-visual">⚠️</div>
          <h2>No Report Data Found</h2>
          <p>Please fill out the form on the <a href="index.html">main page</a> to generate your birth blueprint.</p>
        </div>
      `;
    }
  }
});