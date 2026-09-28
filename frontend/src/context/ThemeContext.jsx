import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ThemeContext = createContext(null);

const THEME_OPTIONS = {
  amber: { label: 'Sunset', accent: '#f59e0b', accentStrong: '#d97706' },
  indigo: { label: 'Indigo', accent: '#6366f1', accentStrong: '#4f46e5' },
  emerald: { label: 'Emerald', accent: '#10b981', accentStrong: '#059669' },
  rose: { label: 'Rose', accent: '#f43f5e', accentStrong: '#e11d48' },
};

const DEFAULTS = { mode: 'light', theme: 'amber' };

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [mode, setMode] = useState(DEFAULTS.mode);
  const [theme, setTheme] = useState(DEFAULTS.theme);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setMode(DEFAULTS.mode);
      setTheme(DEFAULTS.theme);
      setLoaded(true);
      return;
    }
    setLoaded(false);
    userAPI.getUserProfile()
      .then(({ data }) => {
        setMode(data.preferences?.themeMode || DEFAULTS.mode);
        setTheme(data.preferences?.themeAccent || DEFAULTS.theme);
      })
      .catch(() => {
        setMode(DEFAULTS.mode);
        setTheme(DEFAULTS.theme);
      })
      .finally(() => setLoaded(true));
  }, [user?.id]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.mode = mode;
    root.dataset.theme = theme;
    root.style.colorScheme = mode;
  }, [mode, theme]);

  const persist = async (nextMode, nextTheme) => {
    setMode(nextMode);
    setTheme(nextTheme);
    if (!user) return;
    try {
      await userAPI.updateThemePreferences({ themeMode: nextMode, themeAccent: nextTheme });
    } catch (error) {
      console.error('Unable to save theme preferences:', error);
    }
  };

  const value = useMemo(() => ({
    mode,
    theme,
    themes: THEME_OPTIONS,
    loaded,
    setMode: (next) => persist(next, theme),
    setTheme: (next) => persist(mode, next),
    toggleMode: () => persist(mode === 'dark' ? 'light' : 'dark', theme),
  }), [mode, theme, loaded, user?.id]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
};
