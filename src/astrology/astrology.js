export const TAU = Math.PI * 2;
export const DEG = Math.PI / 180;
export const J2000 = 2451545;

export const signs = [
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

export const houses = [
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

export const planetInfo = {
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

export const numberMeanings = {
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

export const cityPresets = [
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

export function norm(value) {
  return ((value % 360) + 360) % 360;
}

export function sinDeg(value) {
  return Math.sin(value * DEG);
}

export function cosDeg(value) {
  return Math.cos(value * DEG);
}

export function digitalRoot(value) {
  const digits = String(value).replace(/\D/g, "").split("").map(Number);
  let sum = digits.reduce((total, digit) => total + digit, 0);
  while (sum > 9) {
    sum = String(sum).split("").reduce((total, digit) => total + Number(digit), 0);
  }
  return sum || 0;
}

export function nameNumber(name) {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, "");
  const sum = [...clean].reduce((total, char) => {
    const position = char.charCodeAt(0) - 64;
    return total + (((position - 1) % 9) + 1);
  }, 0);
  return digitalRoot(sum);
}

export function signFor(longitude) {
  return signs[Math.floor(norm(longitude) / 30)];
}

export function degreeInSign(longitude) {
  return norm(longitude) % 30;
}

export function dateToJulian(year, month, day, hour, minute, timezone) {
  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - timezone * 60 * 60 * 1000;
  return utcMs / 86400000 + 2440587.5;
}

export function sunLongitude(jd) {
  const n = jd - J2000;
  const meanLong = norm(280.460 + 0.9856474 * n);
  const anomaly = norm(357.528 + 0.9856003 * n);
  return norm(meanLong + 1.915 * sinDeg(anomaly) + 0.020 * sinDeg(2 * anomaly));
}

export function moonLongitude(jd) {
  const d = jd - J2000;
  const l = norm(218.316 + 13.176396 * d);
  const m = norm(134.963 + 13.064993 * d);
  const f = norm(93.272 + 13.229350 * d);
  return norm(l + 6.289 * sinDeg(m) + 1.274 * sinDeg(2 * (l - sunLongitude(jd)) - m) + 0.658 * sinDeg(2 * (l - sunLongitude(jd))) + 0.214 * sinDeg(2 * m) - 0.186 * sinDeg(norm(357.529 + 0.98560028 * d)) + 0.110 * sinDeg(f));
}

export function planetLongitudes(jd) {
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

export function ascendantLongitude(jd, longitude, latitude) {
  const d = jd - J2000;
  const gmstHours = 18.697374558 + 24.06570982441908 * d;
  const lst = norm(gmstHours * 15 + longitude);
  const epsilon = 23.439291 * DEG;
  const theta = lst * DEG;
  const phi = Math.max(-66, Math.min(66, latitude)) * DEG;
  const asc = Math.atan2(-Math.cos(theta), Math.sin(theta) * Math.cos(epsilon) + Math.tan(phi) * Math.sin(epsilon)) / DEG;
  return norm(asc + 180);
}

export function houseFor(longitude, ascendant) {
  return Math.floor(norm(longitude - ascendant) / 30) + 1;
}

export function houseSign(house, ascendant) {
  return signFor(ascendant + (house - 1) * 30);
}

export function formatLongitude(longitude) {
  const totalMinutes = Math.round(norm(longitude) * 60) % (360 * 60);
  const signIndex = Math.floor(totalMinutes / (30 * 60));
  const sign = signs[signIndex];
  const minutesInSign = totalMinutes - signIndex * 30 * 60;
  const whole = Math.floor(minutesInSign / 60);
  const minutes = minutesInSign % 60;
  return `${whole}°${String(minutes).padStart(2, "0")} ${sign.glyph} ${sign.name}`;
}

export function describeDominant(planets) {
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

export function buildReport(data) {
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

export function interpretation(report) {
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

export function metricCards(report) {
  return [
    ["Mulank", report.mulank, `${numberMeanings[report.mulank].ruler} ruled: ${numberMeanings[report.mulank].text}.`],
    ["Bhagyank", report.bhagyank, `${numberMeanings[report.bhagyank].ruler} ruled life path: ${numberMeanings[report.bhagyank].text}.`],
    ["Naamank", report.naamank, `Name vibration supports ${numberMeanings[report.naamank].text}.`],
    ["Ascendant", `${report.ascSign.glyph} ${report.ascSign.name}`, `${formatLongitude(report.asc)} sets the equal-house chart.`]
  ];
}

// Note: Report rendering functions moved to result.js
// This file now only handles form submission and data generation
