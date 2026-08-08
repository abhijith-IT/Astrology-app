import { TAU, DEG, houseSign, planetInfo, degreeInSign } from '../astrology/index.js';
import { getPlanetInterpretation } from '../astrology/planetInterpretations.js';

const SVG_NS = "http://www.w3.org/2000/svg";
let tooltipEl = null;

function createTooltip() {
  if (document.getElementById('chartTooltip')) return document.getElementById('chartTooltip');
  const t = document.createElement('div');
  t.id = 'chartTooltip';
  t.className = 'chart-tooltip';
  t.innerHTML = `
    <div class="tooltip-header" id="tt-head"></div>
    <div class="tooltip-body" id="tt-body"></div>
  `;
  document.body.appendChild(t);
  return t;
}

function getAspect(p1, p2) {
  let diff = Math.abs(p1.longitude - p2.longitude);
  if (diff > 180) diff = 360 - diff;
  
  if (diff <= 8) return { type: 'conjunction', name: 'Conjunction', color: '#FACC15', dash: '' };
  if (diff >= 54 && diff <= 66) return { type: 'sextile', name: 'Sextile', color: '#38BDF8', dash: '' };
  if (diff >= 82 && diff <= 98) return { type: 'square', name: 'Square', color: '#F97316', dash: '4,4' };
  if (diff >= 112 && diff <= 128) return { type: 'trine', name: 'Trine', color: '#22C55E', dash: '' };
  if (diff >= 172 && diff <= 188) return { type: 'opposition', name: 'Opposition', color: '#EF4444', dash: '4,4' };
  return null;
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = (angleDeg - 90) * DEG;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  };
}

export function renderInteractiveChart(container, report, options = {}) {
  if (!container) return;
  container.innerHTML = "";
  tooltipEl = createTooltip();

  const config = Object.assign({
    showAspects: true,
    animate: true,
    showHouseNumbers: true,
    showLabels: true
  }, options);

  const size = 600;
  const center = size / 2;
  const outerR = size * 0.45;
  const innerR = size * 0.22;
  
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("class", "interactive-chart-svg");
  svg.setAttribute("role", "group");
  svg.setAttribute("aria-label", `Interactive natal astrology chart for ${report.fullName || "User"}, showing planetary positions, houses, and zodiac placements.`);
  svg.setAttribute("shape-rendering", "geometricPrecision");
  svg.setAttribute("text-rendering", "optimizeLegibility");
  
  const title = document.createElementNS(SVG_NS, "title");
  title.textContent = `Interactive natal astrology chart for ${report.fullName || "User"}, showing planetary positions, houses, and zodiac placements.`;
  svg.appendChild(title);
  
  const desc = document.createElementNS(SVG_NS, "desc");
  desc.textContent = `Astrology chart displaying a ${report.dominant.topElement}-heavy signature with ${report.ascSign.name} rising.`;
  svg.appendChild(desc);
  
  if (!config.animate) {
    svg.style.animation = "none";
  }

  // SVG Layers
  const backgroundLayer = document.createElementNS(SVG_NS, "g");
  const zodiacRingLayer = document.createElementNS(SVG_NS, "g");
  const houseRingLayer = document.createElementNS(SVG_NS, "g");
  const aspectLayer = document.createElementNS(SVG_NS, "g");
  const connectorLayer = document.createElementNS(SVG_NS, "g");
  const planetLayer = document.createElementNS(SVG_NS, "g");
  const labelLayer = document.createElementNS(SVG_NS, "g");
  const interactionLayer = document.createElementNS(SVG_NS, "g");

  // Background Circles
  const outerCircle = document.createElementNS(SVG_NS, "circle");
  outerCircle.setAttribute("cx", center); outerCircle.setAttribute("cy", center);
  outerCircle.setAttribute("r", outerR); outerCircle.setAttribute("class", "chart-ring");
  
  const innerCircle = document.createElementNS(SVG_NS, "circle");
  innerCircle.setAttribute("cx", center); innerCircle.setAttribute("cy", center);
  innerCircle.setAttribute("r", innerR); innerCircle.setAttribute("class", "chart-ring");
  
  backgroundLayer.appendChild(outerCircle);
  backgroundLayer.appendChild(innerCircle);

  // Zodiac and Houses
  for (let i = 0; i < 12; i++) {
    const angle = i * 30 - report.asc;
    
    const pInner = polarToCartesian(center, center, innerR, angle);
    const pOuter = polarToCartesian(center, center, outerR, angle);
    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", pInner.x); line.setAttribute("y1", pInner.y);
    line.setAttribute("x2", pOuter.x); line.setAttribute("y2", pOuter.y);
    line.setAttribute("class", `house-line ${i % 3 === 0 ? 'angle' : ''}`);
    houseRingLayer.appendChild(line);

    const midAngle = angle + 15;
    
    if (config.showHouseNumbers) {
      const numPos = polarToCartesian(center, center, innerR + 15, midAngle);
      const txt = document.createElementNS(SVG_NS, "text");
      txt.setAttribute("x", numPos.x); txt.setAttribute("y", numPos.y);
      txt.setAttribute("class", "house-number");
      txt.textContent = i + 1;
      houseRingLayer.appendChild(txt);
    }

    if (config.showLabels) {
      const sign = houseSign(i + 1, report.asc);
      const glyphPos = polarToCartesian(center, center, outerR - 20, midAngle);
      const glyphTxt = document.createElementNS(SVG_NS, "text");
      glyphTxt.setAttribute("x", glyphPos.x); glyphTxt.setAttribute("y", glyphPos.y);
      glyphTxt.setAttribute("class", "zodiac-glyph");
      glyphTxt.textContent = sign.glyph;
      zodiacRingLayer.appendChild(glyphTxt);
    }

    // Angles
    if (i % 3 === 0 && config.showLabels) {
      const labelStr = i === 0 ? "ASC" : i === 3 ? "IC" : i === 6 ? "DSC" : "MC";
      const anglePos = polarToCartesian(center, center, innerR - 25, angle);
      const angleTxt = document.createElementNS(SVG_NS, "text");
      angleTxt.setAttribute("x", anglePos.x); angleTxt.setAttribute("y", anglePos.y);
      angleTxt.setAttribute("class", "house-number");
      angleTxt.setAttribute("style", "font-weight: 700; fill: var(--accent-cyan); font-size: 10px;");
      angleTxt.textContent = labelStr;
      houseRingLayer.appendChild(angleTxt);
    }
  }

  // Aspects
  if (config.showAspects) {
    const planetsList = report.planetRows;
    for (let i = 0; i < planetsList.length; i++) {
      for (let j = i + 1; j < planetsList.length; j++) {
        const aspect = getAspect(planetsList[i], planetsList[j]);
        if (aspect) {
          const a1 = planetsList[i].longitude - report.asc;
          const a2 = planetsList[j].longitude - report.asc;
          const p1 = polarToCartesian(center, center, innerR - 5, a1);
          const p2 = polarToCartesian(center, center, innerR - 5, a2);
          
          const line = document.createElementNS(SVG_NS, "line");
          line.setAttribute("x1", p1.x); line.setAttribute("y1", p1.y);
          line.setAttribute("x2", p2.x); line.setAttribute("y2", p2.y);
          line.setAttribute("class", "aspect-line");
          line.setAttribute("stroke", aspect.color);
          if (aspect.dash) line.setAttribute("stroke-dasharray", aspect.dash);
          line.setAttribute("style", `animation-delay: ${1.5 + (i * 0.1)}s`);
          aspectLayer.appendChild(line);
        }
      }
    }
  }

  // Planets Anti-Collision
  const sortedPlanets = [...report.planetRows].sort((a, b) => a.longitude - b.longitude);
  const radii = new Array(sortedPlanets.length).fill(innerR + 25);
  const baseR = innerR + 25;
  const shiftStep = 22;

  for (let i = 0; i < sortedPlanets.length; i++) {
    for (let j = 0; j < i; j++) {
      let diff = Math.abs(sortedPlanets[i].longitude - sortedPlanets[j].longitude);
      if (diff > 180) diff = 360 - diff;
      if (diff < 6 && radii[i] === radii[j]) {
        radii[i] += shiftStep;
      }
    }
  }

  sortedPlanets.forEach((planet, idx) => {
    const trueAngle = planet.longitude - report.asc;
    const r = radii[idx];
    
    const truePos = polarToCartesian(center, center, baseR - 5, trueAngle);
    const labelPos = polarToCartesian(center, center, r, trueAngle);

    // Connector line if shifted
    if (r > baseR) {
      const conn = document.createElementNS(SVG_NS, "line");
      conn.setAttribute("x1", truePos.x); conn.setAttribute("y1", truePos.y);
      conn.setAttribute("x2", labelPos.x); conn.setAttribute("y2", labelPos.y);
      conn.setAttribute("stroke", "rgba(255,255,255,0.2)");
      conn.setAttribute("stroke-width", "1");
      connectorLayer.appendChild(conn);
    }
    
    const g = document.createElementNS(SVG_NS, "g");
    g.setAttribute("class", "planet-group");
    g.setAttribute("transform", `translate(${labelPos.x}, ${labelPos.y})`);
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", `${planet.name} in ${planet.sign.name}, ${degreeInSign(planet.longitude).toFixed(0)} degrees, House ${planet.house}. Press Enter for details.`);
    g.style.animation = config.animate ? `fadeInAspects 0.5s ease forwards ${2 + idx*0.1}s` : 'none';
    if(config.animate) g.style.opacity = '0';

    const bg = document.createElementNS(SVG_NS, "circle");
    bg.setAttribute("r", 14);
    bg.setAttribute("class", "planet-bg");
    
    const icon = document.createElementNS(SVG_NS, "text");
    icon.setAttribute("class", "planet-glyph");
    icon.setAttribute("fill", ["#38BDF8", "#FACC15", "#EC4899", "#8B5CF6"][idx % 4]);
    icon.textContent = planetInfo[planet.name].glyph;

    // Transparent interaction layer overlay (44x44 minimum touch target)
    const hitArea = document.createElementNS(SVG_NS, "circle");
    hitArea.setAttribute("r", 22);
    hitArea.setAttribute("fill", "transparent");

    const pTitle = document.createElementNS(SVG_NS, "title");
    pTitle.textContent = `${planet.name} in ${planet.sign.name}, House ${planet.house}`;

    g.appendChild(pTitle);
    g.appendChild(bg);
    g.appendChild(icon);
    g.appendChild(hitArea);

    // Events
    const handleEnter = () => {
      const rect = g.getBoundingClientRect();
      tooltipEl.style.left = `${rect.left + rect.width / 2}px`;
      tooltipEl.style.top = `${rect.top}px`;
      
      document.getElementById('tt-head').textContent = `${planetInfo[planet.name].glyph} ${planet.name}`;
      document.getElementById('tt-body').innerHTML = `
        <strong>Sign:</strong> ${planet.sign.name} (${degreeInSign(planet.longitude).toFixed(1)}°)<br>
        <strong>House:</strong> ${planet.house}<br>
        <span style="opacity: 0.8; font-size: 0.85em;">${planetInfo[planet.name].key.split(',')[0]}</span>
      `;
      tooltipEl.classList.add('visible');
    };

    const handleLeave = () => { tooltipEl.classList.remove('visible'); };
    const handleClick = () => { openPlanetPanel(planet, report); };

    g.addEventListener('mouseenter', handleEnter);
    g.addEventListener('focus', handleEnter);
    g.addEventListener('mouseleave', handleLeave);
    g.addEventListener('blur', handleLeave);
    g.addEventListener('click', handleClick);
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); }
    });

    interactionLayer.appendChild(g);
  });

  svg.appendChild(backgroundLayer);
  svg.appendChild(zodiacRingLayer);
  svg.appendChild(houseRingLayer);
  svg.appendChild(aspectLayer);
  svg.appendChild(connectorLayer);
  svg.appendChild(planetLayer);
  svg.appendChild(labelLayer);
  svg.appendChild(interactionLayer);
  
  container.appendChild(svg);
}

function openPlanetPanel(planet, report) {
  const overlay = document.getElementById('planetPanelOverlay');
  const panel = document.getElementById('planetPanel');
  if (!overlay || !panel) return;

  const interp = getPlanetInterpretation(planet);
  const pInfo = planetInfo[planet.name];

  document.getElementById('ppGlyph').textContent = pInfo.glyph;
  document.getElementById('ppName').textContent = planet.name;
  document.getElementById('ppSubtitle').textContent = `${planet.sign.name} • ${planet.house}${['st','nd','rd'][((planet.house+90)%100-10)%10-1]||'th'} House`;
  
  document.getElementById('ppCore').textContent = interp.coreMeaning;
  document.getElementById('ppPersonality').textContent = interp.personalityInfluence;
  document.getElementById('ppCareer').textContent = interp.careerInfluence;
  document.getElementById('ppLove').textContent = interp.loveInfluence;
  document.getElementById('ppHealth').textContent = interp.healthInfluence;
  document.getElementById('ppAdvice').textContent = interp.practicalAdvice;

  const strengthBar = document.getElementById('ppStrengthBar');
  const strengthText = document.getElementById('ppStrengthText');
  if (strengthBar && strengthText) {
    // Small delay for CSS transition to trigger
    strengthBar.style.width = '0%';
    setTimeout(() => {
      strengthBar.style.width = `${interp.strength}%`;
      strengthText.textContent = `${interp.strength}%`;
    }, 50);
  }

  overlay.classList.add('active');
  panel.classList.add('active');
}

window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('planetPanelOverlay');
  const panel = document.getElementById('planetPanel');
  const closeBtn = document.getElementById('ppClose');
  
  const closePanel = () => {
    if(overlay) overlay.classList.remove('active');
    if(panel) panel.classList.remove('active');
  };

  if(overlay) overlay.addEventListener('click', closePanel);
  if(closeBtn) closeBtn.addEventListener('click', closePanel);
});
