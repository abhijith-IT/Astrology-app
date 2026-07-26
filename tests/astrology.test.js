import { describe, it, expect } from 'vitest';
import {
  digitalRoot,
  nameNumber,
  signFor,
  houseFor,
  degreeInSign,
  formatLongitude,
  buildReport,
  signs
} from '../src/astrology/astrology.js';
import { buildReport as buildReportIndex } from '../src/astrology/index.js';

describe('Numerology Calculations', () => {
  it('digitalRoot() computes correctly', () => {
    expect(digitalRoot(1995)).toBe(6); // 1+9+9+5 = 24 => 2+4 = 6
    expect(digitalRoot(2023)).toBe(7); // 2+0+2+3 = 7
    expect(digitalRoot(9)).toBe(9);
    expect(digitalRoot(11)).toBe(2);
    expect(digitalRoot(22)).toBe(4); // Wait, numerology might keep master numbers, let's assume it reduces to single digit or returns number. digitalRoot reduces strictly.
  });

  it('nameNumber() computes numerology correctly', () => {
    // Current application logic uses Pythagorean mapping
    expect(nameNumber('JOHN')).toBe(2); 
    expect(nameNumber('Jane Doe')).toBe(9); // J=1,A=1,N=5,E=5, D=4,O=6,E=5 => 27 => 9 (Pythagorean)
  });
});

describe('Astrology Utilities', () => {
  it('signFor() returns the correct sign', () => {
    expect(signFor(0)).toEqual(signs[0]); // Aries
    expect(signFor(15)).toEqual(signs[0]); // Aries
    expect(signFor(30)).toEqual(signs[1]); // Taurus
    expect(signFor(359.9)).toEqual(signs[11]); // Pisces
  });

  it('degreeInSign() returns degrees 0-30', () => {
    expect(degreeInSign(0)).toBeCloseTo(0);
    expect(degreeInSign(15)).toBeCloseTo(15);
    expect(degreeInSign(30)).toBeCloseTo(0);
    expect(degreeInSign(45)).toBeCloseTo(15);
    expect(degreeInSign(359)).toBeCloseTo(29);
  });

  it('formatLongitude() returns correct string', () => {
    // Current logic adds sign glyph and name
    expect(formatLongitude(15.5)).toBe("15°30 ♈ Aries");
    expect(formatLongitude(0.0)).toBe("0°00 ♈ Aries");
    expect(formatLongitude(30.25)).toBe("0°15 ♉ Taurus");
  });

  it('houseFor() calculates equal houses correctly', () => {
    // ascendant is cusp of 1st house
    expect(houseFor(0, 0)).toBe(1);
    expect(houseFor(29, 0)).toBe(1);
    expect(houseFor(30, 0)).toBe(2);
    expect(houseFor(45, 10)).toBe(2); // 45 is 35 degrees away from 10, so house 2
    expect(houseFor(350, 10)).toBe(12); // 350 - 10 = 340 => 340 / 30 = 11.something + 1 = 12
  });
});

describe('Regression Tests - buildReport()', () => {
  const profile1 = {
    fullName: "John Doe",
    year: 1990,
    month: 1,
    day: 15,
    hour: 12,
    minute: 30,
    timezone: -5,
    latitude: 40.7128,
    longitude: -74.0060
  };

  const profile2 = {
    fullName: "Jane Smith",
    year: 1985,
    month: 7,
    day: 4,
    hour: 8,
    minute: 0,
    timezone: 1,
    latitude: 51.5074,
    longitude: -0.1278
  };

  const profile3 = {
    fullName: "Albert Einstein",
    year: 1879,
    month: 3,
    day: 14,
    hour: 11,
    minute: 30,
    timezone: 1,
    latitude: 48.3984,
    longitude: 9.9916
  };

  it('buildReport() produces stable output for Profile 1', () => {
    const report = buildReportIndex(profile1);
    expect(report).toMatchSnapshot();
  });

  it('buildReport() produces stable output for Profile 2', () => {
    const report = buildReportIndex(profile2);
    expect(report).toMatchSnapshot();
  });

  it('buildReport() produces stable output for Profile 3', () => {
    const report = buildReportIndex(profile3);
    expect(report).toMatchSnapshot();
  });

  it('interpretation() and metricCards() work', async () => {
    const report = buildReportIndex(profile1);
    const { interpretation, metricCards } = await import('../src/astrology/astrology.js');
    expect(interpretation(report)).toMatchSnapshot();
    expect(metricCards(report)).toMatchSnapshot();
  });
});
