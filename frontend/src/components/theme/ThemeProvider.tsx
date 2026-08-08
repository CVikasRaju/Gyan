"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "gyan-theme";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

/** Mirrors the inline script in layout.tsx — keep in sync. */
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const hydratedRef = useRef(false);

  // Hydrate from storage / system preference after mount (avoids SSR mismatch).
  // Deferred so it doesn't synchronously re-render during the commit phase.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const initial = getInitialTheme();
      hydratedRef.current = true;
      setTheme(initial);
      applyTheme(initial);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Apply to <html> and persist on subsequent changes (not on first mount,
  // which is handled by the hydration callback above).
  useEffect(() => {
    if (!hydratedRef.current) return;
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable */
  }
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
