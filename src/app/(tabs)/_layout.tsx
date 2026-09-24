// แถบเมนูด้านล่าง (bottom tabs) — ไฟล์ในโฟลเดอร์ (tabs) แต่ละไฟล์คือ 1 แท็บ
// วงเล็บในชื่อโฟลเดอร์ = "route group" ไม่ปรากฏใน URL เช่น (tabs)/notes.tsx คือ "/notes"
// หน้ารายละเอียด (lessons/[id], chats/[id]) อยู่นอกโฟลเดอร์นี้ จึงเปิดทับแถบเมนูแบบเต็มจอ
import { Tabs } from 'expo-router';
import { ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONTACTS } from '@/data/chats';
import { countUnread, useChats } from '@/hooks/useChats';
import { useTheme } from '@/theme/ThemeProvider';

type IconName = keyof typeof Ionicons.glyphMap;

// ไอคอนแบบทึบตอนเลือกอยู่ แบบเส้นตอนไม่ได้เลือก (เหมือนแอปดังๆ)
function tabIcon(name: IconName, outline: IconName) {
  function TabIcon({ color, focused, size }: { color: ColorValue; focused: boolean; size: number }) {
    return <Ionicons name={focused ? name : outline} size={size} color={color} />;
  }
  return TabIcon;
}

export default function TabLayout() {
  const { colors } = useTheme();
  const { messages, lastRead } = useChats();

  // จำนวนแชทที่มีข้อความยังไม่อ่าน โชว์เป็นตัวเลขแดงบนไอคอนแชท
  const unreadChats = CONTACTS.filter(
    (contact) => countUnread(messages, contact.id, lastRead[contact.id] ?? 0) > 0
  ).length;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      {/* หน้าแรกทำหัวหน้าเอง (คำทักทาย) จึงซ่อน header */}
      <Tabs.Screen
        name="index"
        options={{ title: 'หน้าแรก', headerShown: false, tabBarIcon: tabIcon('home', 'home-outline') }}
      />
      <Tabs.Screen
        name="lessons"
        options={{ title: 'บทเรียน', tabBarIcon: tabIcon('school', 'school-outline') }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'แชท',
          tabBarIcon: tabIcon('chatbubbles', 'chatbubbles-outline'),
          tabBarBadge: unreadChats > 0 ? unreadChats : undefined,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'บันทึก',
          headerTitle: 'บันทึกของฉัน',
          tabBarIcon: tabIcon('document-text', 'document-text-outline'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'ตั้งค่า', tabBarIcon: tabIcon('settings', 'settings-outline') }}
      />
    </Tabs>
  );
}
