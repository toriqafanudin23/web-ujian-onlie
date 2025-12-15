import { useState, useEffect } from "react";
import { colorPalettes, type ColorPalette } from "../utils/colors";

export default function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
    }
    return "light";
  });

  const [colorPalette, setColorPalette] = useState<ColorPalette>(() => {
    if (typeof window !== "undefined") {
      const savedPalette = localStorage.getItem("colorPalette");
      if (
        savedPalette &&
        Object.keys(colorPalettes).includes(savedPalette as ColorPalette)
      ) {
        return savedPalette as ColorPalette;
      }
    }
    return "purple";
  });

  // Handle Theme (Light/Dark)
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Handle Color Palette
  useEffect(() => {
    const root = window.document.documentElement;
    const palette = colorPalettes[colorPalette];

    // Update CSS variables
    Object.entries(palette).forEach(([shade, value]) => {
      root.style.setProperty(`--color-primary-${shade}`, value);
    });

    localStorage.setItem("colorPalette", colorPalette);
  }, [colorPalette]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const changePalette = (palette: ColorPalette) => {
    setColorPalette(palette);
  };

  return { theme, toggleTheme, colorPalette, changePalette };
}
