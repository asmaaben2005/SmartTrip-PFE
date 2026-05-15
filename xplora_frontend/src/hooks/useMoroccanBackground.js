// src/hooks/useMoroccanBackground.js
// ─────────────────────────────────────────────────────────────
// Custom hook for dynamic Moroccan city backgrounds.
//
// Features:
//  • Random city on every mount (default)
//  • Accept a specific city via `cityProp`
//  • Auto-rotate every N seconds (optional)
//  • Smooth cross-fade transition between images
//  • Preloads next image before switching
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from "react";
import {
  MOROCCAN_CITIES,
  CITY_KEYS,
  getRandomCity,
} from "../constants/moroccanCities";

/**
 * @param {object}  options
 * @param {string}  options.cityProp   - Force a specific city key (optional)
 * @param {boolean} options.autoRotate - Auto-rotate cities (default: false)
 * @param {number}  options.interval   - Rotation interval in ms (default: 7000)
 */
export function useMoroccanBackground({
  cityProp   = null,
  autoRotate = false,
  interval   = 7000,
} = {}) {

  // ── Initial city ─────────────────────────────────────────
  const initialKey = cityProp && MOROCCAN_CITIES[cityProp]
    ? cityProp
    : getRandomCity();

  const [currentKey, setCurrentKey] = useState(initialKey);
  const [nextKey,    setNextKey]     = useState(null);   // being preloaded
  const [fading,     setFading]      = useState(false);  // transition active
  const [loaded,     setLoaded]      = useState(false);  // current img loaded
  const timerRef = useRef(null);

  const city = MOROCCAN_CITIES[currentKey];

  // ── Preload an image ─────────────────────────────────────
  const preload = useCallback((url) => {
    return new Promise((resolve) => {
      const img    = new Image();
      img.onload   = () => resolve(true);
      img.onerror  = () => resolve(false);
      img.src      = url;
    });
  }, []);

  // ── Switch to a specific city (with cross-fade) ──────────
  const switchTo = useCallback(async (key) => {
    if (key === currentKey || fading) return;
    setNextKey(key);
    await preload(MOROCCAN_CITIES[key].url);
    setFading(true);
    // after CSS transition duration (600ms) flip to new city
    setTimeout(() => {
      setCurrentKey(key);
      setNextKey(null);
      setFading(false);
    }, 600);
  }, [currentKey, fading, preload]);

  // ── Go to next city in order ─────────────────────────────
  const next = useCallback(() => {
    const idx = CITY_KEYS.indexOf(currentKey);
    const nxt = CITY_KEYS[(idx + 1) % CITY_KEYS.length];
    switchTo(nxt);
  }, [currentKey, switchTo]);

  // ── Go to previous city ──────────────────────────────────
  const prev = useCallback(() => {
    const idx = CITY_KEYS.indexOf(currentKey);
    const prv = CITY_KEYS[(idx - 1 + CITY_KEYS.length) % CITY_KEYS.length];
    switchTo(prv);
  }, [currentKey, switchTo]);

  // ── Random city ──────────────────────────────────────────
  const random = useCallback(() => {
    const others = CITY_KEYS.filter(k => k !== currentKey);
    switchTo(others[Math.floor(Math.random() * others.length)]);
  }, [currentKey, switchTo]);

  // ── Preload current image on mount/city change ───────────
  useEffect(() => {
    setLoaded(false);
    preload(city.url).then(() => setLoaded(true));
  }, [city.url, preload]);

  // ── Auto-rotation ────────────────────────────────────────
  useEffect(() => {
    if (!autoRotate) return;
    timerRef.current = setInterval(next, interval);
    return () => clearInterval(timerRef.current);
  }, [autoRotate, interval, next]);

  // ── Sync with cityProp changes ───────────────────────────
  useEffect(() => {
    if (cityProp && MOROCCAN_CITIES[cityProp] && cityProp !== currentKey) {
      switchTo(cityProp);
    }
  }, [cityProp]); // eslint-disable-line

  // ── Current city index for dots indicator ────────────────
  const currentIndex = CITY_KEYS.indexOf(currentKey);

  return {
    city,           // full city object
    currentKey,     // e.g. "marrakech"
    currentIndex,   // 0-6
    fading,         // true during transition
    loaded,         // true when image is ready
    nextCity: nextKey ? MOROCCAN_CITIES[nextKey] : null,
    next,
    prev,
    random,
    switchTo,
    allCities: MOROCCAN_CITIES,
    allKeys:   CITY_KEYS,
  };
}