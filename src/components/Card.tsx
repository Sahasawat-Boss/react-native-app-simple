// พื้นผิวการ์ดมาตรฐานของแอป: พื้นสี card + เส้นขอบบาง + เงาอ่อน (เงาเฉพาะโหมดสว่าง)
// รับ style เพิ่มได้เหมือน View ปกติ
import { StyleSheet, View, ViewProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export function Card({ style, ...rest }: ViewProps) {
  const { colors, mode } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        mode === 'light' && styles.shadow,
        style,
      ]}
      {...rest}
    />
  );
}

// ใช้กับ Pressable ที่อยากได้หน้าตาเหมือน Card (Pressable รับ style เป็น function ได้ เลยใช้ Card ครอบตรงๆ ไม่สะดวก)
export function useCardStyle() {
  const { colors, mode } = useTheme();
  return [
    styles.card,
    { backgroundColor: colors.card, borderColor: colors.border },
    mode === 'light' && styles.shadow,
  ];
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  shadow: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
