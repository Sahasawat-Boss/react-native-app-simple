// หน้ารายการบทเรียน (route "/lessons") — เป็นแท็บหนึ่งในแถบเมนูด้านล่าง
// ส่วน "/lessons/:id" อยู่ที่ src/app/lessons/[id].tsx (นอก (tabs) จึงเปิดทับแถบเมนู)
// ใช้ SectionList เพราะบทเรียนแบ่งเป็นกลุ่มตามโมดูล (FlatList ที่มีหัวข้อกลุ่ม)
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { ListCard } from '@/components/ListCard';
import { Card } from '@/components/Card';
import { LESSONS, MODULES } from '@/data/lessons';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useTheme } from '@/theme/ThemeProvider';

// SectionList ต้องการข้อมูลรูปแบบ { ...ข้อมูลหัวกลุ่ม, data: [...แถว] }
const SECTIONS = MODULES.map((module, index) => ({
  ...module,
  number: index + 1,
  data: LESSONS.filter((lesson) => lesson.moduleId === module.id),
}));

export default function LessonsScreen() {
  const { colors } = useTheme();
  const { done } = useLessonProgress();

  const doneCount = LESSONS.filter((lesson) => done.has(lesson.id)).length;
  const percent = Math.round((doneCount / LESSONS.length) * 100);

  return (
    <SectionList
      sections={SECTIONS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={
        <Card style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={[styles.progressTitle, { color: colors.text }]}>ความคืบหน้า</Text>
            <Text style={[styles.progressCount, { color: colors.primary }]}>
              {doneCount}/{LESSONS.length} บท
            </Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.primarySoft }]}>
            <View
              style={[styles.progressFill, { width: `${percent}%`, backgroundColor: colors.primary }]}
            />
          </View>
          <Text style={[styles.progressHint, { color: colors.textSecondary }]}>
            {doneCount === LESSONS.length
              ? 'เรียนครบทั้งหลักสูตรแล้ว 🎉'
              : `${MODULES.length} โมดูล ตั้งแต่เริ่มต้นจนส่งแอปขึ้น Store`}
          </Text>
        </Card>
      }
      renderSectionHeader={({ section }) => {
        const sectionDone = section.data.filter((lesson) => done.has(lesson.id)).length;
        return (
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionEyebrow, { color: section.color }]}>
              โมดูล {section.number} · {sectionDone}/{section.data.length}
            </Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
              {section.description}
            </Text>
          </View>
        );
      }}
      renderItem={({ item }) => (
        <ListCard
          // ส่ง id ไปกับ URL เช่น /lessons/styling แล้วหน้า [id].tsx จะอ่านค่านี้
          href={{ pathname: '/lessons/[id]', params: { id: item.id } }}
          eyebrow={`บทที่ ${item.number} · ${item.sections.length} หัวข้อ`}
          title={item.title}
          description={item.summary}
          icon={item.icon}
          color={item.color}
          done={done.has(item.id)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 20,
    paddingTop: 4,
    paddingBottom: 40,
  },
  progressCard: {
    padding: 18,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressHint: {
    fontSize: 13,
    marginTop: 10,
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 12,
  },
  sectionEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  sectionDescription: {
    fontSize: 13,
    marginTop: 2,
  },
});
