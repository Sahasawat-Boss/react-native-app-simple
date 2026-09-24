// การ์ดแนวนอนที่กดแล้วไปหน้าอื่น (ใช้ในหน้ารายการบทเรียน)
import { Href, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { IconBadge } from './IconBadge';
import { useCardStyle } from './Card';

type Props = {
  href: Href;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  eyebrow?: string; // ข้อความเล็กเหนือหัวข้อ เช่น "บทที่ 1"
  done?: boolean; // true = แสดงเครื่องหมายถูกแทนลูกศร (เช่นบทเรียนที่เรียนจบแล้ว)
};

export function ListCard({ href, title, description, icon, color, eyebrow, done }: Props) {
  const { colors } = useTheme();
  const cardStyle = useCardStyle();

  return (
    // ใช้ router.push แทน <Link asChild> เพราะ Link asChild รวม style แบบ function ({ pressed }) ของ Pressable ไม่ได้
    // (style ทั้งก้อนจะหายไป) เลยสั่งเปลี่ยนหน้าเองตอนกด
    <Pressable
      onPress={() => router.push(href)}
      accessibilityRole="link"
      style={({ pressed }) => [cardStyle, styles.card, pressed && styles.cardPressed]}
    >
      <IconBadge icon={icon} color={color} size={48} />
      <View style={styles.textContainer}>
        {eyebrow ? <Text style={[styles.eyebrow, { color }]}>{eyebrow}</Text> : null}
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {description}
        </Text>
      </View>
      {done ? (
        <Ionicons name="checkmark-circle" size={22} color={colors.success} />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    gap: 14,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  textContainer: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3,
  },
});
