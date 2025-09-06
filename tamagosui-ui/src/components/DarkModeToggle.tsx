import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';

export function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative w-16 h-8 rounded-full flex items-center transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-white/50
                  ${isDarkMode ? 'bg-slate-800' : 'bg-sky-400'}`}
    >
      <span className="sr-only">Toggle dark mode</span>
      
      {/* Thumb/Saklar */}
      <div
        className="absolute w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ease-in-out"
        style={{ transform: isDarkMode ? 'translateX(34px)' : 'translateX(4px)' }}
      ></div>

      {/* Ikon Matahari & Bulan dengan Animasi Terbit/Tenggelam */}
      <div className="w-full h-full flex items-center justify-between px-2">
        <MoonIcon 
          className={`h-4 w-4 text-slate-300 transition-all duration-500 
                      ${isDarkMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`} 
        />
        <SunIcon 
          className={`h-4 w-4 text-yellow-300 transition-all duration-500 
                     ${isDarkMode ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`} 
        />
      </div>
    </button>
  );
}