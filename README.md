# Astrology-app ✨

A responsive web app that generates a **personalized astrology + numerology report** from birth details.

It calculates and displays:
- **Mulank** (birth number)
- **Bhagyank** (life path number)
- **Naamank** (name number)
- **Ascendant (Lagna)**
- **Planet positions by house/sign**
- Themed readings for personality, love, career, money, health, and more

---

## Live App Goal

The app is designed to let users enter their details and instantly view a visual “birth blueprint” with chart and insights.

---

## Features

- Clean, modern single-page interface
- Input form for:
  - Full name
  - Date of birth
  - Time of birth
  - Birth place
  - Optional latitude/longitude/timezone
- Built-in city presets for quick autofill
- Auto-generated report with:
  - Summary card section
  - Planet-in-house table
  - Interpretation cards
  - Canvas-based astrology wheel/chart
- “Try Sample” button for demo data
- Responsive design for desktop and mobile

---

## Tech Stack

- **HTML5** (`index.html`)
- **CSS3** (`style.css`)
- **Vanilla JavaScript** (`script.js`)
- **Canvas API** for sky background and chart rendering

No frameworks or build tools are required.

---

## Project Structure

```text
Astrology-app/
├── index.html      # App layout and report template
├── style.css       # UI styling and responsive layout
├── script.js       # Core logic: calculations + rendering
└── .env            # Currently empty placeholder
```

---

## How It Works (Overview)

1. User enters birth details.
2. App converts date/time into a Julian day approximation.
3. It estimates:
   - Sun, Moon, and other planetary longitudes
   - Ascendant
   - House placements (equal-house style)
4. Numerology values are derived from date and name.
5. Results are rendered dynamically into the report template.

> Note: The calculations are simplified and intended for educational/self-reflection use, not professional astrological precision.

---

## Run Locally

Because this is a static front-end project, you can run it directly:

1. Clone the repository:
   ```bash
   git clone https://github.com/abhijith-IT/Astrology-app.git
   cd Astrology-app
   ```
2. Open `index.html` in your browser.

Optional: Use a local server (recommended), for example VS Code Live Server.

---

## Usage

1. Open the app.
2. Fill in your details.
3. Click **Generate Reading**.
4. Review your generated astrology + numerology report.
5. Use **Try Sample** to test quickly.

---

## Future Improvements

- Integrate a geocoding API for accurate location coordinates
- Add high-precision ephemeris support
- Add PDF export for reports
- Add dark mode theme toggle
- Add input validation and error states for incomplete form entries

---

## Author

Created by **[abhijith-IT](https://github.com/abhijith-IT)**.
