import './styles/style.css';

import { initializeBackground } from './ui/background.js';
import './ui/ui.js';
import { TAU, cityPresets, buildReport } from './astrology/index.js';

const form = document.querySelector("#astroForm");
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

document.addEventListener('DOMContentLoaded', () => {
  initializeBackground();
  populateCities();
  drawSky();
  window.addEventListener("resize", drawSky);

  if (placeInput) {
    placeInput.addEventListener("change", () => fillCityPreset(placeInput.value));
  }

  if (sampleBtn) {
    sampleBtn.addEventListener("click", () => {
      fullNameInput.value = "Aarav Mehta";
      birthDateInput.value = "1995-08-17";
      birthTimeInput.value = "06:42";
      placeInput.value = "Delhi, India";
      fillCityPreset(placeInput.value);
      form.requestSubmit();
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = readForm();
      const report = buildReport(data);
      
      // Store report data in sessionStorage
      sessionStorage.setItem('astroReport', JSON.stringify(report));
      
      // Redirect to result page
      window.location.href = 'result.html';
    });
  }
});
