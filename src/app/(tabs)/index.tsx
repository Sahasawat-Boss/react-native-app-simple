// หน้าแรก (route "/") — เมนูหลักให้เลือกเข้าแต่ละฟีเจอร์
// เพิ่มเมนูใหม่ได้โดยเพิ่ม object ใน MENU_ITEMS + สร้างไฟล์ route ที่ตรงกับ href ใน src/app/
// หน้านี้ซ่อน header ของ Stack (ตั้งใน _layout.tsx) แล้วทำหัวหน้าเอง จึงต้องเว้นขอบบนตาม safe area เอง
import { Href, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { IconBadge } from '@/components/IconBadge';
import { useCardStyle } from '@/components/Card';
import { LESSONS } from '@/data/lessons';
import { useTheme } from '@/theme/ThemeProvider';

type MenuItem = {
  href: Href;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

// ตั้งค่าย้ายไปเป็นปุ่มเฟืองมุมขวาบนแทน
const MENU_ITEMS: MenuItem[] = [
  {
    href: '/lessons',
    title: 'บทเรียน',
    description: `หลักสูตร React Native ${LESSONS.length} บท`,
    icon: 'school',
    color: '#12a594',
  },
  {
    href: '/notes',
    title: 'บันทึก',
    description: 'จดโน้ตและรายการที่ต้องทำ',
    icon: 'document-text',
    color: '#5b5bd6',
  },
  {
    href: '/chats',
    title: 'แชท',
    description: 'คุยกับเพื่อนแบบแอปแชท',
    icon: 'chatbubbles',
    color: '#0a7cff',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const cardStyle = useCardStyle();

  const today = new Date().toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{today}</Text>
          <Text style={[styles.greeting, { color: colors.text }]}>สวัสดี 👋</Text>
          <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
            วันนี้อยากทำอะไรดี?
          </Text>
        </View>
        {/* ใช้ router.push แทน <Link asChild> เพราะ Link asChild ทำ style แบบ function ของ Pressable หาย */}
        <Pressable
          onPress={() => router.push('/settings')}
          style={({ pressed }) => [cardStyle, styles.settingsButton, pressed && styles.pressed]}
          accessibilityRole="link"
          accessibilityLabel="ตั้งค่า"
        >
          <Ionicons name="settings-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.grid}>
        {MENU_ITEMS.map((item) => (
          <Pressable
            key={String(item.href)}
            onPress={() => router.push(item.href)}
            accessibilityRole="link"
            style={({ pressed }) => [cardStyle, styles.tile, pressed && styles.pressed]}
          >
            <IconBadge icon={item.icon} color={item.color} size={52} />
            <View style={styles.tileText}>
              <Text style={[styles.tileTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.tileDescription, { color: colors.textSecondary }]}>
                {item.description}
              </Text>
            </View>
            <View style={[styles.tileArrow, { backgroundColor: item.color }]}>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  headerText: {
    flex: 1,
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 16,
    marginTop: 4,
  },
  settingsButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  tile: {
    // 2 คอลัมน์: กว้างเกือบครึ่ง (หัก gap แล้ว) flexGrow ให้ยืดเต็มถ้าเหลือตัวเดียวในแถว
    flexBasis: '46%',
    flexGrow: 1,
    padding: 18,
    minHeight: 190,
  },
  tileText: {
    marginTop: 16,
    flex: 1,
  },
  tileTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  tileDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  tileArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
});
