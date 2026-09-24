// ชุดสีของแต่ละโหมด — component ดึงสีจากตรงนี้ผ่าน useTheme() แทนการ hardcode สี
// (คล้าย CSS variables / design tokens บนเว็บ)
export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  primary: string;
  primarySoft: string; // พื้นหลังอ่อนของสีหลัก เช่น progress bar ที่ยังไม่เต็ม
  danger: string;
  dangerSoft: string;
  success: string;
  codeBackground: string;
  codeText: string;
};

export const COLORS: Record<ThemeMode, ThemeColors> = {
  light: {
    background: '#f5f6fa',
    card: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    border: '#e2e8f0',
    primary: '#5b5bd6',
    primarySoft: '#ededfc',
    danger: '#e5484d',
    dangerSoft: '#feebec',
    success: '#12a594',
    codeBackground: '#1e2433',
    codeText: '#e2e8f0',
  },
  dark: {
    background: '#0b1120',
    card: '#151c2c',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    border: '#26324a',
    primary: '#7c7cf0',
    primarySoft: '#23254a',
    danger: '#f87171',
    dangerSoft: '#3b1a1d',
    success: '#2dd4bf',
    codeBackground: '#060a14',
    codeText: '#e2e8f0',
  },
};

// เติมความโปร่งใสให้สี hex เช่น withAlpha('#5b5bd6', 0.15) → '#5b5bd626'
// ใช้ทำพื้นหลังไอคอนสีอ่อนจากสีประจำเมนู/บทเรียน
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}
