// หน้าตั้งค่า (route "/settings") — ตอนนี้มีสวิตช์โหมดมืด/สว่าง
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { IconBadge } from '@/components/IconBadge';
import { useTheme } from '@/theme/ThemeProvider';

export default function SettingsScreen() {
  const { mode, colors, setMode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>การแสดงผล</Text>

      <Card style={styles.row}>
        <IconBadge icon={isDark ? 'moon' : 'sunny'} color={isDark ? '#7c7cf0' : '#f59e0b'} size={40} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>โหมดมืด</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {isDark ? 'เปิดอยู่' : 'ปิดอยู่ (โหมดสว่าง)'}
          </Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={(value) => setMode(value ? 'dark' : 'light')}
          trackColor={{ true: colors.primary, false: colors.border }}
          thumbColor="#fff"
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    marginTop: 2,
  },
});
