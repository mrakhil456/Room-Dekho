import React, { useState } from 'react';
import { Moon, Palette, Sun, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeControls = () => {
  const { mode, theme, themes, setMode, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="theme-toggle"
        aria-label="Change theme"
        title="Change theme"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden xl:inline">Theme</span>
      </button>
      {open && (
        <div className="theme-popover">
          <div className="theme-popover-title">Appearance</div>
          <div className="theme-mode-grid">
            <button className={`theme-mode ${mode === 'light' ? 'active' : ''}`} onClick={() => setMode('light')}>
              <Sun className="w-4 h-4" /> Light
            </button>
            <button className={`theme-mode ${mode === 'dark' ? 'active' : ''}`} onClick={() => setMode('dark')}>
              <Moon className="w-4 h-4" /> Dark
            </button>
          </div>
          <div className="theme-popover-title mt-3">Accent</div>
          <div className="theme-swatches">
            {Object.entries(themes).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key)}
                className={`theme-swatch ${theme === key ? 'selected' : ''}`}
                style={{ '--swatch': item.accent }}
                title={item.label}
                aria-label={`Use ${item.label} accent`}
              >
                {theme === key && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeControls;
