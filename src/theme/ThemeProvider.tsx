// Context สำหรับโหมดสี (สว่าง/มืด) — ครอบทั้งแอปใน _layout.tsx
// ค่าเริ่มต้นตามระบบของเครื่อง ถ้าผู้ใช้เลือกเองในหน้า Settings จะจำไว้ใน AsyncStorage
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, ThemeColors, ThemeMode } from './colors';

const STORAGE_KEY = '@notes_app/theme';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  // null = ผู้ใช้ยังไม่เคยเลือก → ใช้ตามระบบ
  const [savedMode, setSavedMode] = useState<ThemeMode | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value === 'light' || value === 'dark') setSavedMode(value);
      })
      .catch((error) => console.error('Failed to load theme', error));
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setSavedMode(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch((error) =>
      console.error('Failed to save theme', error)
    );
  }, []);

  const mode: ThemeMode = savedMode ?? (systemScheme === 'dark' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ mode, colors: COLORS[mode], setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
