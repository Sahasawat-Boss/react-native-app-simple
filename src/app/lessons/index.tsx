// หน้ารายการบทเรียน (route "/lessons") — index.tsx ในโฟลเดอร์ = หน้าหลักของโฟลเดอร์นั้น
// เหมือน app/lessons/page.tsx ใน Next.js
import { FlatList, StyleSheet, Text } from 'react-native';
import { ListCard } from '@/components/ListCard';
import { LESSONS } from '@/data/lessons';
import { useTheme } from '@/theme/ThemeProvider';

export default function LessonsScreen() {
  const { colors } = useTheme();

  return (
    <FlatList
      data={LESSONS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <Text style={[styles.intro, { color: colors.textSecondary }]}>
          {LESSONS.length} บทเรียนสั้นๆ เทียบ React Native กับเว็บที่คุณคุ้นเคย
        </Text>
      }
      renderItem={({ item, index }) => (
        <ListCard
          // ส่ง id ไปกับ URL เช่น /lessons/styling แล้วหน้า [id].tsx จะอ่านค่านี้
          href={{ pathname: '/lessons/[id]', params: { id: item.id } }}
          eyebrow={`บทที่ ${index + 1} · ${item.sections.length} หัวข้อ`}
          title={item.title}
          description={item.summary}
          icon={item.icon}
          color={item.color}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 20,
    paddingTop: 4,
  },
  intro: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
});
