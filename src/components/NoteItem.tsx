// การ์ดแสดงรายการ 1 โน้ต
// จุดต่างจากเว็บ: ไม่มี <div onClick>, ปุ่ม/พื้นที่กดต้องใช้ <TouchableOpacity> หรือ <Pressable>
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { Note } from '../types/note';

type Props = {
  note: Note;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (note: Note) => void; // กดที่การ์ดเพื่อเปิดแก้ไข
};

export function NoteItem({ note, onToggle, onDelete, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(note)}
      activeOpacity={0.7}
    >
      <Checkbox
        value={note.done}
        onValueChange={() => onToggle(note.id)}
        color={note.done ? '#4f46e5' : undefined}
        style={styles.checkbox}
      />

      <View style={styles.textContainer}>
        <Text style={[styles.title, note.done && styles.doneText]} numberOfLines={1}>
          {note.title}
        </Text>
        {note.content ? (
          <Text style={[styles.content, note.done && styles.doneText]} numberOfLines={2}>
            {note.content}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={() => onDelete(note.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  checkbox: {
    borderRadius: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  doneText: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
});
