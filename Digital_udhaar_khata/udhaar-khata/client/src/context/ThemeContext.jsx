import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || getSystemTheme();
  });

  useEffect(() => {

    const root = document.documentElement;

    root.classList.remove("dark");

    if (theme === "dark") {
      root.classList.add("dark");
    }

    localStorage.setItem("theme", theme);

  }, [theme]);

  // 🌙 AUTO SYSTEM THEME LISTENER
  useEffect(() => {

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      const saved = localStorage.getItem("theme");

      // only auto update if user didn't manually set theme
      if (!saved) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);

  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const resetTheme = () => {
    localStorage.removeItem("theme");
    setTheme(getSystemTheme());
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      resetTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);