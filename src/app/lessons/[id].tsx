// หน้าบทเรียนแต่ละบท (route "/lessons/:id") — [id] ในชื่อไฟล์คือ dynamic segment
// เหมือน app/lessons/[id]/page.tsx ใน Next.js แต่อ่านค่าด้วย useLocalSearchParams แทน props.params
import { Stack, useLocalSearchParams } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { IconBadge } from '@/components/IconBadge';
import { LESSONS } from '@/data/lessons';
import { useTheme } from '@/theme/ThemeProvider';
import { withAlpha } from '@/theme/colors';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = LESSONS.find((l) => l.id === id);
  const { colors } = useTheme();

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
    </ScrollView>
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
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 16,
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
