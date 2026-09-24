// หน้าบทเรียนแต่ละบท (route "/lessons/:id") — [id] ในชื่อไฟล์คือ dynamic segment
// เหมือน app/lessons/[id]/page.tsx ใน Next.js แต่อ่านค่าด้วย useLocalSearchParams แทน props.params
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { IconBadge } from '@/components/IconBadge';
import { Lesson, LESSONS } from '@/data/lessons';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { useTheme } from '@/theme/ThemeProvider';
import { withAlpha } from '@/theme/colors';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const index = LESSONS.findIndex((l) => l.id === id);
  const lesson = LESSONS[index];
  const { colors } = useTheme();
  const { done, toggleDone } = useLessonProgress();

  // กรณีพิมพ์ URL ผิด หรือ id ไม่มีอยู่จริง
  if (!lesson) {
    return (
      <View style={styles.notFound}>
        <Stack.Screen options={{ title: 'ไม่พบบทเรียน' }} />
        <IconBadge icon="help" color={colors.textMuted} size={72} />
        <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>
          ไม่พบบทเรียน &quot;{id}&quot;
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {/* ตั้งชื่อ header จากในหน้าเอง เพราะชื่อขึ้นกับข้อมูล ไม่ได้ตายตัวใน _layout */}
      <Stack.Screen options={{ title: lesson.title }} />

      <View style={[styles.hero, { backgroundColor: withAlpha(lesson.color, 0.1) }]}>
        <IconBadge icon={lesson.icon} color={lesson.color} size={60} />
        <Text style={[styles.heroEyebrow, { color: lesson.color }]}>
          บทที่ {lesson.number}/{LESSONS.length} · {lesson.moduleTitle}
        </Text>
        <Text style={[styles.heroTitle, { color: colors.text }]}>{lesson.title}</Text>
        <Text style={[styles.heroSummary, { color: colors.textSecondary }]}>{lesson.summary}</Text>
      </View>

      {lesson.sections.map((section, index) => (
        <Card key={section.heading} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.stepNumber, { backgroundColor: lesson.color }]}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={[styles.heading, { color: colors.text }]}>{section.heading}</Text>
          </View>
          <Text style={[styles.body, { color: colors.textSecondary }]}>{section.body}</Text>

          {section.code ? (
            <View style={[styles.codeBlock, { backgroundColor: colors.codeBackground }]}>
              <View style={styles.codeHeader}>
                <Ionicons name="code-slash" size={13} color={colors.textMuted} />
                <Text style={[styles.codeLabel, { color: colors.textMuted }]}>ตัวอย่างโค้ด</Text>
              </View>
              <Text style={[styles.code, { color: colors.codeText }]}>{section.code}</Text>
            </View>
          ) : null}
        </Card>
      ))}

      <DoneButton
        isDone={done.has(lesson.id)}
        color={lesson.color}
        onPress={() => toggleDone(lesson.id)}
      />

      <View style={styles.pager}>
        <PagerButton lesson={LESSONS[index - 1]} direction="prev" />
        <PagerButton lesson={LESSONS[index + 1]} direction="next" />
      </View>
    </ScrollView>
  );
}

function DoneButton({ isDone, color, onPress }: { isDone: boolean; color: string; onPress: () => void }) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.doneButton,
        isDone
          ? { backgroundColor: withAlpha(colors.success, 0.12), borderColor: colors.success }
          : { backgroundColor: color, borderColor: color },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={isDone ? 'checkmark-circle' : 'checkmark-done'}
        size={20}
        color={isDone ? colors.success : '#fff'}
      />
      <Text style={[styles.doneButtonText, { color: isDone ? colors.success : '#fff' }]}>
        {isDone ? 'เรียนจบบทนี้แล้ว' : 'ทำเครื่องหมายว่าเรียนจบ'}
      </Text>
    </Pressable>
  );
}

// ปุ่มไปบทก่อนหน้า/ถัดไป ใช้ router.replace เพื่อไม่ให้หน้าซ้อนกันยาว กด back แล้วกลับหน้ารายการเลย
function PagerButton({ lesson, direction }: { lesson?: Lesson; direction: 'prev' | 'next' }) {
  const { colors } = useTheme();
  const isNext = direction === 'next';

  // เว้นที่ว่างไว้ ปุ่มอีกฝั่งจะได้อยู่ตำแหน่งเดิม
  if (!lesson) return <View style={styles.pagerButton} />;

  return (
    <Pressable
      onPress={() => router.replace({ pathname: '/lessons/[id]', params: { id: lesson.id } })}
      style={({ pressed }) => [
        styles.pagerButton,
        { backgroundColor: colors.card, borderColor: colors.border },
        isNext && styles.pagerButtonNext,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.pagerLabel, { color: colors.textMuted }]}>
        {isNext ? 'บทถัดไป' : 'บทก่อนหน้า'}
      </Text>
      <View style={[styles.pagerTitleRow, isNext && styles.pagerTitleRowNext]}>
        {!isNext && <Ionicons name="arrow-back" size={14} color={colors.primary} />}
        <Text style={[styles.pagerTitle, { color: colors.text }]} numberOfLines={1}>
          {lesson.title}
        </Text>
        {isNext && <Ionicons name="arrow-forward" size={14} color={colors.primary} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    paddingTop: 4,
    paddingBottom: 48,
  },
  hero: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: -0.3,
  },
  heroSummary: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  section: {
    padding: 18,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  heading: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
  codeBlock: {
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  code: {
    // 'monospace' ใช้ได้บน Android/เว็บ แต่ iOS ต้องระบุชื่อฟอนต์จริง
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    fontSize: 13,
    lineHeight: 20,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    marginTop: 6,
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  pager: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  pagerButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
    padding: 14,
  },
  pagerButtonNext: {
    alignItems: 'flex-end',
  },
  pagerLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  pagerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  pagerTitleRowNext: {
    justifyContent: 'flex-end',
  },
  pagerTitle: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  notFoundText: {
    fontSize: 15,
  },
});
