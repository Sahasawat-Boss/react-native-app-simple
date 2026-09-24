// ไอคอนในกรอบสี่เหลี่ยมมุมมน พื้นสีอ่อน + ไอคอนสีเข้ม ใช้ทุกที่ที่มีไอคอนประจำเมนู/บทเรียน
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { withAlpha } from '@/theme/colors';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number; // ขนาดกรอบ (ไอคอนจะเป็นครึ่งหนึ่งของกรอบ)
};

export function IconBadge({ icon, color, size = 44 }: Props) {
  const { mode } = useTheme();
  // โหมดมืดพื้นหลังเข้มอยู่แล้ว ต้องเพิ่มความทึบของสีอ่อนขึ้นอีกหน่อยให้มองเห็น
  const tint = withAlpha(color, mode === 'dark' ? 0.22 : 0.12);

  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, borderRadius: size * 0.32, backgroundColor: tint },
      ]}
    >
      <Ionicons name={icon} size={size * 0.5} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
