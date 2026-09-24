// หน้าบันทึก (route "/notes") — ประกอบ hook + components เข้าด้วยกัน
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotes } from '@/hooks/useNotes';
import { NoteItem } from '@/components/NoteItem';
import { NoteFormModal } from '@/components/NoteFormModal';
import { Card } from '@/components/Card';
import { IconBadge } from '@/components/IconBadge';
import { Note } from '@/types/note';
import { useTheme } from '@/theme/ThemeProvider';

export default function NotesScreen() {
  const { notes, isLoading, addNote, toggleDone, deleteNote, updateNote } = useNotes();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  // header ด้านบนจัดการ safe area ให้แล้ว เหลือแค่ขอบล่าง (home indicator) สำหรับปุ่ม +
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const openAddModal = () => {
    setEditingNote(null);
    setModalVisible(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setModalVisible(true);
  };

  const handleSubmit = (title: string, content: string) => {
    if (editingNote) {
      updateNote(editingNote.id, title, content);
    } else {
      addNote(title, content);
    }
  };

  return (
    <View style={styles.container}>
      {!isLoading && notes.length === 0 ? (
        <View style={styles.emptyState}>
          <IconBadge icon="document-text" color={colors.primary} size={88} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>ยังไม่มีบันทึก</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            กดปุ่ม + ด้านล่างเพื่อเพิ่มรายการแรกของคุณ
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: 110 + insets.bottom }]}
          // ส่วนหัวของลิสต์ เลื่อนไปพร้อมรายการ (ต่างจาก header ของ Stack ที่ค้างอยู่ด้านบน)
          ListHeaderComponent={isLoading ? null : <ProgressCard notes={notes} />}
          renderItem={({ item }) => (
            <NoteItem
              note={item}
              onToggle={toggleDone}
              onDelete={deleteNote}
              onPress={openEditModal}
            />
          )}
        />
      )}

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { bottom: 24 + insets.bottom, backgroundColor: colors.primary, shadowColor: colors.primary },
          pressed && styles.fabPressed,
        ]}
        onPress={openAddModal}
        accessibilityLabel="เพิ่มรายการ"
      >
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>

      <NoteFormModal
        visible={modalVisible}
        editingNote={editingNote}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

// การ์ดสรุปความคืบหน้า: เสร็จกี่รายการจากทั้งหมด + แถบ progress
function ProgressCard({ notes }: { notes: Note[] }) {
  const { colors } = useTheme();
  const doneCount = notes.filter((n) => n.done).length;
  const percent = notes.length ? Math.round((doneCount / notes.length) * 100) : 0;
  const allDone = doneCount === notes.length;

  return (
    <Card style={styles.progressCard}>
      <View style={styles.progressRow}>
        <View>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>ความคืบหน้า</Text>
          <Text style={[styles.progressValue, { color: colors.text }]}>
            {doneCount}
            <Text style={{ color: colors.textMuted }}> / {notes.length} เสร็จแล้ว</Text>
          </Text>
        </View>
        <Text style={[styles.progressPercent, { color: allDone ? colors.success : colors.primary }]}>
          {percent}%
        </Text>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: colors.primarySoft }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${percent}%`, backgroundColor: allDone ? colors.success : colors.primary },
          ]}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  progressCard: {
    padding: 18,
    marginBottom: 20,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  progressPercent: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  fabPressed: {
    transform: [{ scale: 0.94 }],
  },
});
