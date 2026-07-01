  const form = document.querySelector("#astroForm");
const results = document.querySelector("#results");
const template = document.querySelector("#reportTemplate");
const sampleBtn = document.querySelector("#sampleBtn");
const skyCanvas = document.querySelector("#skyCanvas");
const cityList = document.querySelector("#cityList");
const fullNameInput = document.querySelector("#fullName");
const birthDateInput = document.querySelector("#birthDate");
const birthTimeInput = document.querySelector("#birthTime");
const placeInput = document.querySelector("#birthPlace");
const latInput = document.querySelector("#latitude");
const lonInput = document.querySelector("#longitude");
const tzInput = document.querySelector("#timezone");

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

const cityPresets = [
  ["Delhi, India", 28.6139, 77.2090, 5.5],
  ["Mumbai, India", 19.0760, 72.8777, 5.5],
  ["Bengaluru, India", 12.9716, 77.5946, 5.5],
  ["Chennai, India", 13.0827, 80.2707, 5.5],
  ["Kolkata, India", 22.5726, 88.3639, 5.5],
  ["Hyderabad, India", 17.3850, 78.4867, 5.5],
  ["Pune, India", 18.5204, 73.8567, 5.5],
  ["Ahmedabad, India", 23.0225, 72.5714, 5.5],
  ["Jaipur, India", 26.9124, 75.7873, 5.5],
  ["Lucknow, India", 26.8467, 80.9462, 5.5],
  ["Patna, India", 25.5941, 85.1376, 5.5],
  ["Kochi, India", 9.9312, 76.2673, 5.5],
  ["London, United Kingdom", 51.5072, -0.1276, 0],
  ["New York, United States", 40.7128, -74.0060, -5],
  ["Los Angeles, United States", 34.0522, -118.2437, -8],
  ["Dubai, UAE", 25.2048, 55.2708, 4],
  ["Singapore", 1.3521, 103.8198, 8],
  ["Sydney, Australia", -33.8688, 151.2093, 10]
];

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

function nameNumber(name) {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, "");
  const sum = [...clean].reduce((total, char) => {
    const position = char.charCodeAt(0) - 64;
    return total + (((position - 1) % 9) + 1);
  }, 0);
  return digitalRoot(sum);
}

function signFor(longitude) {
  return signs[Math.floor(norm(longitude) / 30)];
}

function degreeInSign(longitude) {
  return norm(longitude) % 30;
}

function dateToJulian(year, month, day, hour, minute, timezone) {
  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - timezone * 60 * 60 * 1000;
  return utcMs / 86400000 + 2440587.5;
}

function sunLongitude(jd) {
  const n = jd - J2000;
  const meanLong = norm(280.460 + 0.9856474 * n);
  const anomaly = norm(357.528 + 0.9856003 * n);
  return norm(meanLong + 1.915 * sinDeg(anomaly) + 0.020 * sinDeg(2 * anomaly));
}

function moonLongitude(jd) {
  const d = jd - J2000;
  const l = norm(218.316 + 13.176396 * d);
  const m = norm(134.963 + 13.064993 * d);
  const f = norm(93.272 + 13.229350 * d);
  return norm(l + 6.289 * sinDeg(m) + 1.274 * sinDeg(2 * (l - sunLongitude(jd)) - m) + 0.658 * sinDeg(2 * (l - sunLongitude(jd))) + 0.214 * sinDeg(2 * m) - 0.186 * sinDeg(norm(357.529 + 0.98560028 * d)) + 0.110 * sinDeg(f));
}

function planetLongitudes(jd) {
  const d = jd - J2000;
  const sun = sunLongitude(jd);
  const moon = moonLongitude(jd);
  const mercury = norm(sun + 26.8 * Math.sin(TAU * d / 115.88 + 1.1) + 5.2 * Math.sin(TAU * d / 44));
  const venus = norm(sun + 44.5 * Math.sin(TAU * d / 583.92 + 2.2) + 2.8 * Math.sin(TAU * d / 120));
  const mars = norm(355.433 + 0.524039 * d + 9.2 * Math.sin(TAU * d / 779.94 + 0.4));
  const jupiter = norm(34.351 + 0.083086 * d + 5.1 * Math.sin(TAU * d / 398.88 + 1.5));
  const saturn = norm(50.077 + 0.033459 * d + 4.8 * Math.sin(TAU * d / 378.09 + 2.0));
  const rahu = norm(125.045 - 0.052954 * d);
  const uranus = norm(314.055 + 0.011728 * d + 1.5 * Math.sin(TAU * d / 369.66));
  const neptune = norm(304.348 + 0.005981 * d + 1.0 * Math.sin(TAU * d / 367.49));
  const pluto = norm(238.929 + 0.003964 * d + 2.6 * Math.sin(TAU * d / 366.7));

  return [
    ["Sun", sun],
    ["Moon", moon],
    ["Mercury", mercury],
    ["Venus", venus],
    ["Mars", mars],
    ["Jupiter", jupiter],
    ["Saturn", saturn],
    ["Rahu", rahu],
    ["Ketu", norm(rahu + 180)],
    ["Uranus", uranus],
    ["Neptune", neptune],
    ["Pluto", pluto]
  ];
}

function ascendantLongitude(jd, longitude, latitude) {
  const d = jd - J2000;
  const gmstHours = 18.697374558 + 24.06570982441908 * d;
  const lst = norm(gmstHours * 15 + longitude);
  const epsilon = 23.439291 * DEG;
  const theta = lst * DEG;
  const phi = Math.max(-66, Math.min(66, latitude)) * DEG;
  const asc = Math.atan2(-Math.cos(theta), Math.sin(theta) * Math.cos(epsilon) + Math.tan(phi) * Math.sin(epsilon)) / DEG;
  return norm(asc + 180);
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

function buildReport(data) {
  const jd = dateToJulian(data.year, data.month, data.day, data.hour, data.minute, data.timezone);
  const asc = ascendantLongitude(jd, data.longitude, data.latitude);
  const planetRows = planetLongitudes(jd).map(([name, longitude]) => ({
    name,
    longitude,
    house: houseFor(longitude, asc),
    sign: signFor(longitude)
  }));

  const mulank = digitalRoot(data.day);
  const bhagyank = digitalRoot(`${data.day}${data.month}${data.year}`);
  const naamank = nameNumber(data.fullName);
  const ascSign = signFor(asc);
  const moon = planetRows.find((planet) => planet.name === "Moon");
  const sun = planetRows.find((planet) => planet.name === "Sun");
  const venus = planetRows.find((planet) => planet.name === "Venus");
  const mars = planetRows.find((planet) => planet.name === "Mars");
  const jupiter = planetRows.find((planet) => planet.name === "Jupiter");
  const saturn = planetRows.find((planet) => planet.name === "Saturn");
  const rahu = planetRows.find((planet) => planet.name === "Rahu");
  const dominant = describeDominant(planetRows);

  return {
    ...data,
    jd,
    asc,
    ascSign,
    planetRows,
    mulank,
    bhagyank,
    naamank,
    moon,
    sun,
    venus,
    mars,
    jupiter,
    saturn,
    rahu,
    dominant
  };
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

function renderReport(report) {
  const fragment = template.content.cloneNode(true);
  fragment.querySelector(".report-kicker").textContent = `${report.place} • ${String(report.day).padStart(2, "0")}/${String(report.month).padStart(2, "0")}/${report.year}`;
  fragment.querySelector(".report-name").textContent = report.fullName;
  const coordinateNote = report.coordinatesEstimated ? " Coordinates were estimated from the place name, so exact houses may shift if you add latitude and longitude." : "";
  fragment.querySelector(".report-summary").textContent = `You carry a ${report.dominant.topElement.toLowerCase()}-leaning chart with ${report.dominant.topMode.toLowerCase()} momentum. This reading blends birth numbers with planetary house placement to outline your temperament, relationships, work, money, and growth themes.${coordinateNote}`;

  const metricGrid = fragment.querySelector(".metric-grid");
  metricCards(report).forEach(([label, value, text]) => {
    const card = document.createElement("article");
    card.className = "metric panel";
    card.innerHTML = `<span>${label}</span><strong>${value}</strong><p>${text}</p>`;
    metricGrid.appendChild(card);
  });

  const planetTable = fragment.querySelector(".planet-table");
  report.planetRows.forEach((planet) => {
    const row = document.createElement("article");
    row.className = "planet-row";
    row.innerHTML = `
      <div class="planet-glyph">${planetInfo[planet.name].glyph}</div>
      <div>
        <h4>${planet.name} in ${planet.sign.glyph} ${planet.sign.name}</h4>
        <p>${formatLongitude(planet.longitude)} • ${planetInfo[planet.name].key}</p>
      </div>
      <div class="house-pill">${planet.house} House</div>
    `;
    planetTable.appendChild(row);
  });

  const readingGrid = fragment.querySelector(".reading-grid");
  interpretation(report).forEach((item) => {
    const card = document.createElement("article");
    card.className = "reading-card panel";
    card.innerHTML = `<h3>${item.title}</h3><p>${item.body}</p>`;
    readingGrid.appendChild(card);
  });

  results.replaceChildren(fragment);
  drawChart(document.querySelector("#chartCanvas"), report);
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

function readForm() {
  const [year, month, day] = birthDateInput.value.split("-").map(Number);
  const [hour, minute] = birthTimeInput.value.split(":").map(Number);
  const hasLatitude = latInput.value.trim() !== "";
  const hasLongitude = lonInput.value.trim() !== "";
  const latitude = hasLatitude ? Number(latInput.value) : fallbackCoordinate(placeInput.value, "lat");
  const longitude = hasLongitude ? Number(lonInput.value) : fallbackCoordinate(placeInput.value, "lon");

  return {
    fullName: fullNameInput.value.trim(),
    year,
    month,
    day,
    hour,
    minute,
    place: placeInput.value.trim(),
    latitude,
    longitude,
    timezone: tzInput.value.trim() === "" ? 0 : Number(tzInput.value),
    coordinatesEstimated: !hasLatitude || !hasLongitude
  };
}

function fallbackCoordinate(place, axis) {
  const seed = [...place.toLowerCase()].reduce((total, char) => total + char.charCodeAt(0), 0);
  if (axis === "lat") {
    return ((seed % 12000) / 100) - 60;
  }
  return ((seed * 17) % 36000) / 100 - 180;
}

function fillCityPreset(place) {
  const preset = cityPresets.find((city) => city[0].toLowerCase() === place.toLowerCase());
  if (!preset) return;
  latInput.value = preset[1];
  lonInput.value = preset[2];
  tzInput.value = preset[3];
}

function populateCities() {
  cityPresets.forEach(([city]) => {
    const option = document.createElement("option");
    option.value = city;
    cityList.appendChild(option);
  });
}

function drawSky() {
  if (!skyCanvas) return;
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

populateCities();
drawSky();
window.addEventListener("resize", drawSky);

placeInput.addEventListener("change", () => fillCityPreset(placeInput.value));

sampleBtn.addEventListener("click", () => {
  fullNameInput.value = "Aarav Mehta";
  birthDateInput.value = "1995-08-17";
  birthTimeInput.value = "06:42";
  placeInput.value = "Delhi, India";
  fillCityPreset(placeInput.value);
  form.requestSubmit();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = readForm();
  const report = buildReport(data);
  
  // Store report data in sessionStorage
  sessionStorage.setItem('astroReport', JSON.stringify(report));
  
  // Redirect to result page
  window.location.href = 'result.html';
});
