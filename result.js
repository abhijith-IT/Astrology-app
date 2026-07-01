// Astro Numerology Result Page
(function () {
  'use strict';

  // Constants and data (same as main script)
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const J2000 = 2451545;

  const signs = [
    { name: "Aries", glyph: "♈", element: "Fire", mode: "Cardinal", tone: "bold, initiating, fast-moving" },
    { name: "Taurus", glyph: "♉", element: "Earth", mode: "Fixed", tone: "steady, sensual, patient" },
    { name: "Gemini", glyph: "♊", element: "Air", mode: "Mutable", tone: "curious, verbal, adaptable" },
    { name: "Cancer", glyph: "♋", element: "Water", mode: "Cardinal", tone: "protective, intuitive, loyal" },
    { name: "Leo", glyph: "♌", element: "Fire", mode: "Fixed", tone: "expressive, warm, proud" },
    { name: "Virgo", glyph: "♍", element: "Earth", mode: "Mutable", tone: "analytical, helpful, exacting" },
    { name: "Libra", glyph: "♎", element: "Air", mode: "Cardinal", tone: "balanced, social, diplomatic" },
    { name: "Scorpio", glyph: "♏", element: "Water", mode: "Fixed", tone: "intense, private, transformative" },
    { name: "Sagittarius", glyph: "♐", element: "Fire", mode: "Mutable", tone: "free-spirited, wise, restless" },
    { name: "Capricorn", glyph: "♑", element: "Earth", mode: "Cardinal", tone: "ambitious, disciplined, strategic" },
    { name: "Aquarius", glyph: "♒", element: "Air", mode: "Fixed", tone: "original, detached, future-minded" },
    { name: "Pisces", glyph: "♓", element: "Water", mode: "Mutable", tone: "compassionate, imaginative, porous" }
  ];

  const houses = [
    "identity, body, first impressions",
    "money, values, food, self-worth",
    "communication, siblings, skills, short travel",
    "home, mother, emotional roots, property",
    "romance, creativity, children, fame",
    "work habits, health, service, discipline",
    "marriage, partnerships, clients, contracts",
    "shared wealth, intimacy, research, transformation",
    "luck, dharma, teachers, higher learning",
    "career, authority, status, public life",
    "income, networks, gains, long-term wishes",
    "spirituality, foreign lands, sleep, hidden patterns"
  ];

  const planetInfo = {
    Sun: { glyph: "☉", key: "soul, father, confidence, leadership" },
    Moon: { glyph: "☾", key: "mind, mother, emotions, comfort" },
    Mercury: { glyph: "☿", key: "speech, learning, business, logic" },
    Venus: { glyph: "♀", key: "love, beauty, pleasure, harmony" },
    Mars: { glyph: "♂", key: "drive, courage, competition, stamina" },
    Jupiter: { glyph: "♃", key: "wisdom, luck, mentors, expansion" },
    Saturn: { glyph: "♄", key: "karma, discipline, time, responsibility" },
    Rahu: { glyph: "☊", key: "ambition, obsession, innovation, worldly growth" },
    Ketu: { glyph: "☋", key: "detachment, spirituality, past-life mastery" },
    Uranus: { glyph: "♅", key: "breakthroughs, originality, disruption" },
    Neptune: { glyph: "♆", key: "dreams, intuition, art, surrender" },
    Pluto: { glyph: "♇", key: "power, rebirth, deep transformation" }
  };

  const numberMeanings = {
    1: { ruler: "Sun", text: "leadership, visibility, independence, and strong will" },
    2: { ruler: "Moon", text: "sensitivity, diplomacy, emotional intelligence, and partnership" },
    3: { ruler: "Jupiter", text: "learning, expression, optimism, and creative growth" },
    4: { ruler: "Rahu", text: "unusual thinking, systems, reinvention, and practical disruption" },
    5: { ruler: "Mercury", text: "communication, trade, travel, flexibility, and sharp decisions" },
    6: { ruler: "Venus", text: "love, comfort, beauty, responsibility, and relationship karma" },
    7: { ruler: "Ketu", text: "research, spirituality, solitude, analysis, and hidden wisdom" },
    8: { ruler: "Saturn", text: "discipline, authority, endurance, money lessons, and maturity" },
    9: { ruler: "Mars", text: "courage, action, protection, passion, and completion" }
  };

  // Helper functions
  function norm(value) {
    return ((value % 360) + 360) % 360;
  }

  function sinDeg(value) {
    return Math.sin(value * DEG);
  }

  function cosDeg(value) {
    return Math.cos(value * DEG);
  }

  function digitalRoot(value) {
    const digits = String(value).replace(/\D/g, "").split("").map(Number);
    let sum = digits.reduce((total, digit) => total + digit, 0);
    while (sum > 9) {
      sum = String(sum).split("").reduce((total, digit) => total + Number(digit), 0);
    }
    return sum || 0;
  }

  function signFor(longitude) {
    return signs[Math.floor(norm(longitude) / 30)];
  }

  function degreeInSign(longitude) {
    return norm(longitude) % 30;
  }

  function houseFor(longitude, ascendant) {
    return Math.floor(norm(longitude - ascendant) / 30) + 1;
  }

  function houseSign(house, ascendant) {
    return signFor(ascendant + (house - 1) * 30);
  }

  function formatLongitude(longitude) {
    const totalMinutes = Math.round(norm(longitude) * 60) % (360 * 60);
    const signIndex = Math.floor(totalMinutes / (30 * 60));
    const sign = signs[signIndex];
    const minutesInSign = totalMinutes - signIndex * 30 * 60;
    const whole = Math.floor(minutesInSign / 60);
    const minutes = minutesInSign % 60;
    return `${whole}°${String(minutes).padStart(2, "0")} ${sign.glyph} ${sign.name}`;
  }

  function describeDominant(planets) {
    const elementScores = {};
    const modeScores = {};
    planets.slice(0, 9).forEach((planet) => {
      const sign = signFor(planet.longitude);
      elementScores[sign.element] = (elementScores[sign.element] || 0) + 1;
      modeScores[sign.mode] = (modeScores[sign.mode] || 0) + 1;
    });
    const topElement = Object.entries(elementScores).sort((a, b) => b[1] - a[1])[0][0];
    const topMode = Object.entries(modeScores).sort((a, b) => b[1] - a[1])[0][0];
    return { topElement, topMode };
  }

  function interpretation(report) {
    const seventhSign = houseSign(7, report.asc);
    const tenthSign = houseSign(10, report.asc);
    const secondSign = houseSign(2, report.asc);
    const twelfthSign = houseSign(12, report.asc);
    const moonTone = report.moon.sign.tone;
    const venusHouse = houses[report.venus.house - 1];
    const careerHouse = houses[report.sun.house - 1];

    return [
      {
        title: "Personality",
        body: `${report.ascSign.glyph} ${report.ascSign.name} rising gives a ${report.ascSign.tone} outer style. Your Moon in ${report.moon.sign.name} makes the inner mind ${moonTone}, while Mulank ${report.mulank} adds ${numberMeanings[report.mulank].text}.`
      },
      {
        title: "Love Life",
        body: `Venus in the ${report.venus.house} house highlights ${venusHouse}. The 7th house begins in ${seventhSign.glyph} ${seventhSign.name}, so relationships improve when there is ${seventhSign.tone} energy. Bhagyank ${report.bhagyank} asks you to choose partners who support ${numberMeanings[report.bhagyank].text}.`
      },
      {
        title: "Career",
        body: `The 10th house begins in ${tenthSign.glyph} ${tenthSign.name}, favoring work that uses ${tenthSign.tone} strengths. Sun in the ${report.sun.house} house brings focus to ${careerHouse}; Mars in the ${report.mars.house} house shows where effort and competition push you forward.`
      },
      {
        title: "Success",
        body: `Jupiter in the ${report.jupiter.house} house expands ${houses[report.jupiter.house - 1]}, while Saturn in the ${report.saturn.house} house rewards patience in ${houses[report.saturn.house - 1]}. Your success pattern is strongest when enthusiasm is paired with routine.`
      },
      {
        title: "Money",
        body: `The 2nd house starts in ${secondSign.glyph} ${secondSign.name}, suggesting that money grows through ${secondSign.tone} choices. Rahu in the ${report.rahu.house} house can create unusual ambitions, so avoid impulsive risk and build repeatable systems.`
      },
      {
        title: "Health & Energy",
        body: `The chart is ${report.dominant.topElement}-dominant and ${report.dominant.topMode.toLowerCase()} in rhythm. Balance improves when daily habits match that tempo: steady movement for Earth, breath and variety for Air, emotional rest for Water, and physical challenge for Fire.`
      },
      {
        title: "Family & Home",
        body: `The 4th house describes emotional roots and home life. With ${houseSign(4, report.asc).glyph} ${houseSign(4, report.asc).name} there, peace comes from a home environment that allows ${houseSign(4, report.asc).tone} expression without constant pressure.`
      },
      {
        title: "Spiritual Growth",
        body: `The 12th house begins in ${twelfthSign.glyph} ${twelfthSign.name}. Ketu in the ${report.planetRows.find((planet) => planet.name === "Ketu").house} house points to natural detachment around ${houses[report.planetRows.find((planet) => planet.name === "Ketu").house - 1]}, which can become wisdom when handled consciously.`
      }
    ];
  }

  function metricCards(report) {
    return [
      ["Mulank", report.mulank, `${numberMeanings[report.mulank].ruler} ruled: ${numberMeanings[report.mulank].text}.`],
      ["Bhagyank", report.bhagyank, `${numberMeanings[report.bhagyank].ruler} ruled life path: ${numberMeanings[report.bhagyank].text}.`],
      ["Naamank", report.naamank, `Name vibration supports ${numberMeanings[report.naamank].text}.`],
      ["Ascendant", `${report.ascSign.glyph} ${report.ascSign.name}`, `${formatLongitude(report.asc)} sets the equal-house chart.`]
    ];
  }

  function drawChart(canvas, report) {
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const center = size / 2;
    const outer = size * 0.45;
    const inner = size * 0.22;
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#fffdf8";
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    ctx.translate(center, center);
    ctx.strokeStyle = "#d8cfc0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, outer, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, inner, 0, TAU);
    ctx.stroke();

    for (let i = 0; i < 12; i += 1) {
      const angle = ((i * 30 - report.asc) - 90) * DEG;
      ctx.strokeStyle = i % 3 === 0 ? "#aeb8b6" : "#e2dbcf";
      ctx.lineWidth = i % 3 === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
      ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
      ctx.stroke();

      const sign = houseSign(i + 1, report.asc);
      ctx.fillStyle = "#657282";
      ctx.font = "17px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const labelAngle = angle + 15 * DEG;
      ctx.fillText(sign.glyph, Math.cos(labelAngle) * (outer - 18), Math.sin(labelAngle) * (outer - 18));
    }

    report.planetRows.forEach((planet, index) => {
      const angle = (planet.longitude - report.asc - 90) * DEG;
      const radius = inner + 18 + (index % 4) * 18;
      ctx.fillStyle = ["#0f766e", "#c3842d", "#b34f67", "#345d9d"][index % 4];
      ctx.font = "18px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(planetInfo[planet.name].glyph, Math.cos(angle) * radius, Math.sin(angle) * radius);
    });

    ctx.fillStyle = "#152331";
    ctx.font = "700 13px Inter, sans-serif";
    ctx.fillText("ASC", 0, -8);
    ctx.font = "12px Inter, sans-serif";
    ctx.fillStyle = "#657282";
    ctx.fillText(report.ascSign.name, 0, 10);
    ctx.restore();
  }

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
          <div class="chart-wrap">
            <canvas id="chartCanvas" width="360" height="360" aria-label="Astrology chart wheel"></canvas>
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

    // Draw the chart
    const chartCanvas = document.querySelector("#chartCanvas");
    if (chartCanvas) {
      drawChart(chartCanvas, report);
    }
  }

  // Get report data from sessionStorage
  function getReportData() {
    const stored = sessionStorage.getItem('astroReport');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    const skyCanvas = document.querySelector("#skyCanvas");
    if (skyCanvas) {
      // Draw sky background
      const ctx = skyCanvas.getContext("2d");
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

      ctx.strokeStyle = "rgba(255, 232, 180, 0.28)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 7; i += 1) {
        ctx.beginPath();
        const y = 36 + i * 34;
        ctx.arc(rect.width * 0.78, y, 120 + i * 16, Math.PI * 0.84, Math.PI * 1.6);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(245, 203, 112, 0.18)";
      ctx.beginPath();
      ctx.arc(rect.width * 0.86, rect.height * 0.24, 80, 0, TAU);
      ctx.fill();
    }

    // Load and render report
    const reportData = getReportData();
    if (reportData && reportData.fullName) {
      renderReport(reportData);
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

  window.addEventListener("resize", () => {
    const skyCanvas = document.querySelector("#skyCanvas");
    if (skyCanvas) {
      const ctx = skyCanvas.getContext("2d");
      const rect = skyCanvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      skyCanvas.width = Math.round(rect.width * scale);
      skyCanvas.height = Math.round(rect.height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      
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
    }
  });
})();