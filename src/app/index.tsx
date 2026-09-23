// หน้าแรก (route "/") — เมนูหลักให้เลือกเข้าแต่ละฟีเจอร์
// เพิ่มเมนูใหม่ได้โดยเพิ่ม object ใน MENU_ITEMS + สร้างไฟล์ route ที่ตรงกับ href ใน src/app/
import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type MenuItem = {
  href: '/notes';
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const MENU_ITEMS: MenuItem[] = [
  {
    href: '/notes',
    title: 'บันทึก',
    description: 'จดโน้ตและรายการที่ต้องทำ',
    icon: 'document-text-outline',
    color: '#4f46e5',
  },
];

export default function HomeScreen() {
  return (
    <FlatList
      data={MENU_ITEMS}
      keyExtractor={(item) => item.href}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        // asChild: ให้ Link ส่ง onPress ไปที่ Pressable ข้างใน (คล้าย <Link legacyBehavior> ของ Next.js)
        <Link href={item.href} asChild>
          <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
            <View style={[styles.iconWrap, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={24} color="#fff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardPressed: {
    opacity: 0.7,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
});
