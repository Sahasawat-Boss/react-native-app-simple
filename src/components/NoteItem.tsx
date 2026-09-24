// การ์ดแสดงรายการ 1 โน้ต
// จุดต่างจากเว็บ: ไม่มี <div onClick>, ปุ่ม/พื้นที่กดต้องใช้ <Pressable> หรือ <TouchableOpacity>
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '../types/note';
import { useTheme } from '../theme/ThemeProvider';
import { useCardStyle } from './Card';

type Props = {
  note: Note;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (note: Note) => void; // กดที่การ์ดเพื่อเปิดแก้ไข
};

export function NoteItem({ note, onToggle, onDelete, onPress }: Props) {
  const { colors } = useTheme();
  const cardStyle = useCardStyle();
  const doneStyle = note.done && [styles.doneText, { color: colors.textMuted }];
  const date = new Date(note.createdAt).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <Pressable
      style={({ pressed }) => [
        cardStyle,
        styles.card,
        note.done && styles.cardDone,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(note)}
    >
      {/* checkbox วงกลมทำเองจากไอคอน: หน้าตาเหมือนกันทุก platform (expo-checkbox บนเว็บดูไม่เข้าชุด) */}
      <Pressable
        onPress={() => onToggle(note.id)}
        hitSlop={10}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: note.done }}
      >
        <Ionicons
          name={note.done ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={note.done ? colors.success : colors.textMuted}
        />
      </Pressable>

      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.text }, doneStyle]} numberOfLines={1}>
          {note.title}
        </Text>
        {note.content ? (
          <Text
            style={[styles.content, { color: colors.textSecondary }, doneStyle]}
            numberOfLines={2}
          >
            {note.content}
          </Text>
        ) : null}
        <Text style={[styles.date, { color: colors.textMuted }]}>{date}</Text>
      </View>

      <Pressable
        onPress={() => onDelete(note.id)}
        hitSlop={8}
        style={({ pressed }) => [
          styles.deleteButton,
          { backgroundColor: colors.dangerSoft },
          pressed && styles.cardPressed,
        ]}
        accessibilityLabel="ลบรายการ"
      >
        <Ionicons name="trash-outline" size={16} color={colors.danger} />
      </Pressable>
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
  cardDone: {
    opacity: 0.7,
  },
  cardPressed: {
    opacity: 0.6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 3,
  },
  date: {
    fontSize: 12,
    marginTop: 6,
  },
  doneText: {
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
